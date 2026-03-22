function formatAction(action) {
  if (!action) return "Log";
  return action.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function AuditLogList({ logs, loading, error }) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_10px_35px_rgba(15,23,42,0.05)] transition-all duration-300 hover:shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Audit Log</h2>
          <p className="mt-1 text-sm text-slate-500">System activity, routing, and approval updates.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {logs.length} items
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse rounded-2xl border border-slate-200 p-4">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="mt-3 h-3 w-full rounded bg-slate-100" />
              <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
          No audit logs available yet.
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((item, index) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                    {formatAction(item.action)}
                  </span>
                  <span className="text-xs text-slate-400">#{index + 1}</span>
                </div>
                <span className="text-sm text-slate-500">
                  {item.created_at ? new Date(item.created_at).toLocaleString() : "-"}
                </span>
              </div>

              <p className="leading-7 text-slate-700">{item.details || "-"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
