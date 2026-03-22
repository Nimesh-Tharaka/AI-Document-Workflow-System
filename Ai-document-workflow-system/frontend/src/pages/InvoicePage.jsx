import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import UploadInvoiceCard from "../components/UploadInvoiceCard";
import InvoiceList from "../components/InvoiceList";
import InvoiceSearchFilter from "../components/InvoiceSearchFilter";
import AppHeader from "../components/AppHeader";
import { fetchInvoices, uploadInvoice } from "../api/invoiceApi";

export default function InvoicePage() {
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [invoiceError, setInvoiceError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const searchText = searchParams.get("q") || "";
  const statusFilter = searchParams.get("status") || "";

  async function loadInvoices() {
    setLoadingInvoices(true);
    setInvoiceError("");

    try {
      const data = await fetchInvoices();
      setInvoices(data);
    } catch (err) {
      setInvoiceError(err.message);
    } finally {
      setLoadingInvoices(false);
    }
  }

  async function handleUpload(file) {
    await uploadInvoice(file);
    await loadInvoices();
  }

  function updateSearchText(value) {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set("q", value);
    } else {
      next.delete("q");
    }

    setSearchParams(next);
  }

  function updateStatusFilter(value) {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set("status", value);
    } else {
      next.delete("status");
    }

    setSearchParams(next);
  }

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const searchValue = searchText.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        (invoice.filename || "").toLowerCase().includes(searchValue) ||
        (invoice.vendor_name || "").toLowerCase().includes(searchValue) ||
        (invoice.invoice_number || "").toLowerCase().includes(searchValue) ||
        (invoice.summary || "").toLowerCase().includes(searchValue) ||
        (invoice.assigned_department || "").toLowerCase().includes(searchValue);

      const matchesStatus =
        !statusFilter ||
        (invoice.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchText, statusFilter]);

  useEffect(() => {
    loadInvoices();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="mx-auto max-w-6xl p-6">
        <AppHeader />

        <div className="mb-6 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Invoice Workspace
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Invoice Processing Center</h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                Upload, search, and review invoice documents with a cleaner white interface and smoother interactions.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center ring-1 ring-slate-100">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Total</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{invoices.length}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center ring-1 ring-slate-100">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Filtered</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{filteredInvoices.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <UploadInvoiceCard onUploadSuccess={handleUpload} />

          <InvoiceSearchFilter
            searchText={searchText}
            statusFilter={statusFilter}
            onSearchChange={updateSearchText}
            onStatusChange={updateStatusFilter}
          />

          <InvoiceList invoices={filteredInvoices} loading={loadingInvoices} error={invoiceError} />
        </div>
      </div>
    </div>
  );
}
