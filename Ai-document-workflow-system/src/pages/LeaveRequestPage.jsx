import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import AppHeader from "../components/AppHeader";
import UploadLeaveRequestCard from "../components/UploadLeaveRequestCard";
import LeaveRequestSearchFilter from "../components/LeaveRequestSearchFilter";
import LeaveRequestList from "../components/LeaveRequestList";
import { fetchLeaveRequests, uploadLeaveRequest } from "../api/leaveRequestApi";

export default function LeaveRequestPage() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const searchText = searchParams.get("q") || "";
  const statusFilter = searchParams.get("status") || "";

  async function loadLeaveRequests() {
    setLoading(true); setError("");
    try {
      const data = await fetchLeaveRequests();
      setLeaveRequests(data);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  async function handleUpload(file) {
    await uploadLeaveRequest(file);
    await loadLeaveRequests();
  }

  function updateSearchText(value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("q", value); else next.delete("q");
    setSearchParams(next);
  }

  function updateStatusFilter(value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("status", value); else next.delete("status");
    setSearchParams(next);
  }

  const filteredLeaveRequests = useMemo(() => {
    return leaveRequests.filter((lr) => {
      const searchValue = searchText.toLowerCase().trim();
      const matchesSearch =
        !searchValue ||
        (lr.filename || "").toLowerCase().includes(searchValue) ||
        (lr.employee_name || "").toLowerCase().includes(searchValue) ||
        (lr.leave_type || "").toLowerCase().includes(searchValue) ||
        (lr.department || "").toLowerCase().includes(searchValue) ||
        (lr.summary || "").toLowerCase().includes(searchValue);
      const matchesStatus =
        !statusFilter || (lr.status || "").toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [leaveRequests, searchText, statusFilter]);

  useEffect(() => { loadLeaveRequests(); }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <AppHeader />
        <div className="mb-6" style={{ animation: "fadeSlideUp 0.5s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>Leave Requests</h1>
          <p className="mt-1 text-sm text-slate-500">Upload and manage employee leave requests</p>
        </div>
        <div className="grid gap-4">
          <div style={{ animation: "fadeSlideUp 0.5s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
            <UploadLeaveRequestCard onUploadSuccess={handleUpload} />
          </div>
          <div style={{ animation: "fadeSlideUp 0.5s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
            <LeaveRequestSearchFilter
              searchText={searchText}
              statusFilter={statusFilter}
              onSearchChange={updateSearchText}
              onStatusChange={updateStatusFilter}
            />
          </div>
          <div style={{ animation: "fadeSlideUp 0.5s 0.25s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
            <LeaveRequestList leaveRequests={filteredLeaveRequests} loading={loading} error={error} />
          </div>
        </div>
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