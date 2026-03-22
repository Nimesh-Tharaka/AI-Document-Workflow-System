from pathlib import Path
from uuid import uuid4
import shutil

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import (
    InvoiceDocument,
    AuditLog,
    LeaveRequestDocument,
    LeaveRequestAuditLog,
    ComplaintDocument,
    ComplaintAuditLog,
    User,
)
from ..schemas import UniversalUploadOut
from ..services.pdf_service import extract_text
from ..services.document_classifier_service import detect_document_type
from ..services.gemini_service import analyze_invoice_text
from ..services.leave_request_gemini_service import analyze_leave_request_text
from ..services.complaint_gemini_service import analyze_complaint_text
from ..services.n8n_service import send_n8n_event
from ..core.deps import require_roles

router = APIRouter(prefix="/api/documents", tags=["Document Hub"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


def create_invoice_audit_log(db: Session, invoice_id: int, action: str, details: str = ""):
    log = AuditLog(
        invoice_id=invoice_id,
        action=action,
        details=details,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def create_leave_request_audit_log(
    db: Session,
    leave_request_id: int,
    action: str,
    details: str = "",
):
    log = LeaveRequestAuditLog(
        leave_request_id=leave_request_id,
        action=action,
        details=details,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def create_complaint_audit_log(
    db: Session,
    complaint_id: int,
    action: str,
    details: str = "",
):
    log = ComplaintAuditLog(
        complaint_id=complaint_id,
        action=action,
        details=details,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


@router.post("/upload-universal", response_model=UniversalUploadOut)
def upload_universal_document(
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

    detected_type = detect_document_type(extracted_text, file.filename)

    if detected_type == "invoice":
        ai_data = analyze_invoice_text(extracted_text)

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

        create_invoice_audit_log(
            db,
            invoice.id,
            "uploaded",
            f"Invoice '{invoice.filename}' uploaded by {current_user.username} via universal upload.",
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

        return {
            "document_type": "invoice",
            "document_id": invoice.id,
            "filename": invoice.filename,
            "redirect_path": f"/invoices/{invoice.id}",
            "message": "Document detected as invoice and processed successfully.",
        }

    if detected_type == "leave_request":
        ai_data = analyze_leave_request_text(extracted_text)

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

        create_leave_request_audit_log(
            db,
            leave_request.id,
            "uploaded",
            f"Leave request '{leave_request.filename}' uploaded by {current_user.username} via universal upload.",
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

        return {
            "document_type": "leave_request",
            "document_id": leave_request.id,
            "filename": leave_request.filename,
            "redirect_path": f"/leave-requests/{leave_request.id}",
            "message": "Document detected as leave request and processed successfully.",
        }

    if detected_type == "complaint":
        ai_data = analyze_complaint_text(extracted_text)

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

        create_complaint_audit_log(
            db,
            complaint.id,
            "uploaded",
            f"Complaint '{complaint.filename}' uploaded by {current_user.username} via universal upload.",
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

        return {
            "document_type": "complaint",
            "document_id": complaint.id,
            "filename": complaint.filename,
            "redirect_path": f"/complaints/{complaint.id}",
            "message": "Document detected as complaint and processed successfully.",
        }

    raise HTTPException(
        status_code=400,
        detail="Could not confidently detect the document type. Please upload it from the correct module page.",
    )