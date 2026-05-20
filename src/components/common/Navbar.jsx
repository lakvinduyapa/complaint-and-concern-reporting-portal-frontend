import { NavLink } from "react-router-dom";


const Navbar = () => {

  const navItemClass = ({ isActive }) =>
    `px-4 py-2 text-sm font-semibold rounded-lg transition-colors border ${
      isActive
        ? "text-green-300 border-green-400/60 bg-gradient-to-r from-green-500/30 to-green-600/30"
        : "text-cyan-100 border-transparent hover:bg-green-500/10 hover:border-green-400/30"
    }`;

  return (

    <header
      className="sticky top-0 z-30 text-white border-b border-cyan-500/20 shadow-[0_12px_30px_rgba(0,229,255,0.15)]"
      style={{
        background:
          'linear-gradient(90deg, #1761a0 0%, #2697b7 50%, #2ecc71 100%)',
      }}
    >

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">

        {/* Left Side */}
        <div className="flex items-center">
          <div className="h-14 md:h-20 w-auto max-w-[220px]">
            <img
              src="/2.webp"
              alt="SLTMobitel"
              className="h-full w-auto object-contain drop-shadow-lg"
              style={{ display: 'block' }}
            />
          </div>
        </div>



        {/* Middle Navigation */}
        <div className="hidden md:flex items-center gap-2 ml-auto">

          <NavLink
            to="/"
            end
            className={navItemClass}
          >
            Home
          </NavLink>

          <NavLink
            to="/track-complaint"
            className={navItemClass}
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
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400"
                  : "text-cyan-100 border-cyan-500/40 hover:bg-gradient-to-r hover:from-green-500/20 hover:to-green-600/20 hover:text-green-300"
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