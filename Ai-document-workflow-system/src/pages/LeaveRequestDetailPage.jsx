import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import AppHeader from "../components/AppHeader";
import StatusBadge from "../components/StatusBadge";
import LeaveRequestRoutingCard from "../components/LeaveRequestRoutingCard";
import LeaveRequestStatusActions from "../components/LeaveRequestStatusActions";
import ApprovalCommentList from "../components/ApprovalCommentList";
import AuditLogList from "../components/AuditLogList";
import { useAuth } from "../context/AuthContext";
import {
  fetchLeaveRequestById, updateLeaveRequestStatus, addLeaveRequestComment,
  fetchLeaveRequestComments, fetchLeaveRequestAuditLogs, autoRouteLeaveRequest, manuallyAssignLeaveRequest,
} from "../api/leaveRequestApi";

function DetailField({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-sm text-slate-800 font-medium">{value}</p>
    </div>
  );
}

export default function LeaveRequestDetailPage() {
  const { leaveRequestId } = useParams();
  const { user } = useAuth();

  const [leaveRequest, setLeaveRequest] = useState(null);
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

  async function loadLeaveRequest() {
    setLoading(true); setError("");
    try { const data = await fetchLeaveRequestById(leaveRequestId); setLeaveRequest(data); }
    catch (err) { setError(err.message); } finally { setLoading(false); }
  }
  async function loadComments() {
    setCommentsLoading(true); setCommentsError("");
    try { const data = await fetchLeaveRequestComments(leaveRequestId); setComments(data); }
    catch (err) { setCommentsError(err.message); } finally { setCommentsLoading(false); }
  }
  async function loadLogs() {
    setLogsLoading(true); setLogsError("");
    try { const data = await fetchLeaveRequestAuditLogs(leaveRequestId); setLogs(data); }
    catch (err) { setLogsError(err.message); } finally { setLogsLoading(false); }
  }
  async function handleChangeStatus(newStatus, comment) {
    if (!leaveRequest) return; setStatusLoading(true); setStatusMessage("");
    try { const updated = await updateLeaveRequestStatus(leaveRequest.id, newStatus, comment); setLeaveRequest(updated); setStatusMessage(`Status updated to "${updated.status}".`); await loadComments(); await loadLogs(); }
    catch (err) { setStatusMessage(err.message); } finally { setStatusLoading(false); }
  }
  async function handleAddComment(comment) {
    if (!leaveRequest) return; setStatusLoading(true); setStatusMessage("");
    try { await addLeaveRequestComment(leaveRequest.id, comment); setStatusMessage("Comment added successfully."); await loadComments(); await loadLogs(); }
    catch (err) { setStatusMessage(err.message); } finally { setStatusLoading(false); }
  }
  async function handleAutoRoute() {
    if (!leaveRequest) return; setStatusLoading(true); setStatusMessage("");
    try { const updated = await autoRouteLeaveRequest(leaveRequest.id); setLeaveRequest(updated); setStatusMessage("Leave request auto-routed successfully."); await loadLogs(); }
    catch (err) { setStatusMessage(err.message); } finally { setStatusLoading(false); }
  }
  async function handleManualAssign(department, comment) {
    if (!leaveRequest) return; setStatusLoading(true); setStatusMessage("");
    try { const updated = await manuallyAssignLeaveRequest(leaveRequest.id, department, comment); setLeaveRequest(updated); setStatusMessage(`Leave request assigned to "${updated.assigned_department}".`); await loadLogs(); }
    catch (err) { setStatusMessage(err.message); } finally { setStatusLoading(false); }
  }

  useEffect(() => { loadLeaveRequest(); loadComments(); loadLogs(); }, [leaveRequestId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <AppHeader />

        <div className="mb-6">
          <Link to="/leave-requests" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all duration-150 shadow-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Leave Requests
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
        ) : !leaveRequest ? (
          <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Leave request not found.</p>
          </div>
        ) : (
          <div className="space-y-4" style={{ animation: "fadeSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
            <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
                    {leaveRequest.filename}
                  </h1>
                  <p className="mt-0.5 text-sm text-slate-400">Leave request details</p>
                </div>
                <StatusBadge status={leaveRequest.status} />
              </div>

              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 pb-5 border-b border-slate-100">
                <DetailField label="Document Type" value={leaveRequest.document_type} />
                <DetailField label="Employee Name" value={leaveRequest.employee_name} />
                <DetailField label="Leave Type" value={leaveRequest.leave_type} />
                <DetailField label="Start Date" value={leaveRequest.start_date} />
                <DetailField label="End Date" value={leaveRequest.end_date} />
                <DetailField label="Department" value={leaveRequest.department} />
                <DetailField label="Assigned Department" value={leaveRequest.assigned_department} />
                <DetailField label="Routing Status" value={leaveRequest.routing_status} />
              </div>

              <div className="mt-5 space-y-4">
                {leaveRequest.reason && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Reason</p>
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-sm text-slate-700 leading-relaxed">{leaveRequest.reason}</div>
                  </div>
                )}
                {leaveRequest.routing_reason && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Routing Reason</p>
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-sm text-slate-700 leading-relaxed">{leaveRequest.routing_reason}</div>
                  </div>
                )}
                {leaveRequest.summary && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Summary</p>
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-sm text-slate-700 leading-relaxed">{leaveRequest.summary}</div>
                  </div>
                )}
                {leaveRequest.extracted_text && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Extracted Text</p>
                    <pre className="max-h-96 overflow-auto rounded-xl bg-slate-900 p-4 text-xs whitespace-pre-wrap text-slate-300 leading-relaxed">{leaveRequest.extracted_text}</pre>
                  </div>
                )}
              </div>
            </div>

            {(user?.role === "admin" || user?.role === "approver") && (
              <LeaveRequestRoutingCard
                currentDepartment={leaveRequest.assigned_department}
                currentRoutingStatus={leaveRequest.routing_status}
                currentRoutingReason={leaveRequest.routing_reason}
                loading={statusLoading}
                onAutoRoute={handleAutoRoute}
                onManualAssign={handleManualAssign}
              />
            )}

            {(user?.role === "admin" || user?.role === "approver") && (
              <LeaveRequestStatusActions
                currentStatus={leaveRequest.status}
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