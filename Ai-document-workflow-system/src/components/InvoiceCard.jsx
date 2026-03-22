// InvoiceCard.jsx
import { Link } from "react-router";
import StatusBadge from "./StatusBadge";

export default function InvoiceCard({ invoice, index = 0 }) {
  return (
    <Link
      to={`/invoices/${invoice.id}`}
      className="block group"
      style={{ animation: `fadeSlideUp 0.4s ${index * 0.05}s cubic-bezier(0.16, 1, 0.3, 1) both` }}
    >
      <div className="rounded-2xl border border-slate-100 bg-white p-5 transition-all duration-200 hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-900 transition-colors duration-200">
              <svg className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-slate-700 transition-colors">{invoice.filename}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{invoice.vendor_name || "Unknown vendor"}</p>
            </div>
          </div>
          <StatusBadge status={invoice.status} />
        </div>

        <div className="grid gap-y-2 gap-x-4 grid-cols-2 md:grid-cols-3 mb-4">
          {[
            { label: "Invoice No.", value: invoice.invoice_number },
            { label: "Invoice Date", value: invoice.invoice_date },
            { label: "Due Date", value: invoice.due_date },
            { label: "Total Amount", value: invoice.total_amount },
            { label: "Currency", value: invoice.currency },
            { label: "Department", value: invoice.assigned_department },
          ].map(({ label, value }) => (
            value ? (
              <div key={label}>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-xs font-medium text-slate-700 mt-0.5 truncate">{value}</p>
              </div>
            ) : null
          ))}
        </div>

        {invoice.summary && (
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{invoice.summary}</p>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Link>
  );
}