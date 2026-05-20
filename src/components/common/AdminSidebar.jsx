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

  const getNavItemClass = (route, isActive) => {
    const baseClass = `flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-all border ${isCollapsed ? "justify-center px-2" : ""}`;
    
    const dashboardActive = route === "dashboard" && isActive 
      ? "bg-gradient-to-r from-blue-700 via-blue-500 to-green-400 text-white border-none" 
      : "text-white border-transparent";
    
    const complaintsActive = route === "complaints" && isActive 
      ? "bg-gradient-to-r from-blue-700 via-blue-500 to-green-400 text-white border-none" 
      : "text-white border-transparent";
    
    if (route === "dashboard") return `${baseClass} ${dashboardActive}`;
    if (route === "complaints") return `${baseClass} ${complaintsActive}`;
    return baseClass;
  };

  return (
    <>
      {/* Mobile Header */}
      <div
        className="fixed top-0 left-0 right-0 h-16 border-b border-cyan-400/30 shadow-lg z-40 md:hidden flex items-center justify-between px-4"
        style={{
          background: "linear-gradient(90deg, #1761a0 0%, #2697b7 50%, #2ecc71 100%)"
        }}
      >
        <div className="flex items-center gap-2">
          <img
            src="/2.webp"
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

      {/* Sidebar Overlay (Mobile) */}
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
        } md:sticky md:top-0 ${isCollapsed ? "w-20" : "w-64"}`}
        style={{
          background: "linear-gradient(180deg, #1761a0 0%, #2697b7 55%, #2ecc71 100%)"
        }}
      >
        {/* Logo Section */}
        <div className="hidden md:flex items-center justify-between pt-8 pb-6 px-4">
          <div className={`h-16 w-auto max-w-[200px] transition-all duration-300 ${isCollapsed ? "opacity-0 w-0" : ""}`}>
            <img
              src="/2.webp"
              alt="SLTMobitel"
              className="h-full w-auto object-contain drop-shadow-lg"
            />
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white hover:text-white"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
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

        {/* Mobile Logo (smaller) */}
        <div className="md:hidden flex items-center justify-center pt-20 pb-4 px-4">
          <div className="h-12 w-auto max-w-[160px]">
            <img
              src="/2.webp"
              alt="SLTMobitel"
              className="h-full w-auto object-contain drop-shadow-lg"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-4 py-6 space-y-2">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => getNavItemClass("dashboard", isActive)}
            onClick={() => setIsOpen(false)}
            title={isCollapsed ? "Dashboard" : ""}
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 4l4 2m-8-2l4-2"
              />
            </svg>
            <span className={`transition-all duration-300 ${isCollapsed ? "hidden" : ""}`}>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/complaints"
            className={({ isActive }) => getNavItemClass("complaints", isActive)}
            onClick={() => setIsOpen(false)}
            title={isCollapsed ? "Complaints" : ""}
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className={`transition-all duration-300 ${isCollapsed ? "hidden" : ""}`}>Complaints</span>
          </NavLink>
        </nav>

        {/* Divider */}
        <div className="mx-4 border-t border-cyan-300/35" />

        {/* User Info & Logout */}
        <div className="p-4 space-y-4">
           <div className="flex-1" />

           {adminUser?.email && (
            <div className={`px-4 py-3 bg-gradient-to-r from-blue-700 via-blue-500 to-green-400 text-white rounded-lg border-none transition-all duration-300 ${isCollapsed ? "px-2" : ""}`}>
              <p className={`text-xs text-cyan-700 mb-1 transition-all duration-300 ${isCollapsed ? "hidden" : ""}`}>Logged in as</p>
              <p className={`text-sm font-semibold text-cyan-700 truncate transition-all duration-300 ${isCollapsed ? "hidden" : ""}`}>
                {adminUser.email}
              </p>
              {isCollapsed && (
                <svg
                  className="w-5 h-5 text-cyan-700 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
            </div>
          )}

          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className={`w-full px-4 py-3 bg-gradient-to-r from-blue-700 via-blue-500 to-green-400 text-white text-sm font-semibold rounded-lg transition-all shadow-md flex items-center gap-2 border-none hover:bg-blue-600/80 ${isCollapsed ? "justify-center px-2" : ""}`}
            title={isCollapsed ? "Logout" : ""}
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
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
            <span className={`transition-all duration-300 ${isCollapsed ? "hidden" : ""}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Spacer for mobile to account for fixed header */}
      <div className="h-16 md:hidden" />
    </>
  );
};

export default AdminSidebar;
