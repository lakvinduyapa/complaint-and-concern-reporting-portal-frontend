import API from "./api";

// ========================================
// Get Dashboard Stats
// ========================================

export const getDashboardStats = async () => {
  try {
    const response = await API.get("/admin/dashboard/stats");
    return response.data.data;
  } catch (error) {
    throw error.response?.data || {
      message: error.message || "Failed to fetch dashboard stats"
    };
  }
};

// ========================================
// Get Recent Complaints
// ========================================

export const getRecentComplaints = async (limit = 10) => {
  try {
    const response = await API.get("/admin/dashboard/recent-complaints", {
      params: { limit }
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || {
      message: error.message || "Failed to fetch recent complaints"
    };
  }
};
