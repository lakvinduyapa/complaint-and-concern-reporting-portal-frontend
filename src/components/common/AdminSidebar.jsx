import { useState, useMemo } from "react"; // Added useMemo
import { NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import Logo from "../../assets/SLT Logo.png";

import {
  FiHome,
  FiFileText,
  FiBarChart2,
  FiLogOut,
  FiSearch,
  FiActivity,
} from "react-icons/fi";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const [isOpen, setIsOpen] = useState(false);

  // Memoized user configuration parsing
  const currentUser = useMemo(() => {
    return JSON.parse(localStorage.getItem("adminUser") || "{}");
  }, []);

  const canManageInvestigations =
    currentUser.role === "admin" ||
    currentUser.role === "senior_investigator";

  const canViewAuditLogs =
    currentUser.role === "admin" ||
    currentUser.role === "senior_investigator";

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const getNavItemClass = (isActive) => {
    const baseClass =
"flex items-center gap-3 lg:gap-4 px-3 lg:px-4 py-3 text-sm lg:text-base font-semibold rounded-2xl transition-all duration-300";

    return isActive
      ? `${baseClass} bg-white text-[#062B7D] shadow-lg`
      : `${baseClass} text-white hover:bg-white/10`;
  };

  return (
    <>
      {/* Mobile Header */}
      <div
        className="fixed top-0 left-0 right-0 h-16 border-b border-cyan-400/30 shadow-lg z-50 md:hidden flex items-center justify-between px-4"
        style={{
          background: "linear-gradient(180deg, #001A72 0%, #005E5E 35%, #005E5E 70%, #001A72 100%)",
        }}
      >
        <div className="flex items-center">
          <img src={Logo} alt="SLTMobitel" className="w-36 h-auto object-contain" />
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Toggle Sidebar"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
  onMouseEnter={() => {
  const content = document.getElementById("admin-content");

  if (content) {
    content.style.marginLeft = "220px";
    content.style.width = "calc(100% - 220px)";
  }
}}
onMouseLeave={() => {
  const content = document.getElementById("admin-content");

  if (content) {
    content.style.marginLeft = "80px";
    content.style.width = "calc(100% - 80px)";
  }
}}
  className="
    fixed
    left-0
    top-24
    h-[calc(100vh-5rem)]
    xl:h-[calc(100vh-6rem)]
    w-[80px]
    hover:w-[220px]
    border-r
    border-white/10
    shadow-lg
    flex
    flex-col
    transition-all
    duration-300
    ease-out
    overflow-hidden
    group
    z-50
  "
  style={{
    background:
      'linear-gradient(180deg, #001A72 0%, #005E5E 35%, #005E5E 70%, #001A72 100%)',
  }}
>
        {/* Desktop Logo */}
        {/* <div className="hidden md:flex items-center justify-center h-20 border-b border-white/10">
         <img
  src={Logo}
  alt="SLTMobitel"
  className="
  w-12
  group-hover:w-40
  transition-all
  duration-300
"
/>
        </div> */}

        <div className="h-4" />

        {/* Navigation */}
        <nav
  className="
    px-2
    md:px-3
    py-5
    lg:py-6
    space-y-2
    lg:space-y-3
  "
>
          <NavLink to="/admin/dashboard" className={({ isActive }) =>
  `${getNavItemClass(isActive)} relative`
} onClick={() => setIsOpen(false)}>
            <FiHome className="w-5 h-5 min-w-[20px]" />
            <span
  className="
    opacity-0
    group-hover:opacity-100
    transition-opacity
    duration-200
    whitespace-normal
    leading-5
  "
>
  Dashboard
</span>
          </NavLink>

          {canManageInvestigations && (
            <NavLink to="/admin/investigations" className={({ isActive }) =>
    `${getNavItemClass(isActive)} relative`} onClick={() => setIsOpen(false)}>
              <FiSearch className="w-5 h-5 min-w-[20px]" />
              <span  className="
    opacity-0
    group-hover:opacity-100
    transition-all
    duration-200
    leading-5
  ">
    Investigation<br />Management</span>
            </NavLink>
          )}

          <NavLink to="/admin/complaints" className={({ isActive }) =>
    `${getNavItemClass(isActive)} relative`} onClick={() => setIsOpen(false)}>
            <FiFileText className="w-5 h-5 min-w-[20px]" />
            <span  className="
    opacity-0
    group-hover:opacity-100
    transition-all
    duration-200
    leading-5
  ">
    Complaint<br /> Management</span>
          </NavLink>

          <NavLink to="/admin/reports" className={({ isActive }) =>
    `${getNavItemClass(isActive)} relative`} onClick={() => setIsOpen(false)}>
            <FiBarChart2 className="w-5 h-5 min-w-[20px]"/>
            <span  className="
    opacity-0
    group-hover:opacity-100
    transition-all
    duration-200
    leading-5
  ">
    Reports</span>
          </NavLink>

          {canViewAuditLogs && (
            <NavLink to="/admin/audit-logs" className={({ isActive }) =>
    `${getNavItemClass(isActive)} relative`} onClick={() => setIsOpen(false)}>
              <FiActivity className="w-5 h-5 min-w-[20px]" />
              <span className="
    opacity-0
    group-hover:opacity-100
    transition-all
    duration-200
    leading-5
  ">
    Audit Logs</span>
            </NavLink>
          )}
        </nav>

        <div className="flex-1" />
        <div className="mx-4 border-t border-cyan-300/35" />

        {/* Logout */}
        <div className="p-3">
<button
  onClick={() => {
    handleLogout();
    setIsOpen(false);
  }}
  className="
    flex
    items-center
    gap-3
    lg:gap-4
    px-3
    lg:px-4
    py-3
    text-base
    font-semibold
    rounded-2xl
    text-white
    hover:bg-white/10
    transition-all
    duration-300
    w-full
  "
>
  <FiLogOut className="w-5 h-5 min-w-[20px]" />

  <span
    className="
      opacity-0
      group-hover:opacity-100
      transition-opacity
      duration-200
      whitespace-nowrap
    "
  >
    Logout
  </span>
</button>
        </div>
      </aside>

      <div className="h-16 md:hidden" />
    </>
  );
};

export default AdminSidebar;