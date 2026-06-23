import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import AdminLogin from "../pages/admin/Login";
import AdminDashboard from "../pages/admin/Dashboard";
import InvestigationManagement from "../pages/admin/InvestigationManagement";
import ComplaintList from "../pages/admin/ComplaintList";
import ComplaintDetails from "../pages/admin/ComplaintDetails";
import Reports from "../pages/admin/Reports";
import AuditLogs from "../pages/admin/AuditLogs";

import AdminProtectedRoute from "../components/common/AdminProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* DEFAULT ROUTE */}
        <Route
          path="/"
          element={<Navigate to="/admin/login" replace />}
        />

        {/* ADMIN LOGIN */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* ADMIN PROTECTED ROUTES */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="investigations"
            element={<InvestigationManagement />}
          />

          <Route
            path="complaints"
            element={<ComplaintList />}
          />

          <Route
            path="complaints/:id"
            element={<ComplaintDetails />}
          />

          <Route
            path="reports"
            element={<Reports />}
          />

          <Route
            path="audit-logs"
            element={<AuditLogs />}
          />
        </Route>

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to="/admin/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;