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
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition-all duration-300 hover:shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Routing & Department Assignment</h2>
          <p className="mt-1 text-sm text-slate-500">Keep leave workflow aligned with HR and operations.</p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={onAutoRoute}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Auto Route to HR
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Current Department</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{currentDepartment || "-"}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Routing Status</p>
          <p className="mt-2 text-base font-semibold text-slate-900">{currentRoutingStatus || "-"}</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
        <p className="mb-2 text-sm font-semibold text-slate-900">Routing Reason</p>
        <p className="leading-7 text-slate-600">{currentRoutingReason || "-"}</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Assign Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          >
            <option value="HR">HR</option>
            <option value="Administration">Administration</option>
            <option value="Operations">Operations</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Routing Comment</label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional note for manual assignment..."
            className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          />
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          disabled={loading}
          onClick={handleManualAssign}
          className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Assign Department
        </button>
      </div>
    </div>
  );
}
