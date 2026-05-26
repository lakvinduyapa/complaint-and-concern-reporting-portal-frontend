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
import ComplaintList from "../pages/admin/ComplaintList";
import ComplaintDetails from "../pages/admin/ComplaintDetails";
import AdminProtectedRoute from "../components/common/AdminProtectedRoute";
import Reports from "../pages/admin/Reports";

const AppRoutes = () => {

  return (

    <BrowserRouter>

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>

          {/* Landing Page */}
          <Route
            index
            element={<LandingPage />}
          />

          {/* Step 1 */}
          <Route
            path="report"
            element={<ReporterStep />}
          />

          {/* Step 2 */}
          <Route
            path="report/complaint-details"
            element={<ComplaintStep />}
          />

          {/* Step 3 */}
          <Route
            path="report/subject-information"
            element={<SubjectStep />}
          />

          {/* Step 4 */}
          <Route
            path="report/evidence-upload"
            element={<EvidenceStep />}
          />

          {/* Step 5 */}
          <Route
            path="report/declaration"
            element={<DeclarationStep />}
          />

          {/* Step 6 */}
          <Route
            path="report/confirmation"
            element={<ConfirmationStep />}
          />

          {/* Tracking */}
          <Route
            path="track-complaint"
            element={<TrackComplaint />}
          />

        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="complaints" element={<ComplaintList />} />
          <Route path="complaints/:id" element={<ComplaintDetails />} />
          <Route path="/admin/reports" element={<Reports />} />
        </Route>

      </Routes>

    </BrowserRouter>

  );

};

export default AppRoutes;