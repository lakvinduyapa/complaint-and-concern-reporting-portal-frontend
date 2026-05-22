import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { adminUser, logout } = useAdminAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const getNavItemClass = (isActive) => {
    const baseClass = `flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-all border ${
      isCollapsed ? "justify-center px-2" : ""
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
        style={{ background: "#0B5EAE" }}
      >
        <div className="flex items-center gap-2">
          <img
            src="/01SLT.jpg.jpeg"
            alt="SLTMobitel"
            className="h-10 w-auto object-contain"
          />
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
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
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen border-r border-cyan-400/30 shadow-xl transition-all duration-300 ease-in-out z-40 md:z-30 md:translate-x-0 overflow-y-auto flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:sticky md:top-0 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
        style={{ background: "#0B5EAE" }}
      >
        {/* Logo */}
        <div className="hidden md:flex items-center justify-between pt-8 pb-6 px-4">
          <div
            className={`h-16 w-auto max-w-[200px] transition-all duration-300 ${
              isCollapsed ? "opacity-0 w-0" : ""
            }`}
          >
            <img
              src="/logoSlt.jpg"
              alt="SLTMobitel"
              className="h-full w-auto object-contain"
            />
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/10 rounded-lg text-white"
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

        {/* NAV LINKS (GREEN ACTIVE ONLY) */}
        <nav className="px-4 py-6 space-y-2">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => getNavItemClass(isActive)}
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/complaints"
            className={({ isActive }) => getNavItemClass(isActive)}
            onClick={() => setIsOpen(false)}
          >
            Complaints
          </NavLink>
        </nav>

        <div className="mx-4 border-t border-cyan-300/35" />

        {/* USER INFO (GREEN UPDATED) */}
        <div className="p-4 space-y-4">
          {adminUser?.email && (
            <div className="px-4 py-3 bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-white rounded-lg border-none">
              <p className="text-xs text-white mb-1">Logged in as</p>
              <p className="text-sm font-semibold text-white truncate">
                {adminUser.email}
              </p>
            </div>
          )}

          {/* LOGOUT BUTTON (GREEN ONLY) */}
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className={`w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all shadow-md flex items-center gap-2 ${
              isCollapsed ? "justify-center px-2" : ""
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <div className="h-16 md:hidden" />
    </>
  );
};

export default AdminSidebar;