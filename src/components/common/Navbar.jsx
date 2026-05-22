import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItemClass = ({ isActive }) =>
    `px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
      isActive
        ? "bg-green-600 text-white"
        : "text-white hover:bg-white/10"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full shadow-lg bg-[#0156A6]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Main Navbar */}
        <div className="h-32 md:h-36 flex items-center justify-between">
          
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center flex-shrink-0 bg-[#0156A6]"
          >
            <img
              src="/01SLT.jpg.jpeg"
              alt="SLTMobitel"
              className="h-24 sm:h-28 md:h-32 lg:h-36 w-auto object-contain bg-[#0156A6]"
            />
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-3">
            <NavLink to="/" end className={navItemClass}>
              Home
            </NavLink>

            <NavLink
              to="/track-complaint"
              className={navItemClass}
            >
              Track Status
            </NavLink>

            <NavLink
              to="/admin/login"
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-semibold rounded-lg border transition-all duration-300 ${
                  isActive
                    ? "bg-green-600 text-white border-green-500"
                    : "text-white border-white/20 hover:bg-white/10"
                }`
              }
            >
              Admin Portal
            </NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <FiX size={30} />
            ) : (
              <FiMenu size={30} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-64 pb-4" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-2">
            <NavLink
              to="/"
              end
              className={navItemClass}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/track-complaint"
              className={navItemClass}
              onClick={() => setMenuOpen(false)}
            >
              Track Status
            </NavLink>

            <NavLink
              to="/admin/login"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-semibold rounded-lg border transition-all duration-300 ${
                  isActive
                    ? "bg-green-600 text-white border-green-500"
                    : "text-white border-white/20 hover:bg-white/10"
                }`
              }
            >
              Admin Portal
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;