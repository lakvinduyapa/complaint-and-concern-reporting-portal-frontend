import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import {
  FiHome,
  FiFileText,
  FiLogOut,
} from "react-icons/fi";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const getNavItemClass = (isActive) => {
    const baseClass = `flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-all border ${
      isCollapsed ? "justify-center" : ""
    }`;

    return isActive
      ? `${baseClass} bg-green-600 text-white border-green-500`
      : `${baseClass} text-white border-transparent hover:bg-green-500/20`;
  };

  return (
    <>
      {/* Mobile Header */}
      <div
        className="fixed top-0 left-0 right-0 h-16 border-b border-cyan-400/30 shadow-lg z-40 md:hidden flex items-center justify-between px-4"
        style={{ background: "#0156A6" }}
      >
        <div className="flex items-center">
          <img
            src="/01SLT.jpg.jpeg"
            alt="SLTMobitel"
            className="h-14 w-auto object-contain bg-[#0156A6]"
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
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen border-r border-cyan-400/30 shadow-xl transition-all duration-300 ease-in-out z-40 md:z-30 overflow-y-auto flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 ${
          isCollapsed ? "md:w-24 w-64" : "w-64"
        }`}
        style={{ background: "#0156A6" }}
      >
        {/* Desktop Logo */}
        <div className="hidden md:flex items-center justify-between py-4 px-4">
          <div
            className={`transition-all duration-300 ${
              isCollapsed ? "opacity-0 w-0 overflow-hidden" : ""
            }`}
          >
            <img
              src="/01SLT.jpg.jpeg"
              alt="SLTMobitel"
              className="h-20 sm:h-24 md:h-28 lg:h-32 w-auto object-contain bg-[#0156A6]"
            />
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/10 rounded-lg text-white"
            aria-label="Collapse Sidebar"
          >
            <svg
              className={`w-5 h-5 transition-transform ${
                isCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-4 space-y-2">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => getNavItemClass(isActive)}
            onClick={() => setIsOpen(false)}
          >
            <FiHome className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink
            to="/admin/complaints"
            className={({ isActive }) => getNavItemClass(isActive)}
            onClick={() => setIsOpen(false)}
          >
            <FiFileText className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Complaints</span>}
          </NavLink>
        </nav>

        <div className="mx-4 border-t border-cyan-300/35" />

        {/* Logout */}
        <div className="p-4 mt-auto">
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className={`w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-3 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <FiLogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header Spacer */}
      <div className="h-16 md:hidden" />
    </>
  );
};

export default AdminSidebar;