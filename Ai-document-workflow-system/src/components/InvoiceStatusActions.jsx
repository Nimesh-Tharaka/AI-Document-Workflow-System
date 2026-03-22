import { useState } from "react";

export default function InvoiceStatusActions({ currentStatus, loading, onChangeStatus, onAddComment }) {
  const [comment, setComment] = useState("");

  async function handleStatusClick(status) {
    await onChangeStatus(status, comment);
    setComment("");
  }

  async function handleCommentOnly() {
    if (!comment.trim()) { alert("Please enter a comment first."); return; }
    await onAddComment(comment);
    setComment("");
  }

  const actions = [
    { status: "pending_review", label: "Pending Review", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z", color: "#a16207", bg: "#fefce8", border: "#fef08a" },
    { status: "approved", label: "Approve", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
    { status: "rejected", label: "Reject", icon: "M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "#b91c1c", bg: "#fef2f2", border: "#fecaca" },
    { status: "processed", label: "Reset to Processed", icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99", color: "#475569", bg: "#f8fafc", border: "#e2e8f0" },
  ];

  return (
    <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-slate-900">Invoice Actions</h2>
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-100 px-3 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <span className="text-xs font-medium text-slate-600 capitalize">{(currentStatus || "unknown").replace(/_/g, " ")}</span>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Approval Comment</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Enter approval comment here..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-900 focus:bg-white resize-none" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {actions.map((action) => (
          <button key={action.status} type="button" disabled={loading} onClick={() => handleStatusClick(action.status)}
            className="flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-150 hover:shadow-sm active:scale-[0.97] disabled:opacity-40"
            style={{ color: action.color, backgroundColor: action.bg, borderColor: action.border }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} /></svg>
            {action.label}
          </button>
        ))}
        <button type="button" disabled={loading} onClick={handleCommentOnly}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all duration-150 hover:bg-slate-50 hover:shadow-sm active:scale-[0.97] disabled:opacity-40">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
          Add Comment Only
        </button>
      </div>
      {loading && <div className="mt-4 flex items-center gap-2 text-xs text-slate-400"><span className="w-3.5 h-3.5 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" />Processing action...</div>}
    </div>
  );
}