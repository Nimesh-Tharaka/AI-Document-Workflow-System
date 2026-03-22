import { useState } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const demoAccounts = [
  { user: "admin", pass: "admin123", role: "Administrator", color: "from-violet-500 to-purple-600", dot: "bg-violet-400" },
  { user: "staff", pass: "staff123", role: "Staff", color: "from-blue-500 to-cyan-500", dot: "bg-blue-400" },
  { user: "approver", pass: "approver123", role: "Approver", color: "from-emerald-500 to-teal-500", dot: "bg-emerald-400" },
];

const features = [
  { icon: "🤖", label: "AI Classification" },
  { icon: "⚡", label: "Auto-Routing" },
  { icon: "🔍", label: "Audit Logs" },
  { icon: "✅", label: "Approvals" },
];

export default function LoginPage() {
  const { user, login } = useAuth();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-[#f8f9fb]">

      {/* ── Left dark panel ── */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[42%] flex-col justify-between relative overflow-hidden bg-slate-950 p-10 xl:p-14">
        {/* Dot-grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-violet-600 opacity-20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-600 opacity-15 blur-3xl" />

        {/* Brand mark */}
        <div className="relative">
          <div
            className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-violet-500/30"
            style={{ animation: "fadeSlideUp 0.5s 0.1s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
          </div>
          <p
            className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500"
            style={{ animation: "fadeSlideUp 0.5s 0.15s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            Smart Workflow Hub
          </p>
        </div>

        {/* Hero text */}
        <div className="relative space-y-6">
          <h2
            className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.15] text-white"
            style={{ animation: "fadeSlideUp 0.6s 0.2s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            Document workflows,{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              reimagined.
            </span>
          </h2>

          <p
            className="text-sm leading-7 text-slate-400 max-w-xs"
            style={{ animation: "fadeSlideUp 0.6s 0.28s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            Upload, classify, route, and track business documents — all powered by AI, all in one place.
          </p>

          {/* Feature badges */}
          <div
            className="flex flex-wrap gap-2"
            style={{ animation: "fadeSlideUp 0.6s 0.35s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            {features.map(({ icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-300 shadow-sm"
              >
                <span>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom attestation */}
        <div
          className="relative flex items-center gap-3"
          style={{ animation: "fadeSlideUp 0.5s 0.45s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <div className="flex -space-x-2">
            {["V", "S", "A"].map((l, i) => (
              <div
                key={l}
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-950 text-[11px] font-bold text-white bg-gradient-to-br ${
                  i === 0 ? "from-violet-500 to-purple-600" : i === 1 ? "from-blue-500 to-cyan-500" : "from-emerald-500 to-teal-500"
                }`}
              >
                {l}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            Used by <span className="text-slate-300 font-semibold">admins, staff & approvers</span>
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-12">
        {/* Mobile brand */}
        <div className="mb-8 text-center lg:hidden">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg mb-3">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Document Workflow</h1>
          <p className="text-sm text-slate-500">AI-powered document processing</p>
        </div>

        <div
          className="w-full max-w-[400px]"
          style={{ animation: "fadeSlideUp 0.6s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          {/* Form card */}
          <div className="rounded-[28px] border border-slate-200/80 bg-white p-8 shadow-[0_12px_48px_rgba(15,23,42,0.08)]">
            {/* Top accent */}
            <div className="mb-6 h-1 w-full rounded-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400" />

            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h2>
            <p className="mt-1 text-sm text-slate-500">Sign in to your workspace</p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              {/* Username */}
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocused("username")}
                  onBlur={() => setFocused(null)}
                  autoComplete="username"
                  className="w-full rounded-xl border bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-300"
                  style={{
                    borderColor: focused === "username" ? "#7c3aed" : "#e2e8f0",
                    boxShadow: focused === "username" ? "0 0 0 3px rgba(124,58,237,0.1)" : "none",
                  }}
                  placeholder="your username"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  autoComplete="current-password"
                  className="w-full rounded-xl border bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-300"
                  style={{
                    borderColor: focused === "password" ? "#7c3aed" : "#e2e8f0",
                    boxShadow: focused === "password" ? "0 0 0 3px rgba(124,58,237,0.1)" : "none",
                  }}
                  placeholder="••••••••"
                />
              </div>

              {/* Error */}
              {error && (
                <div
                  className="flex items-start gap-2.5 rounded-xl border border-rose-100 bg-rose-50 p-3.5 text-sm text-rose-600"
                  style={{ animation: "fadeSlideUp 0.3s cubic-bezier(0.16,1,0.3,1) forwards" }}
                >
                  <svg className="mt-0.5 h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-200 hover:scale-[1.01] hover:shadow-xl hover:shadow-violet-500/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign in
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Demo accounts */}
          <div
            className="mt-4 rounded-[24px] border border-slate-200/60 bg-white p-5 shadow-sm"
            style={{ animation: "fadeSlideUp 0.5s 0.2s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Demo accounts — click to fill
            </p>
            <div className="space-y-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.user}
                  type="button"
                  onClick={() => { setUsername(acc.user); setPassword(acc.pass); }}
                  className="group w-full flex items-center justify-between rounded-xl border border-transparent px-3.5 py-2.5 text-sm transition-all duration-150 hover:border-slate-100 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`h-2 w-2 rounded-full ${acc.dot}`} />
                    <span className="font-semibold text-slate-800">{acc.role}</span>
                  </div>
                  <span className="font-mono text-xs text-slate-400 group-hover:text-slate-600 transition-colors">
                    {acc.user} / {acc.pass}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-slate-400">
            Secure · Audit-logged · AI-powered
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}