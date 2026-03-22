export default function DashboardStatCard({ title, value, subtitle = "" }) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">{title}</p>
      <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</h3>
      {subtitle && <p className="mt-3 text-sm leading-6 text-slate-500">{subtitle}</p>}
    </div>
  );
}
