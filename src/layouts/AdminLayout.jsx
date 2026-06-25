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
    min-w-0
    w-[calc(100%-80px)]
    px-4
    sm:px-5
    lg:px-6
    xl:px-8
    py-6
    ml-[80px]
    transition-all
    duration-300
    ease-out
    overflow-x-hidden
  "
>
        <Outlet />
      </main>
    </div>
  </div>
);
};

export default AdminLayout;