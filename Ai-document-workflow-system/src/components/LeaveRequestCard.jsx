// LeaveRequestCard.jsx
import { Link } from "react-router";
import StatusBadge from "./StatusBadge";

export default function LeaveRequestCard({ leaveRequest, index = 0 }) {
  return (
    <Link
      to={`/leave-requests/${leaveRequest.id}`}
      className="block group"
      style={{ animation: `fadeSlideUp 0.4s ${index * 0.05}s cubic-bezier(0.16, 1, 0.3, 1) both` }}
    >
      <div className="rounded-2xl border border-slate-100 bg-white p-5 transition-all duration-200 hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-900 transition-colors duration-200">
              <svg className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 truncate">{leaveRequest.filename}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{leaveRequest.employee_name || "Unknown employee"}</p>
            </div>
          </div>
          <StatusBadge status={leaveRequest.status} />
        </div>

        <div className="grid gap-y-2 gap-x-4 grid-cols-2 md:grid-cols-3 mb-4">
          {[
            { label: "Leave Type", value: leaveRequest.leave_type },
            { label: "Start Date", value: leaveRequest.start_date },
            { label: "End Date", value: leaveRequest.end_date },
            { label: "Department", value: leaveRequest.department },
            { label: "Assigned To", value: leaveRequest.assigned_department },
          ].map(({ label, value }) => (
            value ? (
              <div key={label}>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-xs font-medium text-slate-700 mt-0.5 truncate">{value}</p>
              </div>
            ) : null
          ))}
        </div>

        {leaveRequest.summary && (
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{leaveRequest.summary}</p>
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