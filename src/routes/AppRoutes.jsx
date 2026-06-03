import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";

import LandingPage from "../pages/public/LandingPage";
import ReporterStep from "../pages/public/ReporterStep";
import ComplaintStep from "../pages/public/ComplaintStep";
import SubjectStep from "../pages/public/SubjectStep";
import EvidenceStep from "../pages/public/EvidenceStep";
import DeclarationStep from "../pages/public/DeclarationStep";
import ConfirmationStep from "../pages/public/ConfirmationStep";
import TrackComplaint from "../pages/public/TrackComplaint";

import AdminLogin from "../pages/admin/Login";
import AdminDashboard from "../pages/admin/Dashboard";
import InvestigationManagement from "../pages/admin/InvestigationManagement";
import ComplaintList from "../pages/admin/ComplaintList";
import ComplaintDetails from "../pages/admin/ComplaintDetails";
import Reports from "../pages/admin/Reports";

import AdminProtectedRoute from "../components/common/AdminProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* =======================================
            PUBLIC ROUTES
        ======================================= */}
        <Route path="/" element={<PublicLayout />}>

          <Route
            index
            element={<LandingPage />}
          />

          <Route
            path="report"
            element={<ReporterStep />}
          />

          <Route
            path="report/complaint-details"
            element={<ComplaintStep />}
          />

          <Route
            path="report/subject-information"
            element={<SubjectStep />}
          />

          <Route
            path="report/evidence-upload"
            element={<EvidenceStep />}
          />

          <Route
            path="report/declaration"
            element={<DeclarationStep />}
          />

          <Route
            path="report/confirmation"
            element={<ConfirmationStep />}
          />

          <Route
            path="track-complaint"
            element={<TrackComplaint />}
          />

        </Route>

        {/* =======================================
            ADMIN LOGIN
        ======================================= */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* =======================================
            ADMIN PROTECTED ROUTES
        ======================================= */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >

          {/* Dashboard */}
          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          {/* Investigation Management */}
          <Route
            path="investigations"
            element={<InvestigationManagement />}
          />

          {/* Complaint Management */}
          <Route
            path="complaints"
            element={<ComplaintList />}
          />

          {/* Complaint Details */}
          <Route
            path="complaints/:id"
            element={<ComplaintDetails />}
          />

          {/* Reports */}
          <Route
            path="reports"
            element={<Reports />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;