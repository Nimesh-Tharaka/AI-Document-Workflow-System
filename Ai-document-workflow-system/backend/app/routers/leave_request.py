from pathlib import Path
from uuid import uuid4
import shutil

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import (
    LeaveRequestDocument,
    LeaveRequestComment,
    LeaveRequestAuditLog,
    User,
)
from ..schemas import (
    LeaveRequestOut,
    LeaveRequestStatusUpdate,
    LeaveRequestManualRouteUpdate,
    LeaveRequestCommentCreate,
    LeaveRequestCommentOut,
    LeaveRequestAuditLogOut,
)
from ..services.pdf_service import extract_text
from ..services.leave_request_gemini_service import analyze_leave_request_text
from ..services.n8n_service import send_n8n_event
from ..core.deps import get_current_user, require_roles

router = APIRouter(prefix="/api/leave-requests", tags=["Leave Requests"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


def create_audit_log(db: Session, leave_request_id: int, action: str, details: str = ""):
    log = LeaveRequestAuditLog(
        leave_request_id=leave_request_id,
        action=action,
        details=details,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


@router.post("/upload", response_model=LeaveRequestOut)
def upload_leave_request(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "staff")),
):
    allowed_extensions = [".pdf", ".png", ".jpg", ".jpeg"]
    extension = Path(file.filename).suffix.lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, PNG, JPG, and JPEG files are allowed.",
        )

    saved_name = f"{uuid4()}{extension}"
    saved_path = UPLOAD_DIR / saved_name

    with open(saved_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        extracted_text = extract_text(str(saved_path))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text extraction failed: {str(e)}")

    if not extracted_text.strip():
        raise HTTPException(
            status_code=400,
            detail="No text could be extracted from this file.",
        )

    try:
        ai_data = analyze_leave_request_text(extracted_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Leave request analysis failed: {str(e)}")

    leave_request = LeaveRequestDocument(
        filename=file.filename,
        file_path=str(saved_path),
        document_type=ai_data.get("document_type", "leave_request"),
        employee_name=ai_data.get("employee_name", ""),
        leave_type=ai_data.get("leave_type", ""),
        start_date=ai_data.get("start_date", ""),
        end_date=ai_data.get("end_date", ""),
        reason=ai_data.get("reason", ""),
        department=ai_data.get("department", ""),
        summary=ai_data.get("summary", ""),
        extracted_text=extracted_text,
        status="processed",
        assigned_department="",
        routing_status="unassigned",
        routing_reason="",
    )

    db.add(leave_request)
    db.commit()
    db.refresh(leave_request)

    create_audit_log(
        db,
        leave_request.id,
        "uploaded",
        f"Leave request '{leave_request.filename}' uploaded by {current_user.username}.",
    )

    send_n8n_event(
        "leave-request-routing",
        {
            "leave_request_id": leave_request.id,
            "filename": leave_request.filename,
            "document_type": leave_request.document_type,
            "employee_name": leave_request.employee_name,
            "leave_type": leave_request.leave_type,
            "start_date": leave_request.start_date,
            "end_date": leave_request.end_date,
            "department": leave_request.department,
            "status": leave_request.status,
            "actor": current_user.username,
        },
    )

    return leave_request


@router.get("", response_model=list[LeaveRequestOut])
def get_leave_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    leave_requests = db.query(LeaveRequestDocument).order_by(LeaveRequestDocument.id.desc()).all()
    return leave_requests


@router.get("/{leave_request_id}", response_model=LeaveRequestOut)
def get_leave_request_by_id(
    leave_request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    leave_request = db.query(LeaveRequestDocument).filter(LeaveRequestDocument.id == leave_request_id).first()

    if not leave_request:
        raise HTTPException(status_code=404, detail="Leave request not found")

    return leave_request


@router.patch("/{leave_request_id}/status", response_model=LeaveRequestOut)
def update_leave_request_status(
    leave_request_id: int,
    payload: LeaveRequestStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "approver")),
):
    leave_request = db.query(LeaveRequestDocument).filter(LeaveRequestDocument.id == leave_request_id).first()

    if not leave_request:
        raise HTTPException(status_code=404, detail="Leave request not found")

    old_status = leave_request.status
    leave_request.status = payload.status
    db.commit()
    db.refresh(leave_request)

    if payload.comment and payload.comment.strip():
        comment = LeaveRequestComment(
            leave_request_id=leave_request.id,
            action=payload.status,
            comment=payload.comment.strip(),
        )
        db.add(comment)
        db.commit()

    create_audit_log(
        db,
        leave_request.id,
        "status_updated",
        f"Status changed from '{old_status}' to '{payload.status}' by {current_user.username}.",
    )

    send_n8n_event(
        "leave-request-approval",
        {
            "leave_request_id": leave_request.id,
            "status": leave_request.status,
            "assigned_department": leave_request.assigned_department,
            "routing_status": leave_request.routing_status,
            "comment": payload.comment or "",
            "actor": current_user.username,
        },
    )

    return leave_request


@router.post("/{leave_request_id}/route/auto", response_model=LeaveRequestOut)
def auto_route_leave_request(
    leave_request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "approver")),
):
    leave_request = db.query(LeaveRequestDocument).filter(LeaveRequestDocument.id == leave_request_id).first()

    if not leave_request:
        raise HTTPException(status_code=404, detail="Leave request not found")

    leave_request.assigned_department = "HR"
    leave_request.routing_status = "routed"
    leave_request.routing_reason = "Auto-routed to HR for leave approval workflow."

    if leave_request.status == "processed":
        leave_request.status = "pending_review"

    db.commit()
    db.refresh(leave_request)

    create_audit_log(
        db,
        leave_request.id,
        "auto_routed",
        f"Leave request auto-routed to HR by {current_user.username}.",
    )

    return leave_request


