import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { FiHome, FiFileText, FiBarChart2, FiLogOut } from "react-icons/fi";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const getNavItemClass = (isActive) => {
    const baseClass =
      "flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-all border";

    return isActive
      ? `${baseClass} bg-green-600 text-white border-green-500`
      : `${baseClass} text-white border-transparent hover:bg-green-500/20`;
  };

  return (
    <>
      {/* Mobile Header */}
      <div
        className="fixed top-0 left-0 right-0 h-16 border-b border-cyan-400/30 shadow-lg z-50 md:hidden flex items-center justify-between px-4"
        style={{ background: "#0156A6" }}
      >
        <div className="flex items-center">
          <img
            src="/01SLT.jpg.jpeg"
            alt="SLTMobitel"
            className="h-14 w-auto object-contain"
          />
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Toggle Sidebar"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 md:top-0 h-[calc(100vh-4rem)] md:h-screen border-r border-cyan-400/30 shadow-xl transition-all duration-300 ease-in-out z-50 md:z-30 flex flex-col overflow-y-hidden md:overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64`}
        style={{ background: "#0156A6" }}
      >
        {/* Desktop Logo */}
        <div className="hidden md:flex justify-center py-4 px-4">
          <img
            src="/01SLT.jpg.jpeg"
            alt="SLTMobitel"
            className="h-24 w-auto object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="px-4 py-4 space-y-2">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => getNavItemClass(isActive)}
            onClick={() => setIsOpen(false)}
          >
            <FiHome className="w-5 h-5 flex-shrink-0" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/reports"
            className={({ isActive }) => getNavItemClass(isActive)}
            onClick={() => setIsOpen(false)}
          >
            <FiBarChart2 className="w-5 h-5 flex-shrink-0" />
            <span>Reports</span>
          </NavLink>

          <NavLink
            to="/admin/complaints"
            className={({ isActive }) => getNavItemClass(isActive)}
            onClick={() => setIsOpen(false)}
          >
            <FiFileText className="w-5 h-5 flex-shrink-0" />
            <span>Complaints</span>
          </NavLink>
        </nav>

        {/* Push Logout to Bottom */}
        <div className="flex-1" />

        {/* Divider */}
        <div className="mx-4 border-t border-cyan-300/35" />

        {/* Logout */}
        <div className="p-4">
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-3"
          >
            <FiLogOut className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header Spacer */}
      <div className="h-16 md:hidden" />
    </>
  );
};

export default AdminSidebar;