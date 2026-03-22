function normalizeStatus(status) {
  return (status || "").toLowerCase();
}

function formatStatusLabel(status) {
  if (!status) return "Unknown";

  const map = {
    processed: "Processed",
    pending_review: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",
    needs_correction: "Needs Correction",
  };

  return map[status] || status;
}

function parseAmount(amountText) {
  if (!amountText) return 0;

  const cleaned = String(amountText)
    .replace(/Rs\.?/gi, "")
    .replace(/LKR/gi, "")
    .replace(/USD/gi, "")
    .replace(/EUR/gi, "")
    .replace(/GBP/gi, "")
    .replace(/\$/g, "")
    .replace(/,/g, "")
    .trim();

  const match = cleaned.match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function getSafeDate(invoice) {
  if (invoice?.created_at) {
    const date = new Date(invoice.created_at);
    if (!isNaN(date.getTime())) return date;
  }
  return null;
}

function formatMonthLabel(date) {
  return date.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function buildDashboardStats(invoices) {
  const total = invoices.length;
  const processed = invoices.filter((x) => normalizeStatus(x.status) === "processed").length;
  const pendingReview = invoices.filter((x) => normalizeStatus(x.status) === "pending_review").length;
  const approved = invoices.filter((x) => normalizeStatus(x.status) === "approved").length;
  const rejected = invoices.filter((x) => normalizeStatus(x.status) === "rejected").length;
  const needsCorrection = invoices.filter((x) => normalizeStatus(x.status) === "needs_correction").length;

  const totalAmount = invoices.reduce((sum, invoice) => {
    return sum + parseAmount(invoice.total_amount);
  }, 0);

  return {
    total,
    processed,
    pendingReview,
    approved,
    rejected,
    needsCorrection,
    totalAmount,
  };
}

export function buildStatusChartData(invoices) {
  const counts = {};

  invoices.forEach((invoice) => {
    const status = normalizeStatus(invoice.status) || "unknown";
    counts[status] = (counts[status] || 0) + 1;
  });

  return Object.entries(counts).map(([status, count]) => ({
    name: formatStatusLabel(status),
    value: count,
  }));
}

export function buildVendorChartData(invoices) {
  const counts = {};

  invoices.forEach((invoice) => {
    const vendor = (invoice.vendor_name || "Unknown Vendor").trim();
    counts[vendor] = (counts[vendor] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([vendor, count]) => ({
      name: vendor,
      value: count,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

export function buildMonthlyCountData(invoices) {
  const counts = {};

  invoices.forEach((invoice) => {
    const date = getSafeDate(invoice);
    if (!date) return;

    const key = formatMonthLabel(date);
    counts[key] = (counts[key] || 0) + 1;
  });

  return Object.entries(counts).map(([month, count]) => ({
    month,
    count,
  }));
}

export function buildMonthlyAmountData(invoices) {
  const totals = {};

  invoices.forEach((invoice) => {
    const date = getSafeDate(invoice);
    if (!date) return;

    const key = formatMonthLabel(date);
    totals[key] = (totals[key] || 0) + parseAmount(invoice.total_amount);
  });

  return Object.entries(totals).map(([month, total]) => ({
    month,
    total: Number(total.toFixed(2)),
  }));
}