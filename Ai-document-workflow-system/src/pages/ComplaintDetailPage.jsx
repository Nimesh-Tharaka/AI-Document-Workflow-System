import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import AppHeader from "../components/AppHeader";
import StatusBadge from "../components/StatusBadge";
import ComplaintRoutingCard from "../components/ComplaintRoutingCard";
import ComplaintStatusActions from "../components/ComplaintStatusActions";
import ApprovalCommentList from "../components/ApprovalCommentList";
import AuditLogList from "../components/AuditLogList";
import { useAuth } from "../context/AuthContext";
import {
  fetchComplaintById, updateComplaintStatus, addComplaintComment,
  fetchComplaintComments, fetchComplaintAuditLogs, autoRouteComplaint, manuallyAssignComplaint,
} from "../api/complaintApi";

function DetailField({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-sm text-slate-800 font-medium">{value}</p>
    </div>
  );
}

export default function ComplaintDetailPage() {
  const { complaintId } = useParams();
  const { user } = useAuth();

  const [complaint, setComplaint] = useState(null);
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

  async function loadComplaint() {
    setLoading(true); setError("");
    try { const data = await fetchComplaintById(complaintId); setComplaint(data); }
    catch (err) { setError(err.message); } finally { setLoading(false); }
  }
  async function loadComments() {
    setCommentsLoading(true); setCommentsError("");
    try { const data = await fetchComplaintComments(complaintId); setComments(data); }
    catch (err) { setCommentsError(err.message); } finally { setCommentsLoading(false); }
  }
  async function loadLogs() {
    setLogsLoading(true); setLogsError("");
    try { const data = await fetchComplaintAuditLogs(complaintId); setLogs(data); }
    catch (err) { setLogsError(err.message); } finally { setLogsLoading(false); }
  }
  async function handleChangeStatus(newStatus, comment) {
    if (!complaint) return; setStatusLoading(true); setStatusMessage("");
    try { const updated = await updateComplaintStatus(complaint.id, newStatus, comment); setComplaint(updated); setStatusMessage(`Status updated to "${updated.status}".`); await loadComments(); await loadLogs(); }
    catch (err) { setStatusMessage(err.message); } finally { setStatusLoading(false); }
  }
  async function handleAddComment(comment) {
    if (!complaint) return; setStatusLoading(true); setStatusMessage("");
    try { await addComplaintComment(complaint.id, comment); setStatusMessage("Comment added successfully."); await loadComments(); await loadLogs(); }
    catch (err) { setStatusMessage(err.message); } finally { setStatusLoading(false); }
  }
  async function handleAutoRoute() {
    if (!complaint) return; setStatusLoading(true); setStatusMessage("");
    try { const updated = await autoRouteComplaint(complaint.id); setComplaint(updated); setStatusMessage("Complaint auto-routed successfully."); await loadLogs(); }
    catch (err) { setStatusMessage(err.message); } finally { setStatusLoading(false); }
  }
  async function handleManualAssign(department, comment) {
    if (!complaint) return; setStatusLoading(true); setStatusMessage("");
    try { const updated = await manuallyAssignComplaint(complaint.id, department, comment); setComplaint(updated); setStatusMessage(`Complaint assigned to "${updated.assigned_department}".`); await loadLogs(); }
    catch (err) { setStatusMessage(err.message); } finally { setStatusLoading(false); }
  }

  useEffect(() => { loadComplaint(); loadComments(); loadLogs(); }, [complaintId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <AppHeader />

        <div className="mb-6">
          <Link to="/complaints" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all duration-150 shadow-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Complaints
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-2xl bg-white border border-slate-100 p-6 animate-pulse">
                <div className="h-5 bg-slate-100 rounded w-48 mb-4" />
                <div className="grid grid-cols-2 gap-4">{[1,2,3,4].map(j => <div key={j} className="h-4 bg-slate-100 rounded" />)}</div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white border border-red-100 p-6 shadow-sm">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : !complaint ? (
          <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Complaint not found.</p>
          </div>
        ) : (
          <div className="space-y-4" style={{ animation: "fadeSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
            <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
                    {complaint.filename}
                  </h1>
                  <p className="mt-0.5 text-sm text-slate-400">Complaint details</p>
                </div>
                <StatusBadge status={complaint.status} />
              </div>

              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 pb-5 border-b border-slate-100">
                <DetailField label="Document Type" value={complaint.document_type} />
                <DetailField label="Customer Name" value={complaint.customer_name} />
                <DetailField label="Complaint Type" value={complaint.complaint_type} />
                <DetailField label="Urgency" value={complaint.urgency} />
                <DetailField label="Department" value={complaint.department} />
                <DetailField label="Assigned Department" value={complaint.assigned_department} />
                <DetailField label="Routing Status" value={complaint.routing_status} />
              </div>

              <div className="mt-5 space-y-4">
                {complaint.issue_summary && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Issue Summary</p>
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-sm text-slate-700 leading-relaxed">{complaint.issue_summary}</div>
                  </div>
                )}
                {complaint.routing_reason && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Routing Reason</p>
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-sm text-slate-700 leading-relaxed">{complaint.routing_reason}</div>
                  </div>
                )}
                {complaint.summary && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Summary</p>
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-sm text-slate-700 leading-relaxed">{complaint.summary}</div>
                  </div>
                )}
                {complaint.extracted_text && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Extracted Text</p>
                    <pre className="max-h-96 overflow-auto rounded-xl bg-slate-900 p-4 text-xs whitespace-pre-wrap text-slate-300 leading-relaxed">{complaint.extracted_text}</pre>
                  </div>
                )}
              </div>
            </div>

            {(user?.role === "admin" || user?.role === "approver") && (
              <ComplaintRoutingCard
                currentDepartment={complaint.assigned_department}
                currentRoutingStatus={complaint.routing_status}
                currentRoutingReason={complaint.routing_reason}
                loading={statusLoading}
                onAutoRoute={handleAutoRoute}
                onManualAssign={handleManualAssign}
              />
            )}

            {(user?.role === "admin" || user?.role === "approver") && (
              <ComplaintStatusActions
                currentStatus={complaint.status}
                loading={statusLoading}
                onChangeStatus={handleChangeStatus}
                onAddComment={handleAddComment}
              />
            )}

            {statusMessage && (
              <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm">
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400" /><p className="text-sm text-slate-700">{statusMessage}</p></div>
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