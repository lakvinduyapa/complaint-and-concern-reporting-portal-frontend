import API from "./api";

// ========================================
// Admin Login
// ========================================

export const adminLogin = async (email, password) => {
  try {
    const response = await API.post("/admin/auth/login", {
      email: email.trim(),
      password
    });

    // Store token
    if (response.data?.token) {
      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("adminUser", JSON.stringify(response.data.user));
      // Set token in API default headers
      API.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
    }

    return response.data;
  } catch (error) {
    const responseData = error.response?.data;

    throw {
      message:
        responseData?.message ||
        responseData?.error ||
        error.message ||
        "Login failed"
    };
  }
};

// ========================================
// Get Stored Token
// ========================================

export const getAdminToken = () => {
  return localStorage.getItem("adminToken");
};

// ========================================
// Get Stored User
// ========================================

export const getAdminUser = () => {
  const user = localStorage.getItem("adminUser");
  return user ? JSON.parse(user) : null;
};

// ========================================
// Logout
// ========================================

export const adminLogout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
  delete API.defaults.headers.common["Authorization"];
};

// ========================================
// Initialize Auth on App Load
// ========================================

export const initializeAdminAuth = () => {
  const token = getAdminToken();
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};
