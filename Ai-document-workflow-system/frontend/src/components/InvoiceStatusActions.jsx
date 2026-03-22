import { useState } from "react";

function actionButtonClass(color) {
  const base = "rounded-full px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    yellow: "bg-amber-500 hover:bg-amber-600",
    green: "bg-emerald-600 hover:bg-emerald-700",
    red: "bg-rose-600 hover:bg-rose-700",
    slate: "bg-slate-700 hover:bg-slate-800",
    blue: "bg-blue-600 hover:bg-blue-700",
  };

  return `${base} ${variants[color]}`;
}

export default function InvoiceStatusActions({
  currentStatus,
  loading,
  onChangeStatus,
  onAddComment,
}) {
  const [comment, setComment] = useState("");

  async function handleStatusClick(status) {
    await onChangeStatus(status, comment);
    setComment("");
  }

  async function handleCommentOnly() {
    if (!comment.trim()) {
      alert("Please enter a comment first.");
      return;
    }

    await onAddComment(comment);
    setComment("");
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition-all duration-300 hover:shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Invoice Actions</h2>
          <p className="mt-1 text-sm text-slate-500">
            Current status: <span className="font-medium text-slate-700">{currentStatus || "-"}</span>
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          Workflow Control
        </span>
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-slate-700">Approval Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Enter approval comment here..."
          className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" disabled={loading} onClick={() => handleStatusClick("pending_review")} className={actionButtonClass("yellow")}>
          Mark Pending Review
        </button>
        <button type="button" disabled={loading} onClick={() => handleStatusClick("approved")} className={actionButtonClass("green")}>
          Approve
        </button>
        <button type="button" disabled={loading} onClick={() => handleStatusClick("rejected")} className={actionButtonClass("red")}>
          Reject
        </button>
        <button type="button" disabled={loading} onClick={() => handleStatusClick("processed")} className={actionButtonClass("slate")}>
          Reset to Processed
        </button>
        <button type="button" disabled={loading} onClick={handleCommentOnly} className={actionButtonClass("blue")}>
          Add Comment Only
        </button>
      </div>
    </div>
  );
}
