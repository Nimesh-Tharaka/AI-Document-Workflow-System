import os
from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import (
    InvoiceDocument,
    AuditLog,
    ApprovalComment,
    LeaveRequestDocument,
    LeaveRequestAuditLog,
    LeaveRequestComment,
)

from ..models import (
    InvoiceDocument,
    AuditLog,
    ApprovalComment,
    LeaveRequestDocument,
    LeaveRequestAuditLog,
    LeaveRequestComment,
    ComplaintDocument,
    ComplaintAuditLog,
    ComplaintComment,
)

router = APIRouter(prefix="/api/internal/workflow", tags=["Workflow Internal"])


class RoutingResultIn(BaseModel):
    invoice_id: int
    assigned_department: str
    routing_status: str
    routing_reason: str = ""
    comment: str = ""


class ApprovalEventIn(BaseModel):
    invoice_id: int
    workflow_state: str
    details: str = ""
    comment: str = ""


class LeaveRequestRoutingResultIn(BaseModel):
    leave_request_id: int
    assigned_department: str
    routing_status: str
    routing_reason: str = ""
    comment: str = ""


class LeaveRequestApprovalEventIn(BaseModel):
    leave_request_id: int
    workflow_state: str
    details: str = ""
    comment: str = ""


def verify_service_key(x_service_key: str = Header(default="")):
    expected = os.getenv("SERVICE_API_KEY", "")
    if not expected or x_service_key != expected:
        raise HTTPException(status_code=401, detail="Invalid service key")


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


@router.post("/routing-result")
def apply_routing_result(
    payload: RoutingResultIn,
    db: Session = Depends(get_db),
    _: None = Depends(verify_service_key),
):
    invoice = db.query(InvoiceDocument).filter(InvoiceDocument.id == payload.invoice_id).first()

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    invoice.assigned_department = payload.assigned_department
    invoice.routing_status = payload.routing_status
    invoice.routing_reason = payload.routing_reason

    if invoice.status == "processed":
        invoice.status = "pending_review"

    db.commit()
    db.refresh(invoice)

    if payload.comment.strip():
        comment = ApprovalComment(
            invoice_id=invoice.id,
            action="routing",
            comment=payload.comment.strip(),
        )
        db.add(comment)
        db.commit()

    create_invoice_audit_log(
        db,
        invoice.id,
        "n8n_routing_applied",
        f"n8n routed invoice to {payload.assigned_department}.",
    )

    return {
        "ok": True,
        "invoice_id": invoice.id,
        "assigned_department": invoice.assigned_department,
        "routing_status": invoice.routing_status,
    }


@router.post("/approval-event")
def apply_approval_event(
    payload: ApprovalEventIn,
    db: Session = Depends(get_db),
    _: None = Depends(verify_service_key),
):
    invoice = db.query(InvoiceDocument).filter(InvoiceDocument.id == payload.invoice_id).first()

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    if payload.workflow_state == "approval_started":
        invoice.routing_status = "approval_in_progress"
    elif payload.workflow_state in ["approved", "rejected"]:
        invoice.routing_status = "workflow_completed"

    db.commit()
    db.refresh(invoice)

    if payload.comment.strip():
        comment = ApprovalComment(
            invoice_id=invoice.id,
            action=payload.workflow_state,
            comment=payload.comment.strip(),
        )
        db.add(comment)
        db.commit()

    create_invoice_audit_log(
        db,
        invoice.id,
        f"n8n_{payload.workflow_state}",
        payload.details or f"n8n processed approval event: {payload.workflow_state}",
    )

    return {
        "ok": True,
        "invoice_id": invoice.id,
        "routing_status": invoice.routing_status,
    }


@router.post("/leave-request-routing-result")
def apply_leave_request_routing_result(
    payload: LeaveRequestRoutingResultIn,
    db: Session = Depends(get_db),
    _: None = Depends(verify_service_key),
):
    leave_request = (
        db.query(LeaveRequestDocument)
        .filter(LeaveRequestDocument.id == payload.leave_request_id)
        .first()
    )

    if not leave_request:
        raise HTTPException(status_code=404, detail="Leave request not found")

    leave_request.assigned_department = payload.assigned_department
    leave_request.routing_status = payload.routing_status
    leave_request.routing_reason = payload.routing_reason

    if leave_request.status == "processed":
        leave_request.status = "pending_review"

    db.commit()
    db.refresh(leave_request)

    if payload.comment.strip():
        comment = LeaveRequestComment(
            leave_request_id=leave_request.id,
            action="routing",
            comment=payload.comment.strip(),
        )
        db.add(comment)
        db.commit()

    create_leave_request_audit_log(
        db,
        leave_request.id,
        "n8n_routing_applied",
        f"n8n routed leave request to {payload.assigned_department}.",
    )

    return {
        "ok": True,
        "leave_request_id": leave_request.id,
        "assigned_department": leave_request.assigned_department,
        "routing_status": leave_request.routing_status,
    }


