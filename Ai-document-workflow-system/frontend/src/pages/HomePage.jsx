import { Link } from "react-router";
import AppHeader from "../components/AppHeader";

const cards = [
  {
    title: "Universal Upload",
    description: "One drop zone for invoices, complaints, and leave requests — routed automatically on arrival.",
    to: "/upload",
    buttonText: "Open Upload",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    accent: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/20",
    pill: "bg-violet-50 text-violet-600 ring-violet-100",
    tag: "All types",
  },
  {
    title: "Invoices",
    description: "Track extraction, approvals, and routing. Full audit trail from submission to settlement.",
    to: "/invoices",
    buttonText: "Open Invoices",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="9" y1="7" x2="15" y2="7" />
        <line x1="9" y1="11" x2="15" y2="11" />
        <line x1="9" y1="15" x2="12" y2="15" />
      </svg>
    ),
    accent: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/20",
    pill: "bg-blue-50 text-blue-600 ring-blue-100",
    tag: "Finance",
  },
  {
    title: "Leave Requests",
    description: "Review employee leave documents and manage the full approval flow with comment threads.",
    to: "/leave-requests",
    buttonText: "Open Leave",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </svg>
    ),
    accent: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/20",
    pill: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    tag: "HR",
  },
  {
    title: "Complaints",
    description: "Handle customer complaints with intelligent routing, threaded comments, and audit logs.",
    to: "/complaints",
    buttonText: "Open Complaints",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <line x1="9" y1="10" x2="15" y2="10" />
        <line x1="12" y1="7" x2="12" y2="13" />
      </svg>
    ),
    accent: "from-rose-500 to-pink-500",
    glow: "shadow-rose-500/20",
    pill: "bg-rose-50 text-rose-600 ring-rose-100",
    tag: "Support",
  },
];

function HomeCard({ title, description, to, buttonText, icon, accent, glow, pill, tag }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)]">
      {/* Top accent line */}
      <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

      {/* Icon */}
      <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg ${glow}`}>
        {icon}
      </div>

      {/* Tag */}
      <span className={`mb-3 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ring-1 ${pill}`}>
        {tag}
      </span>

      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">{description}</p>

      <Link
        to={to}
        className={`mt-5 inline-flex items-center gap-2 self-start rounded-full bg-gradient-to-r ${accent} px-4 py-2 text-sm font-semibold text-white shadow-md ${glow} transition-all duration-200 hover:scale-105 hover:shadow-lg`}
      >
        {buttonText}
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
        </svg>
      </Link>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Subtle dot-grid background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-6">
        <AppHeader />

        {/* Hero */}
        <div className="relative overflow-hidden rounded-[32px] border border-slate-200/60 bg-white p-8 shadow-[0_12px_48px_rgba(15,23,42,0.08)] md:p-12">
          {/* Blurred gradient orbs */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-200 opacity-30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 right-48 h-56 w-56 rounded-full bg-cyan-200 opacity-25 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Live System
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                Smart document{" "}
                <span className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
                  workflow,
                </span>
                <br />
                all in one place.
              </h1>

              <p className="mt-5 text-base leading-8 text-slate-500 md:text-lg">
                Upload documents, route them automatically, review approvals, and
                monitor audit logs — through a clean dashboard built for clarity and speed.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-violet-500/30"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                    <path d="M5 21h14" />
                  </svg>
                  Start Uploading
                </Link>

                <Link
                  to="/invoices"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
                >
                  View Invoices
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-slate-400">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-3 lg:flex-col">
              {[
                { label: "Document Types", value: "4" },
                { label: "Auto-Routed", value: "AI" },
                { label: "Audit Logged", value: "100%" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 shadow-sm">
                  <span className="text-2xl font-black tracking-tight text-slate-900">{value}</span>
                  <span className="text-xs font-medium text-slate-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section header */}
        <div className="mt-10 mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Workflow Modules</h2>
            <p className="mt-0.5 text-sm text-slate-500">Jump into any section of your document pipeline</p>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
            4 modules
          </span>
        </div>

        {/* Cards grid */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <HomeCard key={card.to} {...card} />
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-8 text-center text-xs text-slate-400">
          AI Document Workflow System · All actions are audit-logged and traceable
        </p>
      </div>
    </div>
  );
}