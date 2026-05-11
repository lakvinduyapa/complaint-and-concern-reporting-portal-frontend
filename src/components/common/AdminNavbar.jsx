import { NavLink, useNavigate } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import { useAdminAuth } from "../../hooks/useAdminAuth";


const AdminNavbar = () => {
  const navigate = useNavigate();
  const { adminUser, logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">

        {/* Left Side - Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <FaShieldAlt className="text-xl" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-800">
              IAU Admin Portal
            </h1>
            <p className="text-sm text-gray-500">
              Internal Affairs Unit
            </p>
          </div>
        </div>

        {/* Right Side - Navigation, User Info and Logout */}
        <div className="ml-auto flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-3">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-semibold rounded-lg transition-colors border ${
                  isActive
                    ? 'text-blue-600 border-blue-200 bg-blue-50'
                    : 'text-gray-600 border-gray-200 hover:bg-gray-100'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/complaints"
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-semibold rounded-lg transition-colors border ${
                  isActive
                    ? 'text-blue-600 border-blue-200 bg-blue-50'
                    : 'text-gray-600 border-gray-200 hover:bg-gray-100'
                }`
              }
            >
              Complaints
            </NavLink>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

      </div>
    </header>
  );
};

export default AdminNavbar;
