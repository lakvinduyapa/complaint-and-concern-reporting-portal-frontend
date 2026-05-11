import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/common/AdminNavbar";
import SessionWarningModal from "../components/common/SessionWarningModal";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Session Warning Modal */}
      <SessionWarningModal />

      {/* Admin Navbar */}
      <AdminNavbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
