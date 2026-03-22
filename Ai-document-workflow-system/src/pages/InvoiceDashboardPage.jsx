import { useEffect, useMemo, useState } from "react";
import { fetchInvoices } from "../api/invoiceApi";
import AppHeader from "../components/AppHeader";
import DashboardStatCard from "../components/DashboardStatCard";
import InvoiceDashboardCharts from "../components/InvoiceDashboardCharts";
import {
  buildDashboardStats, buildStatusChartData, buildVendorChartData,
  buildMonthlyCountData, buildMonthlyAmountData,
} from "../utils/invoiceAnalytics";

export default function InvoiceDashboardPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadInvoices() {
    setLoading(true); setError("");
    try { const data = await fetchInvoices(); setInvoices(data); }
    catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  useEffect(() => { loadInvoices(); }, []);

  const stats = useMemo(() => buildDashboardStats(invoices), [invoices]);
  const statusData = useMemo(() => buildStatusChartData(invoices), [invoices]);
  const vendorData = useMemo(() => buildVendorChartData(invoices), [invoices]);
  const monthlyCountData = useMemo(() => buildMonthlyCountData(invoices), [invoices]);
  const monthlyAmountData = useMemo(() => buildMonthlyAmountData(invoices), [invoices]);

  const statCards = [
    { title: "Total Invoices", value: stats.total },
    { title: "Processed", value: stats.processed },
    { title: "Pending Review", value: stats.pendingReview },
    { title: "Approved", value: stats.approved },
    { title: "Rejected", value: stats.rejected },
    {
      title: "Total Amount",
      value: stats.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <AppHeader />

        <div
          className="mb-8 flex flex-wrap items-end justify-between gap-4"
          style={{ animation: "fadeSlideUp 0.5s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both" }}
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
              Invoice Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">Analytics and summary for invoice processing</p>
          </div>
          <button
            type="button"
            onClick={loadInvoices}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:shadow active:scale-[0.97] disabled:opacity-50"
          >
            <svg
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {loading && invoices.length === 0 ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl bg-white border border-slate-100 p-6 animate-pulse">
                  <div className="h-3 bg-slate-100 rounded w-24 mb-4" />
                  <div className="h-10 bg-slate-100 rounded w-16 mb-4" />
                  <div className="h-0.5 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white border border-red-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-red-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
              style={{ animation: "fadeSlideUp 0.5s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both" }}
            >
              {statCards.map((card, i) => (
                <div key={card.title} style={{ animationDelay: `${0.2 + i * 0.05}s` }}>
                  <DashboardStatCard title={card.title} value={card.value} />
                </div>
              ))}
            </div>

            <div style={{ animation: "fadeSlideUp 0.5s 0.5s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
              <InvoiceDashboardCharts
                statusData={statusData}
                vendorData={vendorData}
                monthlyCountData={monthlyCountData}
                monthlyAmountData={monthlyAmountData}
              />
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}