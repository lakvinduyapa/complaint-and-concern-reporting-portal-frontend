const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => {
  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    ""
  );
};

const buildHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const request = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    headers: buildHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const getAuditLogs = async (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params.append(key, value);
    }
  });

  return request(`${API_BASE_URL}/admin/audit?${params.toString()}`);
};

export const getAuditActions = async () => {
  const data = await request(`${API_BASE_URL}/admin/audit/actions`);
  return data.actions || [];
};

export const getAuditUsers = async () => {
  const data = await request(`${API_BASE_URL}/admin/audit/users`);
  return data.users || [];
};

export const getAuditComplaints = async () => {
  const data = await request(`${API_BASE_URL}/admin/audit/complaints`);
  return data.complaints || [];
};