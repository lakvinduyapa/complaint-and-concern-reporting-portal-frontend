import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/common/AdminSidebar";
import AdminHeader from "../components/common/AdminHeader";
import SessionWarningModal from "../components/common/SessionWarningModal";

const AdminLayout = () => {
 return (
  <div className="min-h-screen bg-[#F5F7FA]">
    <SessionWarningModal />

    <AdminHeader />

    <div className="flex pt-24">
      <AdminSidebar />

<main
  id="admin-content"
  className="
    flex-1
    px-6
    py-6
    ml-[80px]
    transition-all
    duration-300
    ease-out
  "
>
        <Outlet />
      </main>
    </div>
  </div>
);
};

export default AdminLayout;