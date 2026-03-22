from pathlib import Path
from uuid import uuid4
import shutil
import re
from typing import Optional

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import InvoiceDocument, ApprovalComment, AuditLog, User
from ..schemas import (
    InvoiceOut,
    InvoiceStatusUpdate,
    InvoiceManualRouteUpdate,
    ApprovalCommentCreate,
    ApprovalCommentOut,
    AuditLogOut,
)
from ..services.pdf_service import extract_text
from ..services.gemini_service import analyze_invoice_text
from ..services.n8n_service import send_n8n_event
from ..core.deps import get_current_user, require_roles

router = APIRouter(prefix="/api/invoices", tags=["Invoices"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


def create_audit_log(db: Session, invoice_id: int, action: str, details: str = ""):
    log = AuditLog(
        invoice_id=invoice_id,
        action=action,
        details=details,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def parse_amount(amount_text: Optional[str]) -> float:
    if not amount_text:
        return 0.0

    cleaned = (
        str(amount_text)
        .replace("Rs.", "")
        .replace("Rs", "")
        .replace("LKR", "")
        .replace("USD", "")
        .replace("EUR", "")
        .replace("GBP", "")
        .replace("$", "")
        .replace(",", "")
        .strip()
    )

    match = re.search(r"-?\d+(?:\.\d+)?", cleaned)
    return float(match.group(0)) if match else 0.0


@router.post("/upload", response_model=InvoiceOut)
def upload_invoice(
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
        ai_data = analyze_invoice_text(extracted_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Invoice analysis failed: {str(e)}")

    invoice = InvoiceDocument(
        filename=file.filename,
        file_path=str(saved_path),
        document_type=ai_data.get("document_type", "invoice"),
        vendor_name=ai_data.get("vendor_name", ""),
        invoice_number=ai_data.get("invoice_number", ""),
        invoice_date=ai_data.get("invoice_date", ""),
        due_date=ai_data.get("due_date", ""),
        total_amount=ai_data.get("total_amount", ""),
        currency=ai_data.get("currency", ""),
        summary=ai_data.get("summary", ""),
        extracted_text=extracted_text,
        status="processed",
        assigned_department="",
        routing_status="unassigned",
        routing_reason="",
    )

    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    create_audit_log(
        db,
        invoice.id,
        "uploaded",
        f"Invoice '{invoice.filename}' uploaded by {current_user.username}.",
    )

    send_n8n_event(
        "invoice-routing",
        {
            "invoice_id": invoice.id,
            "filename": invoice.filename,
            "document_type": invoice.document_type,
            "vendor_name": invoice.vendor_name,
            "invoice_number": invoice.invoice_number,
            "total_amount": invoice.total_amount,
            "currency": invoice.currency,
            "status": invoice.status,
            "actor": current_user.username,
        },
    )

    return invoice


@router.get("", response_model=list[InvoiceOut])
def get_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    invoices = db.query(InvoiceDocument).order_by(InvoiceDocument.id.desc()).all()
    return invoices


@router.get("/{invoice_id}", response_model=InvoiceOut)
def get_invoice_by_id(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    invoice = db.query(InvoiceDocument).filter(InvoiceDocument.id == invoice_id).first()

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    return invoice


@router.patch("/{invoice_id}/status", response_model=InvoiceOut)
def update_invoice_status(
    invoice_id: int,
    payload: InvoiceStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "approver")),
):
    invoice = db.query(InvoiceDocument).filter(InvoiceDocument.id == invoice_id).first()

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    old_status = invoice.status
    invoice.status = payload.status
    db.commit()
    db.refresh(invoice)

    if payload.comment and payload.comment.strip():
        approval_comment = ApprovalComment(
            invoice_id=invoice.id,
            action=payload.status,
            comment=payload.comment.strip(),
        )
        db.add(approval_comment)
        db.commit()

    create_audit_log(
        db,
        invoice.id,
        "status_updated",
        f"Status changed from '{old_status}' to '{payload.status}' by {current_user.username}.",
    )

    send_n8n_event(
        "invoice-approval",
        {
            "invoice_id": invoice.id,
            "status": invoice.status,
            "assigned_department": invoice.assigned_department,
            "routing_status": invoice.routing_status,
            "comment": payload.comment or "",
            "actor": current_user.username,
        },
    )

    return invoice


@router.post("/{invoice_id}/route/auto", response_model=InvoiceOut)
def auto_route_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "approver")),
):
    invoice = db.query(InvoiceDocument).filter(InvoiceDocument.id == invoice_id).first()

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    amount = parse_amount(invoice.total_amount)
    invoice.assigned_department = "Finance"
    invoice.routing_status = "routed"

    if amount >= 100000:
        invoice.routing_reason = (
            "Auto-routed to Finance because this is a high-value invoice and requires review."
        )
    else:
        invoice.routing_reason = (
            "Auto-routed to Finance for standard invoice processing."
        )

    if invoice.status == "processed":
        invoice.status = "pending_review"

    db.commit()
    db.refresh(invoice)

    create_audit_log(
        db,
        invoice.id,
        "auto_routed",
        f"Invoice auto-routed to {invoice.assigned_department} by {current_user.username}.",
    )

    return invoice


@router.patch("/{invoice_id}/route/manual", response_model=InvoiceOut)
def manually_assign_invoice(
    invoice_id: int,
    payload: InvoiceManualRouteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "approver")),
):
    invoice = db.query(InvoiceDocument).filter(InvoiceDocument.id == invoice_id).first()

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    invoice.assigned_department = payload.department
    invoice.routing_status = "manually_assigned"
    invoice.routing_reason = (
        payload.comment.strip()
        if payload.comment and payload.comment.strip()
        else f"Invoice manually assigned to {payload.department}."
    )

    if invoice.status == "processed":
        invoice.status = "pending_review"

    db.commit()
    db.refresh(invoice)

    create_audit_log(
        db,
        invoice.id,
        "manually_assigned",
        f"Invoice manually assigned to {payload.department} by {current_user.username}.",
    )

    return invoice


@router.post("/{invoice_id}/comments", response_model=ApprovalCommentOut)
def add_approval_comment(
    invoice_id: int,
    payload: ApprovalCommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "approver")),
):
    invoice = db.query(InvoiceDocument).filter(InvoiceDocument.id == invoice_id).first()

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    if not payload.comment.strip():
        raise HTTPException(status_code=400, detail="Comment cannot be empty")

    comment = ApprovalComment(
        invoice_id=invoice.id,
        action="comment",
        comment=payload.comment.strip(),
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    create_audit_log(
        db,
        invoice.id,
        "comment_added",
        f"Approval comment added by {current_user.username}.",
    )

    return comment


@router.get("/{invoice_id}/comments", response_model=list[ApprovalCommentOut])
def get_approval_comments(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    invoice = db.query(InvoiceDocument).filter(InvoiceDocument.id == invoice_id).first()

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    comments = (
        db.query(ApprovalComment)
        .filter(ApprovalComment.invoice_id == invoice_id)
        .order_by(ApprovalComment.id.desc())
        .all()
    )
    return comments


@router.get("/{invoice_id}/audit-logs", response_model=list[AuditLogOut])
def get_audit_logs(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    invoice = db.query(InvoiceDocument).filter(InvoiceDocument.id == invoice_id).first()

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    logs = (
        db.query(AuditLog)
        .filter(AuditLog.invoice_id == invoice_id)
        .order_by(AuditLog.id.desc())
        .all()
    )
    return logs