@router.patch("/{leave_request_id}/route/manual", response_model=LeaveRequestOut)
def manually_assign_leave_request(
    leave_request_id: int,
    payload: LeaveRequestManualRouteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "approver")),
):
    leave_request = db.query(LeaveRequestDocument).filter(LeaveRequestDocument.id == leave_request_id).first()

    if not leave_request:
        raise HTTPException(status_code=404, detail="Leave request not found")

    leave_request.assigned_department = payload.department
    leave_request.routing_status = "manually_assigned"
    leave_request.routing_reason = (
        payload.comment.strip()
        if payload.comment and payload.comment.strip()
        else f"Leave request manually assigned to {payload.department}."
    )

    if leave_request.status == "processed":
        leave_request.status = "pending_review"

    db.commit()
    db.refresh(leave_request)

    create_audit_log(
        db,
        leave_request.id,
        "manually_assigned",
        f"Leave request manually assigned to {payload.department} by {current_user.username}.",
    )

    return leave_request


@router.post("/{leave_request_id}/comments", response_model=LeaveRequestCommentOut)
def add_leave_request_comment(
    leave_request_id: int,
    payload: LeaveRequestCommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "approver")),
):
    leave_request = db.query(LeaveRequestDocument).filter(LeaveRequestDocument.id == leave_request_id).first()

    if not leave_request:
        raise HTTPException(status_code=404, detail="Leave request not found")

    if not payload.comment.strip():
        raise HTTPException(status_code=400, detail="Comment cannot be empty")

    comment = LeaveRequestComment(
        leave_request_id=leave_request.id,
        action="comment",
        comment=payload.comment.strip(),
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    create_audit_log(
        db,
        leave_request.id,
        "comment_added",
        f"Leave request comment added by {current_user.username}.",
    )

    return comment


@router.get("/{leave_request_id}/comments", response_model=list[LeaveRequestCommentOut])
def get_leave_request_comments(
    leave_request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    leave_request = db.query(LeaveRequestDocument).filter(LeaveRequestDocument.id == leave_request_id).first()

    if not leave_request:
        raise HTTPException(status_code=404, detail="Leave request not found")

    comments = (
        db.query(LeaveRequestComment)
        .filter(LeaveRequestComment.leave_request_id == leave_request_id)
        .order_by(LeaveRequestComment.id.desc())
        .all()
    )
    return comments


@router.get("/{leave_request_id}/audit-logs", response_model=list[LeaveRequestAuditLogOut])
def get_leave_request_audit_logs(
    leave_request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    leave_request = db.query(LeaveRequestDocument).filter(LeaveRequestDocument.id == leave_request_id).first()

    if not leave_request:
        raise HTTPException(status_code=404, detail="Leave request not found")

    logs = (
        db.query(LeaveRequestAuditLog)
        .filter(LeaveRequestAuditLog.leave_request_id == leave_request_id)
        .order_by(LeaveRequestAuditLog.id.desc())
        .all()
    )
    return logs