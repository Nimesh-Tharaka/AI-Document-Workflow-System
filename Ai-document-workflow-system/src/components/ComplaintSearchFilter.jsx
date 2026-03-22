// ComplaintSearchFilter.jsx
export default function ComplaintSearchFilter({ searchText, statusFilter, onSearchChange, onStatusChange }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input type="text" value={searchText} onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by customer, type, urgency..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-900 focus:bg-white" />
        </div>
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-8 py-3 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-slate-900 focus:bg-white cursor-pointer">
            <option value="">All Statuses</option>
            <option value="processed">Processed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="pending_review">Pending Review</option>
            <option value="needs_correction">Needs Correction</option>
          </select>
          <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}