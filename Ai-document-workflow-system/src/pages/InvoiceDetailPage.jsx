import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  fetchInvoiceById, updateInvoiceStatus, addApprovalComment,
  fetchApprovalComments, fetchAuditLogs, autoRouteInvoice, manuallyAssignInvoice,
} from "../api/invoiceApi";
import AppHeader from "../components/AppHeader";
import StatusBadge from "../components/StatusBadge";
import InvoiceStatusActions from "../components/InvoiceStatusActions";
import ApprovalCommentList from "../components/ApprovalCommentList";
import AuditLogList from "../components/AuditLogList";
import InvoiceRoutingCard from "../components/InvoiceRoutingCard";
import { useAuth } from "../context/AuthContext";

function DetailField({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-sm text-slate-800 font-medium">{value}</p>
    </div>
  );
}

function SectionBlock({ title, content }) {
  if (!content) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
      <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-sm text-slate-700 leading-relaxed">
        {content}
      </div>
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
    setLoading(true); setError("");
    try { const data = await fetchInvoiceById(invoiceId); setInvoice(data); }
    catch (err) { setError(err.message); } finally { setLoading(false); }
  }
  async function loadComments() {
    setCommentsLoading(true); setCommentsError("");
    try { const data = await fetchApprovalComments(invoiceId); setComments(data); }
    catch (err) { setCommentsError(err.message); } finally { setCommentsLoading(false); }
  }
  async function loadLogs() {
    setLogsLoading(true); setLogsError("");
    try { const data = await fetchAuditLogs(invoiceId); setLogs(data); }
    catch (err) { setLogsError(err.message); } finally { setLogsLoading(false); }
  }
  async function handleChangeStatus(newStatus, comment) {
    if (!invoice) return; setStatusLoading(true); setStatusMessage("");
    try { const updated = await updateInvoiceStatus(invoice.id, newStatus, comment); setInvoice(updated); setStatusMessage(`Status updated to "${updated.status}".`); await loadComments(); await loadLogs(); }
    catch (err) { setStatusMessage(err.message); } finally { setStatusLoading(false); }
  }
  async function handleAddComment(comment) {
    if (!invoice) return; setStatusLoading(true); setStatusMessage("");
    try { await addApprovalComment(invoice.id, comment); setStatusMessage("Comment added successfully."); await loadComments(); await loadLogs(); }
    catch (err) { setStatusMessage(err.message); } finally { setStatusLoading(false); }
  }
  async function handleAutoRoute() {
    if (!invoice) return; setStatusLoading(true); setStatusMessage("");
    try { const updated = await autoRouteInvoice(invoice.id); setInvoice(updated); setStatusMessage("Invoice routed automatically."); await loadLogs(); }
    catch (err) { setStatusMessage(err.message); } finally { setStatusLoading(false); }
  }
  async function handleManualAssign(department, comment) {
    if (!invoice) return; setStatusLoading(true); setStatusMessage("");
    try { const updated = await manuallyAssignInvoice(invoice.id, department, comment); setInvoice(updated); setStatusMessage(`Invoice assigned to "${updated.assigned_department}".`); await loadLogs(); }
    catch (err) { setStatusMessage(err.message); } finally { setStatusLoading(false); }
  }

  useEffect(() => { loadInvoice(); loadComments(); loadLogs(); }, [invoiceId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <AppHeader />

        <div className="mb-6 flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all duration-150 shadow-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Invoices
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-2xl bg-white border border-slate-100 p-6 animate-pulse">
                <div className="h-5 bg-slate-100 rounded w-48 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  {[1,2,3,4].map(j => <div key={j} className="h-4 bg-slate-100 rounded" />)}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white border border-red-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-red-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        ) : !invoice ? (
          <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Invoice not found.</p>
          </div>
        ) : (
          <div className="space-y-4" style={{ animation: "fadeSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
            {/* Main info card */}
            <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
                    {invoice.filename}
                  </h1>
                  <p className="mt-0.5 text-sm text-slate-400">Invoice details</p>
                </div>
                <StatusBadge status={invoice.status} />
              </div>

              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 pb-5 border-b border-slate-100">
                <DetailField label="Document Type" value={invoice.document_type} />
                <DetailField label="Vendor" value={invoice.vendor_name} />
                <DetailField label="Invoice Number" value={invoice.invoice_number} />
                <DetailField label="Invoice Date" value={invoice.invoice_date} />
                <DetailField label="Due Date" value={invoice.due_date} />
                <DetailField label="Total Amount" value={invoice.total_amount} />
                <DetailField label="Currency" value={invoice.currency} />
                <DetailField label="Assigned Department" value={invoice.assigned_department} />
                <DetailField label="Routing Status" value={invoice.routing_status} />
              </div>

              <div className="mt-5 space-y-4">
                <SectionBlock title="Routing Reason" content={invoice.routing_reason} />
                <SectionBlock title="Summary" content={invoice.summary} />
                {invoice.extracted_text && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Extracted Text</p>
                    <pre className="max-h-96 overflow-auto rounded-xl bg-slate-900 p-4 text-xs whitespace-pre-wrap text-slate-300 leading-relaxed">
                      {invoice.extracted_text}
                    </pre>
                  </div>
                )}
              </div>
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
              <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <p className="text-sm text-slate-700">{statusMessage}</p>
                </div>
              </div>
            )}

            <ApprovalCommentList comments={comments} loading={commentsLoading} error={commentsError} />
            <AuditLogList logs={logs} loading={logsLoading} error={logsError} />
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}