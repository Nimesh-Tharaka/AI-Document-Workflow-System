import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import AppHeader from "../components/AppHeader";
import UploadComplaintCard from "../components/UploadComplaintCard";
import ComplaintSearchFilter from "../components/ComplaintSearchFilter";
import ComplaintList from "../components/ComplaintList";
import { fetchComplaints, uploadComplaint } from "../api/complaintApi";

export default function ComplaintPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const searchText = searchParams.get("q") || "";
  const statusFilter = searchParams.get("status") || "";

  async function loadComplaints() {
    setLoading(true);
    setError("");

    try {
      const data = await fetchComplaints();
      setComplaints(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(file) {
    await uploadComplaint(file);
    await loadComplaints();
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

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const searchValue = searchText.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        (complaint.filename || "").toLowerCase().includes(searchValue) ||
        (complaint.customer_name || "").toLowerCase().includes(searchValue) ||
        (complaint.complaint_type || "").toLowerCase().includes(searchValue) ||
        (complaint.urgency || "").toLowerCase().includes(searchValue) ||
        (complaint.summary || "").toLowerCase().includes(searchValue);

      const matchesStatus =
        !statusFilter ||
        (complaint.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [complaints, searchText, statusFilter]);

  useEffect(() => {
    loadComplaints();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="mx-auto max-w-6xl p-6">
        <AppHeader />

        <div className="mb-6 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Complaint Workspace
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Customer Complaint Processing</h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                Manage uploads, search complaint records, and track routing decisions in a cleaner white dashboard.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center ring-1 ring-slate-100">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Total</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{complaints.length}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center ring-1 ring-slate-100">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Filtered</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{filteredComplaints.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <UploadComplaintCard onUploadSuccess={handleUpload} />

          <ComplaintSearchFilter
            searchText={searchText}
            statusFilter={statusFilter}
            onSearchChange={updateSearchText}
            onStatusChange={updateStatusFilter}
          />

          <ComplaintList complaints={filteredComplaints} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}
