export default function LeaveRequestSearchFilter({
  searchText,
  statusFilter,
  onSearchChange,
  onStatusChange,
}) {
  const hasFilters = Boolean(searchText || statusFilter);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Search & Filter</h2>
          <p className="mt-1 text-sm text-slate-500">Search leave records by employee, type, department, or status.</p>
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              onSearchChange("");
              onStatusChange("");
            }}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Search leave requests</label>
          <input
            type="text"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by employee, leave type, department..."
            className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Filter by status</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          >
            <option value="">All Statuses</option>
            <option value="processed">Processed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="pending_review">Pending Review</option>
            <option value="needs_correction">Needs Correction</option>
          </select>
        </div>
      </div>
    </div>
  );
}
