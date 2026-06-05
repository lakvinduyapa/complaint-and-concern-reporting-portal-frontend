import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const PublicLayout = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <div className={`app-shell min-h-screen ${isLandingPage ? "bg-[#0156A6]" : ""}`}>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className={`${isLandingPage ? "px-0 py-0" : "flex items-center justify-center px-4 py-10 md:py-12"}`}>
        <div className={`w-full ${isLandingPage ? "max-w-none" : "max-w-screen-xl"}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PublicLayout;