@router.post("/leave-request-approval-event")
def apply_leave_request_approval_event(
    payload: LeaveRequestApprovalEventIn,
    db: Session = Depends(get_db),
    _: None = Depends(verify_service_key),
):
    leave_request = (
        db.query(LeaveRequestDocument)
        .filter(LeaveRequestDocument.id == payload.leave_request_id)
        .first()
    )

    if not leave_request:
        raise HTTPException(status_code=404, detail="Leave request not found")

    if payload.workflow_state == "approval_started":
        leave_request.routing_status = "approval_in_progress"
    elif payload.workflow_state in ["approved", "rejected"]:
        leave_request.routing_status = "workflow_completed"

    db.commit()
    db.refresh(leave_request)

    if payload.comment.strip():
        comment = LeaveRequestComment(
            leave_request_id=leave_request.id,
            action=payload.workflow_state,
            comment=payload.comment.strip(),
        )
        db.add(comment)
        db.commit()

    create_leave_request_audit_log(
        db,
        leave_request.id,
        f"n8n_{payload.workflow_state}",
        payload.details or f"n8n processed leave request approval event: {payload.workflow_state}",
    )

    return {
        "ok": True,
        "leave_request_id": leave_request.id,
        "routing_status": leave_request.routing_status,
    }

class ComplaintRoutingResultIn(BaseModel):
    complaint_id: int
    assigned_department: str
    routing_status: str
    routing_reason: str = ""
    comment: str = ""


class ComplaintApprovalEventIn(BaseModel):
    complaint_id: int
    workflow_state: str
    details: str = ""
    comment: str = ""

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

@router.post("/complaint-routing-result")
def apply_complaint_routing_result(
    payload: ComplaintRoutingResultIn,
    db: Session = Depends(get_db),
    _: None = Depends(verify_service_key),
):
    complaint = (
        db.query(ComplaintDocument)
        .filter(ComplaintDocument.id == payload.complaint_id)
        .first()
    )

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    complaint.assigned_department = payload.assigned_department
    complaint.routing_status = payload.routing_status
    complaint.routing_reason = payload.routing_reason

    if complaint.status == "processed":
        complaint.status = "pending_review"

    db.commit()
    db.refresh(complaint)

    if payload.comment.strip():
        comment = ComplaintComment(
            complaint_id=complaint.id,
            action="routing",
            comment=payload.comment.strip(),
        )
        db.add(comment)
        db.commit()

    create_complaint_audit_log(
        db,
        complaint.id,
        "n8n_routing_applied",
        f"n8n routed complaint to {payload.assigned_department}.",
    )

    return {
        "ok": True,
        "complaint_id": complaint.id,
        "assigned_department": complaint.assigned_department,
        "routing_status": complaint.routing_status,
    }


@router.post("/complaint-approval-event")
def apply_complaint_approval_event(
    payload: ComplaintApprovalEventIn,
    db: Session = Depends(get_db),
    _: None = Depends(verify_service_key),
):
    complaint = (
        db.query(ComplaintDocument)
        .filter(ComplaintDocument.id == payload.complaint_id)
        .first()
    )

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    if payload.workflow_state == "approval_started":
        complaint.routing_status = "approval_in_progress"
    elif payload.workflow_state in ["approved", "rejected"]:
        complaint.routing_status = "workflow_completed"

    db.commit()
    db.refresh(complaint)

    if payload.comment.strip():
        comment = ComplaintComment(
            complaint_id=complaint.id,
            action=payload.workflow_state,
            comment=payload.comment.strip(),
        )
        db.add(comment)
        db.commit()

    create_complaint_audit_log(
        db,
        complaint.id,
        f"n8n_{payload.workflow_state}",
        payload.details or f"n8n processed complaint approval event: {payload.workflow_state}",
    )

    return {
        "ok": True,
        "complaint_id": complaint.id,
        "routing_status": complaint.routing_status,
    }