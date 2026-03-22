const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

function authHeaders() {
  const token = localStorage.getItem("access_token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export async function uploadInvoice(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/api/invoices/upload`, {
    method: "POST",
    headers: {
      ...authHeaders(),
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.detail || "Upload failed");
  return data;
}

export async function fetchInvoices() {
  const response = await fetch(`${API_BASE}/api/invoices`, {
    headers: {
      ...authHeaders(),
    },
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.detail || "Failed to fetch invoices");
  return data;
}

export async function fetchInvoiceById(invoiceId) {
  const response = await fetch(`${API_BASE}/api/invoices/${invoiceId}`, {
    headers: {
      ...authHeaders(),
    },
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.detail || "Failed to fetch invoice");
  return data;
}

export async function updateInvoiceStatus(invoiceId, status, comment = "") {
  const response = await fetch(`${API_BASE}/api/invoices/${invoiceId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ status, comment }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.detail || "Failed to update status");
  return data;
}

export async function autoRouteInvoice(invoiceId) {
  const response = await fetch(`${API_BASE}/api/invoices/${invoiceId}/route/auto`, {
    method: "POST",
    headers: {
      ...authHeaders(),
    },
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.detail || "Failed to auto-route invoice");
  return data;
}

export async function manuallyAssignInvoice(invoiceId, department, comment = "") {
  const response = await fetch(`${API_BASE}/api/invoices/${invoiceId}/route/manual`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ department, comment }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.detail || "Failed to manually assign invoice");
  return data;
}

export async function addApprovalComment(invoiceId, comment) {
  const response = await fetch(`${API_BASE}/api/invoices/${invoiceId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ comment }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.detail || "Failed to add comment");
  return data;
}

export async function fetchApprovalComments(invoiceId) {
  const response = await fetch(`${API_BASE}/api/invoices/${invoiceId}/comments`, {
    headers: {
      ...authHeaders(),
    },
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.detail || "Failed to fetch comments");
  return data;
}

export async function fetchAuditLogs(invoiceId) {
  const response = await fetch(`${API_BASE}/api/invoices/${invoiceId}/audit-logs`, {
    headers: {
      ...authHeaders(),
    },
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.detail || "Failed to fetch audit logs");
  return data;
}