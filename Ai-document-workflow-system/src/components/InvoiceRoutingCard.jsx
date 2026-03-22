// InvoiceRoutingCard.jsx
import { useState } from "react";

export default function InvoiceRoutingCard({ currentDepartment, currentRoutingStatus, currentRoutingReason, loading, onAutoRoute, onManualAssign }) {
  const [department, setDepartment] = useState("Finance");
  const [comment, setComment] = useState("");
  async function handleManualAssign() { await onManualAssign(department, comment); setComment(""); }

  return (
    <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
      <h2 className="text-base font-bold text-slate-900 mb-5">Routing & Department Assignment</h2>
      <div className="grid gap-3 sm:grid-cols-2 mb-4">
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Current Department</p>
          <p className="text-sm font-medium text-slate-900">{currentDepartment || "—"}</p>
        </div>
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Routing Status</p>
          <p className="text-sm font-medium text-slate-900 capitalize">{(currentRoutingStatus || "—").replace(/_/g, " ")}</p>
        </div>
      </div>
      {currentRoutingReason && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Routing Reason</p>
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5 text-sm text-slate-700 leading-relaxed">{currentRoutingReason}</div>
        </div>
      )}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex flex-wrap gap-3 mb-5">
          <button type="button" disabled={loading} onClick={onAutoRoute}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-slate-700 active:scale-[0.97] disabled:opacity-40">
            {loading ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>}
            Auto Route
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Assign Department</label>
            <div className="relative">
              <select value={department} onChange={(e) => setDepartment(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 pr-8 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-slate-900 focus:bg-white cursor-pointer">
                {["Finance", "Procurement", "Operations", "Administration"].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Routing Comment</label>
            <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Optional note for manual assignment..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-900 focus:bg-white resize-none" />
          </div>
        </div>
        <div className="mt-4">
          <button type="button" disabled={loading} onClick={handleManualAssign}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:shadow-sm active:scale-[0.97] disabled:opacity-40">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" /></svg>
            Assign Department
          </button>
        </div>
      </div>
    </div>
  );
}