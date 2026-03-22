const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

function authHeaders() {
  const token = localStorage.getItem("access_token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export async function uploadLeaveRequest(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/api/leave-requests/upload`, {
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

export async function fetchLeaveRequests() {
  const response = await fetch(`${API_BASE}/api/leave-requests`, {
    headers: {
      ...authHeaders(),
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch leave requests");
  return data;
}

export async function fetchLeaveRequestById(leaveRequestId) {
  const response = await fetch(`${API_BASE}/api/leave-requests/${leaveRequestId}`, {
    headers: {
      ...authHeaders(),
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch leave request");
  return data;
}

export async function updateLeaveRequestStatus(leaveRequestId, status, comment = "") {
  const response = await fetch(`${API_BASE}/api/leave-requests/${leaveRequestId}/status`, {
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

export async function autoRouteLeaveRequest(leaveRequestId) {
  const response = await fetch(`${API_BASE}/api/leave-requests/${leaveRequestId}/route/auto`, {
    method: "POST",
    headers: {
      ...authHeaders(),
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to auto-route leave request");
  return data;
}

export async function manuallyAssignLeaveRequest(leaveRequestId, department, comment = "") {
  const response = await fetch(`${API_BASE}/api/leave-requests/${leaveRequestId}/route/manual`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ department, comment }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to manually assign leave request");
  return data;
}

export async function addLeaveRequestComment(leaveRequestId, comment) {
  const response = await fetch(`${API_BASE}/api/leave-requests/${leaveRequestId}/comments`, {
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

export async function fetchLeaveRequestComments(leaveRequestId) {
  const response = await fetch(`${API_BASE}/api/leave-requests/${leaveRequestId}/comments`, {
    headers: {
      ...authHeaders(),
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch comments");
  return data;
}

export async function fetchLeaveRequestAuditLogs(leaveRequestId) {
  const response = await fetch(`${API_BASE}/api/leave-requests/${leaveRequestId}/audit-logs`, {
    headers: {
      ...authHeaders(),
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Failed to fetch audit logs");
  return data;
}