export default function DashboardStatCard({ title, value, subtitle = "" }) {
  return (
    <div
      className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
      style={{ animation: "fadeSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both" }}
    >
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{title}</p>
      <h3
        className="mt-3 text-4xl font-bold text-slate-900 tabular-nums"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        {value}
      </h3>
      {subtitle && <p className="mt-2 text-xs text-slate-400">{subtitle}</p>}
      <div className="mt-4 h-0.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-slate-900 rounded-full transition-all duration-700 group-hover:w-full"
          style={{ width: "30%" }}
        />
      </div>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}