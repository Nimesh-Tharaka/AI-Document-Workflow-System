const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

function authHeaders() {
  const token = localStorage.getItem("access_token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export async function uploadComplaint(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/api/complaints/upload`, {
    method: "POST",
    headers: { ...authHeaders() },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Upload failed");
  return data;
}

export async function fetchComplaints() {
  const response = await fetch(`${API_BASE}/api/complaints`, {
    headers: { ...authHeaders() },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch complaints");
  return data;
}

export async function fetchComplaintById(complaintId) {
  const response = await fetch(`${API_BASE}/api/complaints/${complaintId}`, {
    headers: { ...authHeaders() },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch complaint");
  return data;
}

export async function updateComplaintStatus(complaintId, status, comment = "") {
  const response = await fetch(`${API_BASE}/api/complaints/${complaintId}/status`, {
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

export async function autoRouteComplaint(complaintId) {
  const response = await fetch(`${API_BASE}/api/complaints/${complaintId}/route/auto`, {
    method: "POST",
    headers: { ...authHeaders() },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to auto-route complaint");
  return data;
}

export async function manuallyAssignComplaint(complaintId, department, comment = "") {
  const response = await fetch(`${API_BASE}/api/complaints/${complaintId}/route/manual`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ department, comment }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to manually assign complaint");
  return data;
}

export async function addComplaintComment(complaintId, comment) {
  const response = await fetch(`${API_BASE}/api/complaints/${complaintId}/comments`, {
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

export async function fetchComplaintComments(complaintId) {
  const response = await fetch(`${API_BASE}/api/complaints/${complaintId}/comments`, {
    headers: { ...authHeaders() },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch comments");
  return data;
}

export async function fetchComplaintAuditLogs(complaintId) {
  const response = await fetch(`${API_BASE}/api/complaints/${complaintId}/audit-logs`, {
    headers: { ...authHeaders() },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch audit logs");
  return data;
}