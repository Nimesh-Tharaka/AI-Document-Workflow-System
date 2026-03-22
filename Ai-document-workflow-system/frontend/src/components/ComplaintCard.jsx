import { Link } from "react-router";
import StatusBadge from "./StatusBadge";

export default function ComplaintCard({ complaint }) {
  return (
    <Link to={`/complaints/${complaint.id}`} className="group block">
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_40px_rgba(15,23,42,0.07)]">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Complaint File
            </p>
            <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-slate-700">
              {complaint.filename}
            </h3>
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        <div className="grid gap-3 text-sm text-slate-700 md:grid-cols-2">
          <p><span className="font-semibold text-slate-900">Customer:</span> {complaint.customer_name || "-"}</p>
          <p><span className="font-semibold text-slate-900">Complaint Type:</span> {complaint.complaint_type || "-"}</p>
          <p><span className="font-semibold text-slate-900">Urgency:</span> {complaint.urgency || "-"}</p>
          <p><span className="font-semibold text-slate-900">Department:</span> {complaint.department || "-"}</p>
          <p><span className="font-semibold text-slate-900">Assigned Department:</span> {complaint.assigned_department || "-"}</p>
        </div>

        <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100 transition-all duration-300 group-hover:bg-white">
          <p className="mb-2 text-sm font-semibold text-slate-900">Summary</p>
          <p className="line-clamp-3 text-sm leading-7 text-slate-600">{complaint.summary || "-"}</p>
        </div>
      </div>
    </Link>
  );
}
