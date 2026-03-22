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
  fetchLeaveRequestById,
  updateLeaveRequestStatus,
  addLeaveRequestComment,
  fetchLeaveRequestComments,
  fetchLeaveRequestAuditLogs,
  autoRouteLeaveRequest,
  manuallyAssignLeaveRequest,
} from "../api/leaveRequestApi";

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
    setLoading(true);
    setError("");

    try {
      const data = await fetchLeaveRequestById(leaveRequestId);
      setLeaveRequest(data);
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
      const data = await fetchLeaveRequestComments(leaveRequestId);
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
      const data = await fetchLeaveRequestAuditLogs(leaveRequestId);
      setLogs(data);
    } catch (err) {
      setLogsError(err.message);
    } finally {
      setLogsLoading(false);
    }
  }

  async function handleChangeStatus(newStatus, comment) {
    if (!leaveRequest) return;

    setStatusLoading(true);
    setStatusMessage("");

    try {
      const updated = await updateLeaveRequestStatus(leaveRequest.id, newStatus, comment);
      setLeaveRequest(updated);
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
    if (!leaveRequest) return;

    setStatusLoading(true);
    setStatusMessage("");

    try {
      await addLeaveRequestComment(leaveRequest.id, comment);
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
    if (!leaveRequest) return;

    setStatusLoading(true);
    setStatusMessage("");

    try {
      const updated = await autoRouteLeaveRequest(leaveRequest.id);
      setLeaveRequest(updated);
      setStatusMessage("Leave request auto-routed successfully.");
      await loadLogs();
    } catch (err) {
      setStatusMessage(err.message);
    } finally {
      setStatusLoading(false);
    }
  }

  async function handleManualAssign(department, comment) {
    if (!leaveRequest) return;

    setStatusLoading(true);
    setStatusMessage("");

    try {
      const updated = await manuallyAssignLeaveRequest(leaveRequest.id, department, comment);
      setLeaveRequest(updated);
      setStatusMessage(`Leave request assigned to "${updated.assigned_department}".`);
      await loadLogs();
    } catch (err) {
      setStatusMessage(err.message);
    } finally {
      setStatusLoading(false);
    }
  }

  useEffect(() => {
    loadLeaveRequest();
    loadComments();
    loadLogs();
  }, [leaveRequestId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="mx-auto max-w-6xl p-6">
        <AppHeader />

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/leave-requests"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
          >
            ← Back to Leave Requests
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
        ) : !leaveRequest ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            <p className="text-slate-500">Leave request not found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Leave Request Details
                  </p>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">{leaveRequest.filename}</h1>
                  <p className="mt-2 text-slate-500">Detailed leave request information and workflow activity.</p>
                </div>
                <StatusBadge status={leaveRequest.status} />
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <InfoItem label="Document Type" value={leaveRequest.document_type} />
                <InfoItem label="Employee Name" value={leaveRequest.employee_name} />
                <InfoItem label="Leave Type" value={leaveRequest.leave_type} />
                <InfoItem label="Start Date" value={leaveRequest.start_date} />
                <InfoItem label="End Date" value={leaveRequest.end_date} />
                <InfoItem label="Department" value={leaveRequest.department} />
                <InfoItem label="Assigned Department" value={leaveRequest.assigned_department} />
                <InfoItem label="Routing Status" value={leaveRequest.routing_status} />
              </div>

              <TextPanel title="Reason">{leaveRequest.reason}</TextPanel>
              <TextPanel title="Routing Reason">{leaveRequest.routing_reason}</TextPanel>
              <TextPanel title="Summary">{leaveRequest.summary}</TextPanel>
              <TextPanel title="Extracted Text" mono>{leaveRequest.extracted_text}</TextPanel>
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
