import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

function getInitials(user) {
  const name = user?.full_name || user?.username || "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function roleColor(role) {
  switch (role) {
    case "admin":
      return "bg-violet-100 text-violet-700 ring-violet-200";
    case "approver":
      return "bg-amber-100 text-amber-700 ring-amber-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
}

function NavLink({ to, label, currentPath, startsWith = false }) {
  const isActive = startsWith
    ? currentPath.startsWith(to)
    : currentPath === to;

  return (
    <Link
      to={to}
      className={[
        "relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      ].join(" ")}
    >
      {label}
      {isActive && (
        <span className="absolute -bottom-px left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-white/40" />
      )}
    </Link>
  );
}

export default function AppHeader() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isDashboardVisible =
    user?.role === "admin" || user?.role === "approver";

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/upload", label: "Upload", startsWith: true },
    { to: "/invoices", label: "Invoices", startsWith: true },
    { to: "/leave-requests", label: "Leave Requests", startsWith: true },
    { to: "/complaints", label: "Complaints", startsWith: true },
    ...(isDashboardVisible
      ? [{ to: "/dashboard", label: "Dashboard", startsWith: true }]
      : []),
  ];

  return (
    <header className="mb-8">
      <div className="overflow-hidden rounded-[28px] border border-slate-200/60 bg-white shadow-[0_8px_32px_rgba(15,23,42,0.08)] ring-1 ring-white/80">
        {/* Accent gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400" />

        <div className="px-6 py-5 md:px-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

            {/* Left — Brand + user info */}
            <div className="min-w-0 flex items-start gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/25 select-none">
                {getInitials(user)}
              </div>

              <div>
                {/* Pill badge */}
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Smart Workflow Hub
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl leading-tight">
                  AI Document Workflow
                </h1>

                <p className="mt-1 text-sm text-slate-400 leading-5">
                  Uploads · Approvals · Routing · Tracking
                </p>

                {/* User meta */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800">
                    {user?.full_name || user?.username || "User"}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1",
                      roleColor(user?.role),
                    ].join(" ")}
                  >
                    {user?.role || "guest"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right — Nav + logout */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center xl:flex-col xl:items-end">
              {/* Nav pill group */}
              <nav className="flex flex-wrap items-center gap-1 rounded-2xl bg-slate-50 p-1.5 ring-1 ring-slate-100">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    label={link.label}
                    currentPath={location.pathname}
                    startsWith={link.startsWith}
                  />
                ))}
              </nav>

              {/* Logout */}
              <button
                type="button"
                onClick={logout}
                className="self-start sm:self-auto xl:self-end inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 hover:shadow-md active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}