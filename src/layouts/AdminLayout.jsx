import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/common/AdminSidebar";
import AdminHeader from "../components/common/AdminHeader";
import SessionWarningModal from "../components/common/SessionWarningModal";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex">
      <SessionWarningModal />

      <AdminSidebar />

      <div className="flex-1 ml-[220px] flex flex-col">
        <AdminHeader />

        <main className="flex-1 px-6 pt-8 pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;