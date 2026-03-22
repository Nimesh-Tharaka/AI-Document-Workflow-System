import { Link } from "react-router";
import StatusBadge from "./StatusBadge";

export default function InvoiceCard({ invoice }) {
  return (
    <Link to={`/invoices/${invoice.id}`} className="group block">
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_40px_rgba(15,23,42,0.07)]">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Invoice File
            </p>
            <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-slate-700">
              {invoice.filename}
            </h3>
          </div>
          <StatusBadge status={invoice.status} />
        </div>

        <div className="grid gap-3 text-sm text-slate-700 md:grid-cols-2">
          <p><span className="font-semibold text-slate-900">Vendor:</span> {invoice.vendor_name || "-"}</p>
          <p><span className="font-semibold text-slate-900">Invoice Number:</span> {invoice.invoice_number || "-"}</p>
          <p><span className="font-semibold text-slate-900">Invoice Date:</span> {invoice.invoice_date || "-"}</p>
          <p><span className="font-semibold text-slate-900">Due Date:</span> {invoice.due_date || "-"}</p>
          <p><span className="font-semibold text-slate-900">Total Amount:</span> {invoice.total_amount || "-"}</p>
          <p><span className="font-semibold text-slate-900">Currency:</span> {invoice.currency || "-"}</p>
        </div>

        <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100 transition-all duration-300 group-hover:bg-white">
          <p className="mb-2 text-sm font-semibold text-slate-900">Summary</p>
          <p className="line-clamp-3 text-sm leading-7 text-slate-600">{invoice.summary || "-"}</p>
        </div>
      </div>
    </Link>
  );
}
