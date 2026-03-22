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
    if (value) next.set("q", value); else next.delete("q");
    setSearchParams(next);
  }

  function updateStatusFilter(value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("status", value); else next.delete("status");
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

  useEffect(() => { loadInvoices(); }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <AppHeader />
        <div
          className="mb-6"
          style={{ animation: "fadeSlideUp 0.5s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both" }}
        >
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>Invoices</h1>
          <p className="mt-1 text-sm text-slate-500">Upload and manage invoice documents</p>
        </div>
        <div className="grid gap-4">
          <div style={{ animation: "fadeSlideUp 0.5s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
            <UploadInvoiceCard onUploadSuccess={handleUpload} />
          </div>
          <div style={{ animation: "fadeSlideUp 0.5s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
            <InvoiceSearchFilter
              searchText={searchText}
              statusFilter={statusFilter}
              onSearchChange={updateSearchText}
              onStatusChange={updateStatusFilter}
            />
          </div>
          <div style={{ animation: "fadeSlideUp 0.5s 0.25s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
            <InvoiceList
              invoices={filteredInvoices}
              loading={loadingInvoices}
              error={invoiceError}
            />
          </div>
        </div>
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