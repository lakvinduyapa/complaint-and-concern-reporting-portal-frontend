import { FiBell, FiSearch, FiChevronDown } from "react-icons/fi";

const AdminHeader = () => {
  const currentUser = JSON.parse(
    localStorage.getItem("adminUser") || "{}"
  );

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
        "linear-gradient(90deg, #001A72 35%, #005E5E 100%)",
    }}
  >
      {/* Left */}
      <div>
       <h1 className="text-3xl font-bold text-white">
          Admin Dashboard
        </h1>

        <p className="text-slate-200 mt-1">
          Monitor complaints and investigation activities
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden lg:flex items-center bg-white rounded-full px-4 h-12 w-[380px] shadow-sm border border-slate-200">
          <FiSearch className="text-slate-400" />

          <input
            type="text"
            placeholder="Search complaints, investigators, IDs..."
            className="flex-1 ml-3 outline-none text-sm bg-transparent"
          />
        </div>

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

          <FiChevronDown className="text-slate-500" />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;