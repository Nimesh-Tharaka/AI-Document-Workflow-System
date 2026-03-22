import LeaveRequestCard from "./LeaveRequestCard";

export default function LeaveRequestList({ leaveRequests, loading, error }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">Leave Requests</h2>
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          {leaveRequests.length} {leaveRequests.length === 1 ? "item" : "items"}
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-100 p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-slate-100" />
                <div>
                  <div className="h-3.5 bg-slate-100 rounded w-40 mb-1.5" />
                  <div className="h-2.5 bg-slate-100 rounded w-24" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[1, 2, 3].map((j) => (
                  <div key={j}>
                    <div className="h-2 bg-slate-100 rounded w-16 mb-1.5" />
                    <div className="h-3 bg-slate-100 rounded w-20" />
                  </div>
                ))}
              </div>
              <div className="h-10 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      ) : leaveRequests.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-600">No leave requests found</p>
          <p className="text-xs text-slate-400 mt-1">Upload a leave request to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaveRequests.map((leaveRequest, index) => (
            <LeaveRequestCard key={leaveRequest.id} leaveRequest={leaveRequest} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}