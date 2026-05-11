import { FaShieldAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";


const Navbar = () => {

  return (

    <header className="bg-white shadow-sm border-b border-gray-200">

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">

        {/* Left Side */}
        <div className="flex items-center gap-3">

          <div className="bg-blue-600 text-white p-2 rounded-lg">

            <FaShieldAlt className="text-xl" />

          </div>

          <div>

            <h1 className="text-lg md:text-xl font-bold text-gray-800">

              SLTMobitel IAU

            </h1>

            <p className="text-sm text-gray-500">

              Secure Reporting Portal

            </p>

          </div>

        </div>



        {/* Middle Navigation */}
        <div className="hidden md:flex items-center gap-3 ml-auto">

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-semibold rounded-lg transition-colors border ${
                isActive
                  ? 'text-blue-600 border-blue-200 bg-blue-50'
                  : 'text-gray-600 border-gray-200 hover:bg-gray-100'
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/track-complaint"
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-semibold rounded-lg transition-colors border ${
                isActive
                  ? 'text-blue-600 border-blue-200 bg-blue-50'
                  : 'text-gray-600 border-gray-200 hover:bg-gray-100'
              }`
            }
          >
            Track Status
          </NavLink>

        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          <NavLink
            to="/admin/login"
            className={({ isActive }) =>
              `ml-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors border ${
                isActive
                  ? 'text-blue-600 border-blue-200 bg-blue-50'
                  : 'text-gray-600 border-gray-200 hover:bg-gray-100'
              }`
            }
          >
            Admin Portal
          </NavLink>

        </div>

      </div>

    </header>

  );

};

export default Navbar;