import { useState } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user, login } = useAuth();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-slate-50 to-white p-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.10)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative hidden bg-slate-900 p-10 text-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.10),transparent_30%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                AI Workflow Suite
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight">
                Clean white dashboard with faster document review flow.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
                Sign in to manage invoices, leave requests, complaints, routing, approvals, and audit history from one place.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-slate-200">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Invoice processing and analytics dashboard</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Leave request routing and approval trail</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Complaint intake, assignment, and follow-up</div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="mx-auto max-w-md">
            <div className="mb-8">
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                Sign In
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to the AI Document Workflow System.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-slate-900 outline-none transition-all duration-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-slate-900 outline-none transition-all duration-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  placeholder="Enter password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Login"}
              </button>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}
            </form>

            <div className="mt-6 rounded-[24px] bg-slate-50 p-5 ring-1 ring-slate-100">
              <p className="text-sm font-semibold text-slate-900">Demo accounts</p>
              <div className="mt-3 grid gap-2 text-sm text-slate-600">
                <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-100">admin / admin123</div>
                <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-100">staff / staff123</div>
                <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-slate-100">approver / approver123</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
