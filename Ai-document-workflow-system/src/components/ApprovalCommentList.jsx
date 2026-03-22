export default function ApprovalCommentList({ comments, loading, error }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">Approval Comments</h2>
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-slate-100 p-4 animate-pulse">
              <div className="h-3 bg-slate-100 rounded w-24 mb-3" />
              <div className="h-3 bg-slate-100 rounded w-full mb-1" />
              <div className="h-3 bg-slate-100 rounded w-2/3" />
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
      ) : comments.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          </div>
          <p className="text-sm text-slate-400">No comments yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((item, index) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-100 p-4 hover:border-slate-200 transition-all duration-150"
              style={{ animation: `fadeSlideUp 0.4s ${index * 0.05}s cubic-bezier(0.16, 1, 0.3, 1) both` }}
            >
              <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  {item.action || "comment"}
                </span>
                <span className="text-xs text-slate-400">
                  {item.created_at ? new Date(item.created_at).toLocaleString() : "-"}
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{item.comment}</p>
            </div>
          ))}
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