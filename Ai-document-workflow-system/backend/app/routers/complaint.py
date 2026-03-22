from pathlib import Path
from uuid import uuid4
import shutil

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import (
    ComplaintDocument,
    ComplaintComment,
    ComplaintAuditLog,
    User,
)
from ..schemas import (
    ComplaintOut,
    ComplaintStatusUpdate,
    ComplaintManualRouteUpdate,
    ComplaintCommentCreate,
    ComplaintCommentOut,
    ComplaintAuditLogOut,
)
from ..services.pdf_service import extract_text
from ..services.complaint_gemini_service import analyze_complaint_text
from ..services.n8n_service import send_n8n_event
from ..core.deps import get_current_user, require_roles

router = APIRouter(prefix="/api/complaints", tags=["Complaints"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


def create_audit_log(db: Session, complaint_id: int, action: str, details: str = ""):
    log = ComplaintAuditLog(
        complaint_id=complaint_id,
        action=action,
        details=details,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


@router.post("/upload", response_model=ComplaintOut)
def upload_complaint(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "staff")),
):
    allowed_extensions = [".pdf", ".png", ".jpg", ".jpeg"]
    extension = Path(file.filename).suffix.lower()

    if extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Only PDF, PNG, JPG, and JPEG files are allowed.")

    saved_name = f"{uuid4()}{extension}"
    saved_path = UPLOAD_DIR / saved_name

    with open(saved_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        extracted_text = extract_text(str(saved_path))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text extraction failed: {str(e)}")

    if not extracted_text.strip():
        raise HTTPException(status_code=400, detail="No text could be extracted from this file.")

    try:
        ai_data = analyze_complaint_text(extracted_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Complaint analysis failed: {str(e)}")

    complaint = ComplaintDocument(
        filename=file.filename,
        file_path=str(saved_path),
        document_type=ai_data.get("document_type", "complaint"),
        customer_name=ai_data.get("customer_name", ""),
        complaint_type=ai_data.get("complaint_type", ""),
        issue_summary=ai_data.get("issue_summary", ""),
        urgency=ai_data.get("urgency", ""),
        department=ai_data.get("department", ""),
        summary=ai_data.get("summary", ""),
        extracted_text=extracted_text,
        status="processed",
        assigned_department="",
        routing_status="unassigned",
        routing_reason="",
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    create_audit_log(
        db,
        complaint.id,
        "uploaded",
        f"Complaint '{complaint.filename}' uploaded by {current_user.username}.",
    )

    send_n8n_event(
        "complaint-routing",
        {
            "complaint_id": complaint.id,
            "filename": complaint.filename,
            "document_type": complaint.document_type,
            "customer_name": complaint.customer_name,
            "complaint_type": complaint.complaint_type,
            "urgency": complaint.urgency,
            "department": complaint.department,
            "status": complaint.status,
            "actor": current_user.username,
        },
    )

    return complaint


@router.get("", response_model=list[ComplaintOut])
def get_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    complaints = db.query(ComplaintDocument).order_by(ComplaintDocument.id.desc()).all()
    return complaints


@router.get("/{complaint_id}", response_model=ComplaintOut)
def get_complaint_by_id(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    complaint = db.query(ComplaintDocument).filter(ComplaintDocument.id == complaint_id).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    return complaint


@router.patch("/{complaint_id}/status", response_model=ComplaintOut)
def update_complaint_status(
    complaint_id: int,
    payload: ComplaintStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "approver")),
):
    complaint = db.query(ComplaintDocument).filter(ComplaintDocument.id == complaint_id).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    old_status = complaint.status
    complaint.status = payload.status
    db.commit()
    db.refresh(complaint)

    if payload.comment and payload.comment.strip():
        comment = ComplaintComment(
            complaint_id=complaint.id,
            action=payload.status,
            comment=payload.comment.strip(),
        )
        db.add(comment)
        db.commit()

    create_audit_log(
        db,
        complaint.id,
        "status_updated",
        f"Status changed from '{old_status}' to '{payload.status}' by {current_user.username}.",
    )

    send_n8n_event(
        "complaint-approval",
        {
            "complaint_id": complaint.id,
            "status": complaint.status,
            "assigned_department": complaint.assigned_department,
            "routing_status": complaint.routing_status,
            "comment": payload.comment or "",
            "actor": current_user.username,
        },
    )

    return complaint


@router.post("/{complaint_id}/route/auto", response_model=ComplaintOut)
def auto_route_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "approver")),
):
    complaint = db.query(ComplaintDocument).filter(ComplaintDocument.id == complaint_id).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    urgency = (complaint.urgency or "").lower()

    if urgency in ["high", "critical"]:
        complaint.assigned_department = "Operations"
        complaint.routing_reason = "Auto-routed to Operations because this complaint is high priority."
    else:
        complaint.assigned_department = "Customer Support"
        complaint.routing_reason = "Auto-routed to Customer Support for standard complaint handling."

    complaint.routing_status = "routed"

    if complaint.status == "processed":
        complaint.status = "pending_review"

    db.commit()
    db.refresh(complaint)

    create_audit_log(
        db,
        complaint.id,
        "auto_routed",
        f"Complaint auto-routed to {complaint.assigned_department} by {current_user.username}.",
    )

    return complaint


@router.patch("/{complaint_id}/route/manual", response_model=ComplaintOut)
def manually_assign_complaint(
    complaint_id: int,
    payload: ComplaintManualRouteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "approver")),
):
    complaint = db.query(ComplaintDocument).filter(ComplaintDocument.id == complaint_id).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    complaint.assigned_department = payload.department
    complaint.routing_status = "manually_assigned"
    complaint.routing_reason = (
        payload.comment.strip()
        if payload.comment and payload.comment.strip()
        else f"Complaint manually assigned to {payload.department}."
    )

    if complaint.status == "processed":
        complaint.status = "pending_review"

    db.commit()
    db.refresh(complaint)

    create_audit_log(
        db,
        complaint.id,
        "manually_assigned",
        f"Complaint manually assigned to {payload.department} by {current_user.username}.",
    )

    return complaint


@router.post("/{complaint_id}/comments", response_model=ComplaintCommentOut)
def add_complaint_comment(
    complaint_id: int,
    payload: ComplaintCommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "approver")),
):
    complaint = db.query(ComplaintDocument).filter(ComplaintDocument.id == complaint_id).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    if not payload.comment.strip():
        raise HTTPException(status_code=400, detail="Comment cannot be empty")

    comment = ComplaintComment(
        complaint_id=complaint.id,
        action="comment",
        comment=payload.comment.strip(),
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    create_audit_log(
        db,
        complaint.id,
        "comment_added",
        f"Complaint comment added by {current_user.username}.",
    )

    return comment


@router.get("/{complaint_id}/comments", response_model=list[ComplaintCommentOut])
def get_complaint_comments(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    complaint = db.query(ComplaintDocument).filter(ComplaintDocument.id == complaint_id).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    comments = (
        db.query(ComplaintComment)
        .filter(ComplaintComment.complaint_id == complaint_id)
        .order_by(ComplaintComment.id.desc())
        .all()
    )
    return comments


@router.get("/{complaint_id}/audit-logs", response_model=list[ComplaintAuditLogOut])
def get_complaint_audit_logs(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    complaint = db.query(ComplaintDocument).filter(ComplaintDocument.id == complaint_id).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    logs = (
        db.query(ComplaintAuditLog)
        .filter(ComplaintAuditLog.complaint_id == complaint_id)
        .order_by(ComplaintAuditLog.id.desc())
        .all()
    )
    return logs