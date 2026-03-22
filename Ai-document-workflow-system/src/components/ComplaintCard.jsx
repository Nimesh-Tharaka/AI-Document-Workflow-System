// ComplaintCard.jsx
import { Link } from "react-router";
import StatusBadge from "./StatusBadge";

export default function ComplaintCard({ complaint, index = 0 }) {
  return (
    <Link
      to={`/complaints/${complaint.id}`}
      className="block group"
      style={{ animation: `fadeSlideUp 0.4s ${index * 0.05}s cubic-bezier(0.16, 1, 0.3, 1) both` }}
    >
      <div className="rounded-2xl border border-slate-100 bg-white p-5 transition-all duration-200 hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-900 transition-colors duration-200">
              <svg className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 truncate">{complaint.filename}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{complaint.customer_name || "Unknown customer"}</p>
            </div>
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        <div className="grid gap-y-2 gap-x-4 grid-cols-2 md:grid-cols-3 mb-4">
          {[
            { label: "Complaint Type", value: complaint.complaint_type },
            { label: "Urgency", value: complaint.urgency },
            { label: "Department", value: complaint.department },
            { label: "Assigned To", value: complaint.assigned_department },
          ].map(({ label, value }) => (
            value ? (
              <div key={label}>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-xs font-medium text-slate-700 mt-0.5 truncate">{value}</p>
              </div>
            ) : null
          ))}
        </div>

        {complaint.summary && (
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{complaint.summary}</p>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Link>
  );
}