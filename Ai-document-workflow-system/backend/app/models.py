from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=True)
    email = Column(String(255), unique=True, nullable=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="staff")
    is_active = Column(String(10), nullable=False, default="true")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class InvoiceDocument(Base):
    __tablename__ = "invoice_documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)

    document_type = Column(String(100), nullable=True)
    vendor_name = Column(String(255), nullable=True)
    invoice_number = Column(String(100), nullable=True)
    invoice_date = Column(String(100), nullable=True)
    due_date = Column(String(100), nullable=True)
    total_amount = Column(String(100), nullable=True)
    currency = Column(String(50), nullable=True)
    summary = Column(Text, nullable=True)
    extracted_text = Column(Text, nullable=True)
    status = Column(String(50), nullable=False, default="processed")

    assigned_department = Column(String(100), nullable=True)
    routing_status = Column(String(50), nullable=False, default="unassigned")
    routing_reason = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ApprovalComment(Base):
    __tablename__ = "approval_comments"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoice_documents.id", ondelete="CASCADE"), nullable=False)
    action = Column(String(50), nullable=True)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoice_documents.id", ondelete="CASCADE"), nullable=False)
    action = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class LeaveRequestDocument(Base):
    __tablename__ = "leave_request_documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)

    document_type = Column(String(100), nullable=True)
    employee_name = Column(String(255), nullable=True)
    leave_type = Column(String(100), nullable=True)
    start_date = Column(String(100), nullable=True)
    end_date = Column(String(100), nullable=True)
    reason = Column(Text, nullable=True)
    department = Column(String(100), nullable=True)

    summary = Column(Text, nullable=True)
    extracted_text = Column(Text, nullable=True)
    status = Column(String(50), nullable=False, default="processed")

    assigned_department = Column(String(100), nullable=True)
    routing_status = Column(String(50), nullable=False, default="unassigned")
    routing_reason = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class LeaveRequestComment(Base):
    __tablename__ = "leave_request_comments"

    id = Column(Integer, primary_key=True, index=True)
    leave_request_id = Column(Integer, ForeignKey("leave_request_documents.id", ondelete="CASCADE"), nullable=False)
    action = Column(String(50), nullable=True)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ComplaintDocument(Base):
    __tablename__ = "complaint_documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)

    document_type = Column(String(100), nullable=True)
    customer_name = Column(String(255), nullable=True)
    complaint_type = Column(String(100), nullable=True)
    issue_summary = Column(Text, nullable=True)
    urgency = Column(String(50), nullable=True)
    department = Column(String(100), nullable=True)

    summary = Column(Text, nullable=True)
    extracted_text = Column(Text, nullable=True)
    status = Column(String(50), nullable=False, default="processed")

    assigned_department = Column(String(100), nullable=True)
    routing_status = Column(String(50), nullable=False, default="unassigned")
    routing_reason = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ComplaintComment(Base):
    __tablename__ = "complaint_comments"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaint_documents.id", ondelete="CASCADE"), nullable=False)
    action = Column(String(50), nullable=True)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ComplaintAuditLog(Base):
    __tablename__ = "complaint_audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaint_documents.id", ondelete="CASCADE"), nullable=False)
    action = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class LeaveRequestAuditLog(Base):
    __tablename__ = "leave_request_audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    leave_request_id = Column(Integer, ForeignKey("leave_request_documents.id", ondelete="CASCADE"), nullable=False)
    action = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    