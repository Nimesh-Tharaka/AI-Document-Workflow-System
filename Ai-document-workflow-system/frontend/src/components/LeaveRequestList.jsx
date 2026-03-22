import LeaveRequestCard from "./LeaveRequestCard";

export default function LeaveRequestList({ leaveRequests, loading, error }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Leave Requests</h2>
          <p className="mt-1 text-sm text-slate-500">Review employee leave requests and approval progress.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {leaveRequests.length} items
        </span>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse rounded-[24px] border border-slate-200 p-5">
              <div className="h-5 w-48 rounded bg-slate-200" />
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="h-4 rounded bg-slate-100" />
                <div className="h-4 rounded bg-slate-100" />
                <div className="h-4 rounded bg-slate-100" />
                <div className="h-4 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : leaveRequests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
          No leave requests found.
        </div>
      ) : (
        <div className="space-y-4">
          {leaveRequests.map((leaveRequest) => (
            <LeaveRequestCard key={leaveRequest.id} leaveRequest={leaveRequest} />
          ))}
        </div>
      )}
    </div>
  );
}
