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
    setLoading(true); setError("");
    try {
      const data = await fetchComplaints();
      setComplaints(data);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  async function handleUpload(file) {
    await uploadComplaint(file);
    await loadComplaints();
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

  useEffect(() => { loadComplaints(); }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <AppHeader />
        <div className="mb-6" style={{ animation: "fadeSlideUp 0.5s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>Complaints</h1>
          <p className="mt-1 text-sm text-slate-500">Upload and manage complaint documents</p>
        </div>
        <div className="grid gap-4">
          <div style={{ animation: "fadeSlideUp 0.5s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
            <UploadComplaintCard onUploadSuccess={handleUpload} />
          </div>
          <div style={{ animation: "fadeSlideUp 0.5s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
            <ComplaintSearchFilter
              searchText={searchText}
              statusFilter={statusFilter}
              onSearchChange={updateSearchText}
              onStatusChange={updateStatusFilter}
            />
          </div>
          <div style={{ animation: "fadeSlideUp 0.5s 0.25s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
            <ComplaintList complaints={filteredComplaints} loading={loading} error={error} />
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