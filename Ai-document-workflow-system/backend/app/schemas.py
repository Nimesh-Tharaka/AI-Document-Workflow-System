from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict


class UserOut(BaseModel):
    id: int
    username: str
    full_name: Optional[str] = None
    email: Optional[str] = None
    role: str
    is_active: str

    model_config = ConfigDict(from_attributes=True)


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


class InvoiceOut(BaseModel):
    id: int
    filename: str
    document_type: Optional[str] = None
    vendor_name: Optional[str] = None
    invoice_number: Optional[str] = None
    invoice_date: Optional[str] = None
    due_date: Optional[str] = None
    total_amount: Optional[str] = None
    currency: Optional[str] = None
    summary: Optional[str] = None
    extracted_text: Optional[str] = None
    status: str
    assigned_department: Optional[str] = None
    routing_status: Optional[str] = None
    routing_reason: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class InvoiceStatusUpdate(BaseModel):
    status: Literal["processed", "pending_review", "approved", "rejected", "needs_correction"]
    comment: Optional[str] = None


class InvoiceManualRouteUpdate(BaseModel):
    department: Literal["Finance", "Procurement", "Operations", "Administration"]
    comment: Optional[str] = None


class ApprovalCommentCreate(BaseModel):
    comment: str


class ApprovalCommentOut(BaseModel):
    id: int
    invoice_id: int
    action: Optional[str] = None
    comment: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class AuditLogOut(BaseModel):
    id: int
    invoice_id: int
    action: str
    details: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class LeaveRequestOut(BaseModel):
    id: int
    filename: str
    document_type: Optional[str] = None
    employee_name: Optional[str] = None
    leave_type: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    reason: Optional[str] = None
    department: Optional[str] = None
    summary: Optional[str] = None
    extracted_text: Optional[str] = None
    status: str
    assigned_department: Optional[str] = None
    routing_status: Optional[str] = None
    routing_reason: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class LeaveRequestStatusUpdate(BaseModel):
    status: Literal["processed", "pending_review", "approved", "rejected", "needs_correction"]
    comment: Optional[str] = None


class LeaveRequestManualRouteUpdate(BaseModel):
    department: Literal["HR", "Administration", "Operations"]
    comment: Optional[str] = None


class LeaveRequestCommentCreate(BaseModel):
    comment: str


class LeaveRequestCommentOut(BaseModel):
    id: int
    leave_request_id: int
    action: Optional[str] = None
    comment: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class LeaveRequestAuditLogOut(BaseModel):
    id: int
    leave_request_id: int
    action: str
    details: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class ComplaintOut(BaseModel):
    id: int
    filename: str
    document_type: Optional[str] = None
    customer_name: Optional[str] = None
    complaint_type: Optional[str] = None
    issue_summary: Optional[str] = None
    urgency: Optional[str] = None
    department: Optional[str] = None
    summary: Optional[str] = None
    extracted_text: Optional[str] = None
    status: str
    assigned_department: Optional[str] = None
    routing_status: Optional[str] = None
    routing_reason: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class ComplaintStatusUpdate(BaseModel):
    status: Literal["processed", "pending_review", "approved", "rejected", "needs_correction"]
    comment: Optional[str] = None


class ComplaintManualRouteUpdate(BaseModel):
    department: Literal["Customer Support", "Operations", "Administration"]
    comment: Optional[str] = None


class ComplaintCommentCreate(BaseModel):
    comment: str


class ComplaintCommentOut(BaseModel):
    id: int
    complaint_id: int
    action: Optional[str] = None
    comment: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class ComplaintAuditLogOut(BaseModel):
    id: int
    complaint_id: int
    action: str
    details: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class UniversalUploadOut(BaseModel):
    document_type: Literal["invoice", "leave_request", "complaint"]
    document_id: int
    filename: str
    redirect_path: str
    message: str