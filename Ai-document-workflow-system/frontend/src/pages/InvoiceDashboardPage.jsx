import { useEffect, useMemo, useState } from "react";
import { fetchInvoices } from "../api/invoiceApi";
import AppHeader from "../components/AppHeader";
import DashboardStatCard from "../components/DashboardStatCard";
import InvoiceDashboardCharts from "../components/InvoiceDashboardCharts";
import {
  buildDashboardStats,
  buildStatusChartData,
  buildVendorChartData,
  buildMonthlyCountData,
  buildMonthlyAmountData,
} from "../utils/invoiceAnalytics";

export default function InvoiceDashboardPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadInvoices() {
    setLoading(true);
    setError("");

    try {
      const data = await fetchInvoices();
      setInvoices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvoices();
  }, []);

  const stats = useMemo(() => buildDashboardStats(invoices), [invoices]);
  const statusData = useMemo(() => buildStatusChartData(invoices), [invoices]);
  const vendorData = useMemo(() => buildVendorChartData(invoices), [invoices]);
  const monthlyCountData = useMemo(() => buildMonthlyCountData(invoices), [invoices]);
  const monthlyAmountData = useMemo(() => buildMonthlyAmountData(invoices), [invoices]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="mx-auto max-w-7xl p-6">
        <AppHeader />

        <div className="mb-8 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Analytics Dashboard
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Invoice Dashboard</h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                Analytics and chart summary for invoice processing in a cleaner white visual style.
              </p>
            </div>

            <button
              type="button"
              onClick={loadInvoices}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
            >
              Refresh Dashboard
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            <div className="space-y-4 animate-pulse">
              <div className="h-6 w-64 rounded bg-slate-200" />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-32 rounded-[24px] bg-slate-100" />
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-red-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <DashboardStatCard title="Total Invoices" value={stats.total} />
              <DashboardStatCard title="Processed" value={stats.processed} />
              <DashboardStatCard title="Pending Review" value={stats.pendingReview} />
              <DashboardStatCard title="Approved" value={stats.approved} />
              <DashboardStatCard title="Rejected" value={stats.rejected} />
              <DashboardStatCard
                title="Total Amount"
                value={stats.totalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              />
            </div>

            <InvoiceDashboardCharts
              statusData={statusData}
              vendorData={vendorData}
              monthlyCountData={monthlyCountData}
              monthlyAmountData={monthlyAmountData}
            />
          </div>
        )}
      </div>
    </div>
  );
}
