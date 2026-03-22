import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  fetchInvoiceById,
  updateInvoiceStatus,
  addApprovalComment,
  fetchApprovalComments,
  fetchAuditLogs,
  autoRouteInvoice,
  manuallyAssignInvoice,
} from "../api/invoiceApi";
import AppHeader from "../components/AppHeader";
import StatusBadge from "../components/StatusBadge";
import InvoiceStatusActions from "../components/InvoiceStatusActions";
import ApprovalCommentList from "../components/ApprovalCommentList";
import AuditLogList from "../components/AuditLogList";
import InvoiceRoutingCard from "../components/InvoiceRoutingCard";
import { useAuth } from "../context/AuthContext";

function InfoItem({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-800">{value || "-"}</p>
    </div>
  );
}

function TextPanel({ title, children, mono = false }) {
  return (
    <div className="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
      <h2 className="mb-2 text-lg font-semibold text-slate-900">{title}</h2>
      {mono ? (
        <pre className="max-h-[500px] overflow-auto whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
          {children || "-"}
        </pre>
      ) : (
        <p className="leading-7 text-slate-700">{children || "-"}</p>
      )}
    </div>
  );
}

export default function InvoiceDetailPage() {
  const { invoiceId } = useParams();
  const { user } = useAuth();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusLoading, setStatusLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState("");

  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsError, setLogsError] = useState("");

  async function loadInvoice() {
    setLoading(true);
    setError("");

    try {
      const data = await fetchInvoiceById(invoiceId);
      setInvoice(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadComments() {
    setCommentsLoading(true);
    setCommentsError("");

    try {
      const data = await fetchApprovalComments(invoiceId);
      setComments(data);
    } catch (err) {
      setCommentsError(err.message);
    } finally {
      setCommentsLoading(false);
    }
  }

  async function loadLogs() {
    setLogsLoading(true);
    setLogsError("");

    try {
      const data = await fetchAuditLogs(invoiceId);
      setLogs(data);
    } catch (err) {
      setLogsError(err.message);
    } finally {
      setLogsLoading(false);
    }
  }

  async function handleChangeStatus(newStatus, comment) {
    if (!invoice) return;

    setStatusLoading(true);
    setStatusMessage("");

    try {
      const updated = await updateInvoiceStatus(invoice.id, newStatus, comment);
      setInvoice(updated);
      setStatusMessage(`Status updated to "${updated.status}".`);
      await loadComments();
      await loadLogs();
    } catch (err) {
      setStatusMessage(err.message);
    } finally {
      setStatusLoading(false);
    }
  }

  async function handleAddComment(comment) {
    if (!invoice) return;

    setStatusLoading(true);
    setStatusMessage("");

    try {
      await addApprovalComment(invoice.id, comment);
      setStatusMessage("Comment added successfully.");
      await loadComments();
      await loadLogs();
    } catch (err) {
      setStatusMessage(err.message);
    } finally {
      setStatusLoading(false);
    }
  }

  async function handleAutoRoute() {
    if (!invoice) return;

    setStatusLoading(true);
    setStatusMessage("");

    try {
      const updated = await autoRouteInvoice(invoice.id);
      setInvoice(updated);
      setStatusMessage("Invoice routed automatically.");
      await loadLogs();
    } catch (err) {
      setStatusMessage(err.message);
    } finally {
      setStatusLoading(false);
    }
  }

  async function handleManualAssign(department, comment) {
    if (!invoice) return;

    setStatusLoading(true);
    setStatusMessage("");

    try {
      const updated = await manuallyAssignInvoice(invoice.id, department, comment);
      setInvoice(updated);
      setStatusMessage(`Invoice assigned to "${updated.assigned_department}".`);
      await loadLogs();
    } catch (err) {
      setStatusMessage(err.message);
    } finally {
      setStatusLoading(false);
    }
  }

  useEffect(() => {
    loadInvoice();
    loadComments();
    loadLogs();
  }, [invoiceId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="mx-auto max-w-6xl p-6">
        <AppHeader />

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
          >
            ← Back to Invoices
          </Link>
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            <div className="space-y-4 animate-pulse">
              <div className="h-6 w-64 rounded bg-slate-200" />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-24 rounded-2xl bg-slate-100" />
                <div className="h-24 rounded-2xl bg-slate-100" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-red-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            <p className="text-red-600">{error}</p>
          </div>
        ) : !invoice ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            <p className="text-slate-500">Invoice not found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Invoice Details
                  </p>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">{invoice.filename}</h1>
                  <p className="mt-2 text-slate-500">Detailed invoice information and approval workflow activity.</p>
                </div>
                <StatusBadge status={invoice.status} />
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <InfoItem label="Document Type" value={invoice.document_type} />
                <InfoItem label="Vendor" value={invoice.vendor_name} />
                <InfoItem label="Invoice Number" value={invoice.invoice_number} />
                <InfoItem label="Invoice Date" value={invoice.invoice_date} />
                <InfoItem label="Due Date" value={invoice.due_date} />
                <InfoItem label="Total Amount" value={invoice.total_amount} />
                <InfoItem label="Currency" value={invoice.currency} />
                <InfoItem label="Invoice ID" value={invoice.id} />
                <InfoItem label="Assigned Department" value={invoice.assigned_department} />
                <InfoItem label="Routing Status" value={invoice.routing_status} />
              </div>

              <TextPanel title="Routing Reason">{invoice.routing_reason}</TextPanel>
              <TextPanel title="Summary">{invoice.summary}</TextPanel>
              <TextPanel title="Extracted Text" mono>{invoice.extracted_text}</TextPanel>
            </div>

            {(user?.role === "admin" || user?.role === "approver") && (
              <InvoiceRoutingCard
                currentDepartment={invoice.assigned_department}
                currentRoutingStatus={invoice.routing_status}
                currentRoutingReason={invoice.routing_reason}
                loading={statusLoading}
                onAutoRoute={handleAutoRoute}
                onManualAssign={handleManualAssign}
              />
            )}

            {(user?.role === "admin" || user?.role === "approver") && (
              <InvoiceStatusActions
                currentStatus={invoice.status}
                loading={statusLoading}
                onChangeStatus={handleChangeStatus}
                onAddComment={handleAddComment}
              />
            )}

            {statusMessage && (
              <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-slate-700">{statusMessage}</p>
              </div>
            )}

            <ApprovalCommentList comments={comments} loading={commentsLoading} error={commentsError} />
            <AuditLogList logs={logs} loading={logsLoading} error={logsError} />
          </div>
        )}
      </div>
    </div>
  );
}
