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
    setLoading(true);
    setError("");

    try {
      const data = await fetchLeaveRequests();
      setLeaveRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(file) {
    await uploadLeaveRequest(file);
    await loadLeaveRequests();
  }

  function updateSearchText(value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("q", value);
    else next.delete("q");
    setSearchParams(next);
  }

  function updateStatusFilter(value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("status", value);
    else next.delete("status");
    setSearchParams(next);
  }

  const filteredLeaveRequests = useMemo(() => {
    return leaveRequests.filter((leaveRequest) => {
      const searchValue = searchText.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        (leaveRequest.filename || "").toLowerCase().includes(searchValue) ||
        (leaveRequest.employee_name || "").toLowerCase().includes(searchValue) ||
        (leaveRequest.leave_type || "").toLowerCase().includes(searchValue) ||
        (leaveRequest.department || "").toLowerCase().includes(searchValue) ||
        (leaveRequest.summary || "").toLowerCase().includes(searchValue);

      const matchesStatus =
        !statusFilter ||
        (leaveRequest.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [leaveRequests, searchText, statusFilter]);

  useEffect(() => {
    loadLeaveRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="mx-auto max-w-6xl p-6">
        <AppHeader />

        <div className="mb-6 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Leave Workspace
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Leave Request Management</h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                Upload and manage leave request documents with a cleaner white theme and smoother card interactions.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center ring-1 ring-slate-100">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Total</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{leaveRequests.length}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center ring-1 ring-slate-100">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Filtered</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{filteredLeaveRequests.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <UploadLeaveRequestCard onUploadSuccess={handleUpload} />

          <LeaveRequestSearchFilter
            searchText={searchText}
            statusFilter={statusFilter}
            onSearchChange={updateSearchText}
            onStatusChange={updateStatusFilter}
          />

          <LeaveRequestList leaveRequests={filteredLeaveRequests} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}
