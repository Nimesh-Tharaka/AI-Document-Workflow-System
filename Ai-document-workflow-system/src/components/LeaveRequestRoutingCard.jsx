import { useState } from "react";

export default function LeaveRequestRoutingCard({
  currentDepartment,
  currentRoutingStatus,
  currentRoutingReason,
  loading,
  onAutoRoute,
  onManualAssign,
}) {
  const [department, setDepartment] = useState("HR");
  const [comment, setComment] = useState("");

  async function handleManualAssign() {
    await onManualAssign(department, comment);
    setComment("");
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h2 className="text-lg font-semibold text-slate-900">Routing & Department Assignment</h2>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <p>
          <span className="font-semibold">Current Department:</span>{" "}
          {currentDepartment || "-"}
        </p>
        <p>
          <span className="font-semibold">Routing Status:</span>{" "}
          {currentRoutingStatus || "-"}
        </p>
      </div>

      <div className="mt-4">
        <p className="mb-2 font-semibold text-slate-900">Routing Reason</p>
        <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
          {currentRoutingReason || "-"}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={onAutoRoute}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Auto Route to HR
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Assign Department
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm"
          >
            <option value="HR">HR</option>
            <option value="Administration">Administration</option>
            <option value="Operations">Operations</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Routing Comment
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional note for manual assignment..."
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm"
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          disabled={loading}
          onClick={handleManualAssign}
          className="rounded-xl bg-slate-800 px-4 py-2 text-white disabled:opacity-50"
        >
          Assign Department
        </button>
      </div>
    </div>
  );
}