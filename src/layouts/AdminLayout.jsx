import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/common/AdminSidebar";
import SessionWarningModal from "../components/common/SessionWarningModal";

const AdminLayout = () => {
  return (
    <div className="app-shell min-h-screen flex flex-col md:flex-row">
      {/* Session Warning Modal */}
      <SessionWarningModal />

      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 w-full md:overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
