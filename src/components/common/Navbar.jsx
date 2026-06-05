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
        <div className="h-28 md:h-32 flex items-center justify-between">
          
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center flex-shrink-0 bg-[#0156A6]"
          >
            <img
              src="/01SLT.jpg.jpeg"
              alt="SLTMobitel"
              className="h-20 sm:h-24 md:h-28 lg:h-32 w-auto object-contain bg-[#0156A6]"
            />
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-3">
            <NavLink to="/" end className={navItemClass}>
              Home
            </NavLink>

            <NavLink
              to="/report"
              className={navItemClass}
            >
              Report
            </NavLink>

            <NavLink
              to="/track-complaint"
              className={navItemClass}
            >
              Track Status
            </NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <FiX size={28} />
            ) : (
              <FiMenu size={28} />
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
              to="/report"
              className={navItemClass}
              onClick={() => setMenuOpen(false)}
            >
              Report
            </NavLink>

            <NavLink
              to="/track-complaint"
              className={navItemClass}
              onClick={() => setMenuOpen(false)}
            >
              Track Status
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;