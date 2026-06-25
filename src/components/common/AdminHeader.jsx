import { useMemo } from "react"; // Added useMemo
import { FiBell, FiMenu } from "react-icons/fi";
import Logo from "../../assets/SLT Logo.png";

const AdminHeader = () => {
  // Memoized JSON.parse to prevent localstorage parsing on every render frame
  const currentUser = useMemo(() => {
    return JSON.parse(localStorage.getItem("adminUser") || "{}");
  }, []);

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
fixed
top-0
left-0
right-0
z-50
h-20
xl:h-24
px-4
sm:px-6
lg:px-8
hidden
md:flex
items-center
justify-between
shadow-md
transition-shadow
hover:shadow-2xl
duration-300
"
      style={{
        background: "linear-gradient(90deg, #001A72 0%, #005E5E 75%, #005E5E 100%)",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-5">
  <img
    src={Logo}
    alt="SLTMobitel"
    className="w-20 sm:w-24 lg:w-28 xl:w-32 h-auto object-contain"
  />

 <div className="ml-4 lg:ml-8 xl:ml-[60px]">
  <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-white">
    {getDashboardTitle()}
  </h1>

  <p className="hidden lg:block text-slate-200 mt-1 text-sm xl:text-base">
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