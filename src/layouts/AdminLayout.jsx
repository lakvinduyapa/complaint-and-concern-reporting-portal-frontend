import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/common/AdminSidebar";
import AdminHeader from "../components/common/AdminHeader";
import SessionWarningModal from "../components/common/SessionWarningModal";
import { useState } from "react";

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex">
      <SessionWarningModal />

      <AdminSidebar
  sidebarCollapsed={sidebarCollapsed}
  setSidebarCollapsed={setSidebarCollapsed}
/>

      <div
  className={`
    flex-1
    flex
    flex-col
    transition-[margin]
    duration-500
    ease-[cubic-bezier(0.4,0,0.2,1)]
    ${sidebarCollapsed ? "ml-0" : "ml-[220px]"}
  `}
>
        <AdminHeader
  sidebarCollapsed={sidebarCollapsed}
  setSidebarCollapsed={setSidebarCollapsed}
/>

        <main className="flex-1 px-6 pt-8 pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;