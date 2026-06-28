import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell, FiClock, FiFileText, FiX } from "react-icons/fi";
import Logo from "../../assets/SLT Logo.png";
import { getRecentComplaints } from "../../services/adminDashboardService";

const AdminHeader = () => {
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [newComplaintCount, setNewComplaintCount] = useState(0);
  const [isBellAnimating, setIsBellAnimating] = useState(false);

  const notificationRef = useRef(null);
  const hasLoadedOnceRef = useRef(false);

  const currentUser = useMemo(() => {
    return JSON.parse(localStorage.getItem("adminUser") || "{}");
  }, []);

  const getComplaintKey = (complaint) => {
    return (
      complaint?.id ||
      complaint?.complaint_id ||
      complaint?.complaintId ||
      complaint?.crn ||
      complaint?.CRN ||
      ""
    );
  };

  const getStoredSeenKeys = () => {
    try {
      return JSON.parse(
        localStorage.getItem("adminSeenComplaintNotifications") || "[]"
      );
    } catch {
      return [];
    }
  };

  const saveSeenKeys = (keys) => {
    localStorage.setItem(
      "adminSeenComplaintNotifications",
      JSON.stringify(keys)
    );
  };

  const formatDateTime = (value) => {
    if (!value) return "Recently";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Recently";

    return date.toLocaleString("en-LK", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  const getRoleLabel = () => {
    switch (currentUser?.role) {
      case "admin":
        return "System Administrator";

      case "senior_investigator":
        return "Senior Investigator";

      case "officer":
        return "Investigation Officer";

      default:
        return "Admin";
    }
  };

  const fetchComplaintNotifications = async () => {
    try {
      const complaints = await getRecentComplaints(8);
      const complaintList = Array.isArray(complaints) ? complaints : [];

      setRecentComplaints(complaintList);

      const currentKeys = complaintList.map(getComplaintKey).filter(Boolean);
      const storedSeenKeys = getStoredSeenKeys();

      if (!hasLoadedOnceRef.current) {
        hasLoadedOnceRef.current = true;

        if (storedSeenKeys.length === 0) {
          saveSeenKeys(currentKeys);
          setNewComplaintCount(0);
          return;
        }
      }

      const unseenComplaints = complaintList.filter((complaint) => {
        const key = getComplaintKey(complaint);
        return key && !storedSeenKeys.includes(key);
      });

      if (unseenComplaints.length > newComplaintCount) {
        setIsBellAnimating(true);

        setTimeout(() => {
          setIsBellAnimating(false);
        }, 1400);
      }

      setNewComplaintCount(unseenComplaints.length);
    } catch (error) {
      console.error("Failed to fetch complaint notifications:", error);
    }
  };

  const handleNotificationClick = () => {
    const willOpen = !isNotificationOpen;

    setIsNotificationOpen(willOpen);

    if (willOpen) {
      const currentKeys = recentComplaints.map(getComplaintKey).filter(Boolean);

      saveSeenKeys(currentKeys);
      setNewComplaintCount(0);
      setIsBellAnimating(false);
    }
  };

  const handleComplaintClick = (complaint) => {
    const complaintId =
      complaint?.id || complaint?.complaint_id || complaint?.complaintId;

    setIsNotificationOpen(false);

    if (complaintId) {
      navigate(`/admin/complaints/${complaintId}`);
      return;
    }

    navigate("/admin/complaints");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchComplaintNotifications();

    const interval = setInterval(() => {
      fetchComplaintNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes adminBellRing {
            0% { transform: rotate(0deg); }
            10% { transform: rotate(14deg); }
            20% { transform: rotate(-12deg); }
            30% { transform: rotate(10deg); }
            40% { transform: rotate(-8deg); }
            50% { transform: rotate(6deg); }
            60% { transform: rotate(-4deg); }
            70% { transform: rotate(2deg); }
            100% { transform: rotate(0deg); }
          }

          @keyframes adminPulseRing {
            0% {
              transform: scale(0.9);
              opacity: 0.7;
            }
            70% {
              transform: scale(1.45);
              opacity: 0;
            }
            100% {
              transform: scale(1.45);
              opacity: 0;
            }
          }

          .admin-bell-ring {
            animation: adminBellRing 1.2s ease-in-out;
            transform-origin: top center;
          }

          .admin-pulse-ring {
            animation: adminPulseRing 1.4s ease-out infinite;
          }
        `}
      </style>

      <header
        className={`
          fixed
          top-0
          left-0
          right-0
          z-50
          hidden
          md:flex
          items-center
          justify-between
          overflow-visible
          group
          h-20
          xl:h-24
          px-4
          sm:px-6
          lg:px-8
          transition-all
          duration-300
          ease-out
          border-b
          border-white/10

          ${
            isScrolled
              ? "shadow-[0_18px_45px_rgba(0,26,114,0.35)]"
              : "shadow-md"
          }
        `}
        style={{
          background: isScrolled
            ? "linear-gradient(100deg, #00145C 0%, #003B88 57%, #005E5E 57%, #007A67 100%)"
            : "linear-gradient(100deg, #001A72 0%, #003B88 57%, #006B68 57%, #008064 100%)",
        }}
      >
        {/* Background layers */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="
              absolute
              top-0
              right-0
              h-full
              w-[42%]
              bg-gradient-to-r
              from-[#006B68]
              to-[#008064]
              transform
              skew-x-[-18deg]
              origin-top-right
              translate-x-8
            "
          />

          <div
            className={`
              absolute
              bottom-0
              left-0
              right-0
              transition-all
              duration-300

              ${
                isScrolled
                  ? "h-[4px] bg-gradient-to-r from-cyan-300 via-emerald-300 to-teal-200 opacity-95"
                  : "h-[2px] bg-gradient-to-r from-cyan-400/60 via-white/30 to-emerald-300/60 opacity-70"
              }
            `}
          />

          <div
            className="
              absolute
              top-0
              bottom-0
              -left-[35%]
              w-[28%]
              bg-white/15
              blur-sm
              skew-x-[-20deg]
              translate-x-[-120%]
              group-hover:translate-x-[520%]
              transition-transform
              duration-1000
              ease-out
            "
          />
        </div>

        {/* Left Section */}
        <div className="relative z-10 flex items-center gap-5">
          <div
            className="
              flex
              items-center
              justify-center
              w-20
              sm:w-24
              lg:w-28
              xl:w-32
              transition-all
              duration-300
            "
          >
            <img
              src={Logo}
              alt="SLTMobitel"
              className="w-full h-auto object-contain transition-all duration-300"
            />
          </div>

          <div className="ml-4 lg:ml-8 xl:ml-[60px]">
            <div className="flex items-center gap-3">
              <span
                className="
                  hidden
                  lg:inline-flex
                  w-2.5
                  h-2.5
                  rounded-full
                  bg-emerald-300
                  shadow-[0_0_14px_rgba(110,231,183,0.9)]
                "
              />

              <h1
                className="
                  text-xl
                  lg:text-2xl
                  xl:text-3xl
                  font-bold
                  text-white
                  tracking-tight
                "
              >
                {getDashboardTitle()}
              </h1>
            </div>

            <p
              className="
                hidden
                lg:block
                text-slate-200
                text-sm
                xl:text-base
                mt-1
              "
            >
              Monitor complaints and investigation activities
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative z-20 flex items-center gap-4">
          {/* Notification */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={handleNotificationClick}
              className={`
                relative
                w-12
                h-12
                rounded-full
                bg-white/95
                border
                border-white/60
                shadow-md
                flex
                items-center
                justify-center
                hover:bg-white
                hover:-translate-y-0.5
                hover:shadow-xl
                active:scale-95
                transition-all
                duration-300

                ${
                  newComplaintCount > 0
                    ? "ring-4 ring-red-400/20"
                    : ""
                }
              `}
              aria-label="Notifications"
            >
              {newComplaintCount > 0 && (
                <span className="admin-pulse-ring absolute inset-0 rounded-full bg-red-400/40" />
              )}

              <FiBell
                className={`
                  relative
                  z-10
                  text-[#005E5E]
                  text-lg

                  ${isBellAnimating ? "admin-bell-ring" : ""}
                `}
              />

              {newComplaintCount > 0 && (
                <span
                  className="
                    absolute
                    -top-1.5
                    -right-1.5
                    min-w-[22px]
                    h-[22px]
                    px-1
                    rounded-full
                    bg-red-500
                    text-white
                    text-[11px]
                    font-bold
                    flex
                    items-center
                    justify-center
                    border-2
                    border-white
                    shadow-lg
                  "
                >
                  {newComplaintCount > 9 ? "9+" : newComplaintCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-[64px]
                  w-[390px]
                  bg-white
                  rounded-3xl
                  shadow-[0_22px_70px_rgba(15,23,42,0.24)]
                  border
                  border-slate-200
                  overflow-hidden
                "
              >
                <div
                  className="
                    px-5
                    py-4
                    bg-slate-50
                    border-b
                    border-slate-200
                    flex
                    items-center
                    justify-between
                  "
                >
                  <div>
                    <h3 className="text-sm font-bold text-[#001A72]">
                      Complaint Notifications
                    </h3>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Latest submitted complaint records
                    </p>
                  </div>

                  <button
                    onClick={() => setIsNotificationOpen(false)}
                    className="
                      w-8
                      h-8
                      rounded-full
                      bg-white
                      border
                      border-slate-200
                      hover:bg-slate-100
                      flex
                      items-center
                      justify-center
                      transition-colors
                    "
                    aria-label="Close notifications"
                  >
                    <FiX className="text-slate-500 text-base" />
                  </button>
                </div>

                <div className="max-h-[380px] overflow-y-auto">
                  {recentComplaints.length > 0 ? (
                    recentComplaints.map((complaint, index) => {
                      const key = getComplaintKey(complaint) || index;

                      return (
                        <button
                          key={key}
                          onClick={() => handleComplaintClick(complaint)}
                          className="
                            w-full
                            text-left
                            px-5
                            py-4
                            border-b
                            border-slate-100
                            hover:bg-slate-50
                            transition-colors
                            group/item
                          "
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="
                                w-10
                                h-10
                                rounded-2xl
                                bg-blue-50
                                text-[#001A72]
                                flex
                                items-center
                                justify-center
                                group-hover/item:bg-[#001A72]
                                group-hover/item:text-white
                                transition-colors
                              "
                            >
                              <FiFileText className="text-lg" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-bold text-slate-900 truncate">
                                  {complaint?.crn ||
                                    complaint?.CRN ||
                                    "New Complaint"}
                                </p>

                                <span
                                  className="
                                    shrink-0
                                    rounded-full
                                    bg-emerald-50
                                    px-2.5
                                    py-1
                                    text-[11px]
                                    font-semibold
                                    text-emerald-700
                                  "
                                >
                                  {complaint?.current_status ||
                                    complaint?.status ||
                                    "Submitted"}
                                </span>
                              </div>

                              <p className="text-sm text-slate-600 mt-1 truncate">
                                {complaint?.category ||
                                  complaint?.complaint_category ||
                                  complaint?.report_type ||
                                  "Complaint record submitted"}
                              </p>

                              <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
                                <FiClock className="text-sm" />
                                <span>
                                  {formatDateTime(
                                    complaint?.submitted_at ||
                                      complaint?.created_at ||
                                      complaint?.createdAt ||
                                      complaint?.submission_date
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-5 py-10 text-center">
                      <div
                        className="
                          mx-auto
                          w-12
                          h-12
                          rounded-2xl
                          bg-slate-100
                          text-slate-400
                          flex
                          items-center
                          justify-center
                          mb-3
                        "
                      >
                        <FiBell className="text-xl" />
                      </div>

                      <p className="text-sm font-semibold text-slate-700">
                        No recent complaints
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        New complaint notifications will appear here.
                      </p>
                    </div>
                  )}
                </div>

                <div className="px-5 py-3 bg-slate-50">
                  <button
                    onClick={() => {
                      setIsNotificationOpen(false);
                      navigate("/admin/complaints");
                    }}
                    className="
                      w-full
                      h-11
                      rounded-2xl
                      bg-[#001A72]
                      text-white
                      text-sm
                      font-semibold
                      hover:bg-[#003B88]
                      transition-colors
                    "
                  >
                    View All Complaints
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div
            className="
              bg-white/95
              border
              border-white/70
              rounded-full
              px-3
              py-2
              flex
              items-center
              gap-3
              shadow-md
              cursor-pointer
              hover:bg-white
              hover:-translate-y-0.5
              hover:shadow-xl
              transition-all
              duration-300
            "
          >
            <div
              className="
                w-10
                h-10
                rounded-full
                bg-gradient-to-br
                from-[#001A72]
                to-[#008064]
                text-white
                flex
                items-center
                justify-center
                text-sm
                font-bold
                shadow-md
                ring-2
                ring-white/70
              "
            >
              {currentUser?.fullName?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div className="hidden md:block pr-2">
              <p className="text-sm font-semibold text-slate-900 leading-tight">
                {currentUser?.fullName || "Administrator"}
              </p>

              <p className="text-xs text-slate-500 leading-tight">
                {getRoleLabel()}
              </p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default AdminHeader;