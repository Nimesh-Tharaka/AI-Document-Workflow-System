export default function AuditLogList({ logs, loading, error }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">Audit Log</h2>
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          {logs.length} {logs.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-6 h-6 bg-slate-100 rounded-full shrink-0 mt-1" />
              <div className="flex-1">
                <div className="h-3 bg-slate-100 rounded w-32 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <p className="text-sm text-slate-400">No audit logs yet</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-2.5 top-3 bottom-3 w-px bg-slate-100" />
          <div className="space-y-4 pl-8">
            {logs.map((item, index) => (
              <div
                key={item.id}
                className="relative"
                style={{ animation: `fadeSlideUp 0.4s ${index * 0.05}s cubic-bezier(0.16, 1, 0.3, 1) both` }}
              >
                {/* Dot */}
                <div className="absolute -left-8 top-1 w-5 h-5 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                </div>

                <div className="rounded-xl border border-slate-100 p-4 hover:border-slate-200 transition-all duration-150">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {item.action}
                    </span>
                    <span className="text-xs text-slate-400">
                      {item.created_at ? new Date(item.created_at).toLocaleString() : "-"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.details || "-"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}