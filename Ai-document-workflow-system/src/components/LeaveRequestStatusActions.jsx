import { useState } from "react";

export default function LeaveRequestStatusActions({
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
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h2 className="text-lg font-semibold text-slate-900">Leave Request Actions</h2>
      <p className="mt-1 text-sm text-slate-500">
        Current status: <span className="font-medium">{currentStatus || "-"}</span>
      </p>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Approval Comment
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Enter approval comment here..."
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={() => handleStatusClick("pending_review")}
          className="rounded-xl bg-yellow-500 px-4 py-2 text-white disabled:opacity-50"
        >
          Mark Pending Review
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => handleStatusClick("approved")}
          className="rounded-xl bg-green-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Approve
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => handleStatusClick("rejected")}
          className="rounded-xl bg-red-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Reject
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => handleStatusClick("processed")}
          className="rounded-xl bg-slate-700 px-4 py-2 text-white disabled:opacity-50"
        >
          Reset to Processed
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={handleCommentOnly}
          className="rounded-xl bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Add Comment Only
        </button>
      </div>
    </div>
  );
}