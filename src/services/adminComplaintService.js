import API from "./api";

export const getAdminComplaints = async ({
  search = "",
  status = "",
  page = 1,
  limit = 10
} = {}) => {
  try {
    const response = await API.get("/admin/complaints", {
      params: {
        search,
        status,
        page,
        limit
      }
    });

    return response.data.data;
  } catch (error) {
    throw error.response?.data || {
      message: error.message || "Failed to fetch complaints"
    };
  }
};

export const getAdminComplaintDetails = async (id) => {
  try {
    const response = await API.get(`/admin/complaints/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || {
      message: error.message || "Failed to fetch complaint details"
    };
  }
};

export const getStatusOptions = async () => {
  try {
    const response = await API.get("/admin/status/options");
    return response.data.data;
  } catch (error) {
    throw error.response?.data || {
      message: error.message || "Failed to fetch status options"
    };
  }
};

export const updateComplaintStatus = async (id, payload) => {
  try {
    const response = await API.patch(`/admin/status/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: error.message || "Failed to update complaint status"
    };
  }
};