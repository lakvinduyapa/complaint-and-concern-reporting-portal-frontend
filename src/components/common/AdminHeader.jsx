import { FiBell, FiMenu } from "react-icons/fi";

const AdminHeader = ({
  sidebarCollapsed,
  setSidebarCollapsed,
}) => {
  const currentUser = JSON.parse(
    localStorage.getItem("adminUser") || "{}"
  );

const getDashboardTitle = () => {
  switch (currentUser?.role) {
    case "admin":
      return "Admin Dashboard";

    case "senior_investigator":
      return "Senior Investigator Dashboard";

    case "officer":
      return "Investigation Officer Dashboard";

    default:
      return "Dashboard";
  }
};

  return (
  <header
    className="
      h-24
      mt-4
      mx-4
      px-8
      flex
      items-center
      justify-between
      rounded-2xl
      shadow-lg
    "
   style={{
  background:
    "linear-gradient(90deg, #001A72 0%, #005E5E 75%, #005E5E 100%)",
}}
  >
      {/* Left */}
<div className="flex items-center gap-4">

  <button
    onClick={() =>
      setSidebarCollapsed(!sidebarCollapsed)
    }
    className="
      w-10
      h-10
      rounded-xl
      bg-white/10
      border
      border-white/20
      text-white
      flex
      items-center
      justify-center
      hover:bg-white/20
      hover:scale-105
      transition-all
    "
  >
    <FiMenu />
  </button>

  <div>
    <h1 className="text-3xl font-bold text-white">
      {getDashboardTitle()}
    </h1>

    <p className="text-slate-200 mt-1">
      Monitor complaints and investigation activities
    </p>
  </div>

</div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Notification */}
        <button className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors">
          <FiBell className="text-slate-600 text-lg" />
        </button>

        {/* Profile */}
        <div className="bg-white border border-slate-200 rounded-full px-3 py-2 flex items-center gap-3 shadow-sm cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center text-sm font-bold">
            {currentUser?.fullName?.charAt(0) || "A"}
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-900">
              {currentUser?.fullName || "Administrator"}
            </p>

            <p className="text-xs text-slate-500">
              {currentUser?.role || "Admin"}
            </p>
          </div>

        </div>
      </div>
    </header>
  );
};

export default AdminHeader;