import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiSearch,
} from "react-icons/fi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  getDashboardStats,
  getRecentComplaints,
} from "../../services/adminDashboardService";

import LoadingSpinner from "../../components/common/LoadingSpinner";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );

  // Additional data for charts and extra stats
  const [allComplaints, setAllComplaints] = useState([]);
  const [chartsLoading, setChartsLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch all complaints for charts and anonymous/named counts
  const fetchAllComplaints = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      // Use a wide date range to get all complaints
      const startDate = "2000-01-01";
      const endDate = new Date().toISOString().split("T")[0];
      const url = `${import.meta.env.VITE_API_URL}/admin/reports?startDate=${startDate}&endDate=${endDate}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setAllComplaints(data.complaints || []);
      }
    } catch (error) {
      console.error("Failed to fetch complaints for charts:", error);
    } finally {
      setChartsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, complaintsData] = await Promise.all([
          getDashboardStats(),
          getRecentComplaints(5),
        ]);
        setStats(statsData);
        setRecentComplaints(complaintsData);
        // Fetch all complaints for charts
        await fetchAllComplaints();
      } catch (err) {
        setError(err?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 text-sm font-medium">{error}</p>
      </div>
    );
  }

  const primaryStats = [
    {
      label: "Total Complaints",
      value: stats?.totalComplaints || 0,
      icon: <FiFileText size={20} />,
      bgColor: "bg-gradient-to-r from-blue-50 to-cyan-50",
      iconBg: "bg-blue-200",
      iconColor: "text-slate-700",
    },
    {
      label: "Pending Review",
      value: stats?.pending || 0,
      icon: <FiClock size={20} />,
      bgColor: "bg-gradient-to-r from-yellow-50 to-amber-50",
      iconBg: "bg-yellow-200",
      iconColor: "text-yellow-700",
    },
    {
      label: "Under Investigation",
      value: stats?.underInvestigation || 0,
      icon: <FiSearch size={20} />,
      bgColor: "bg-gradient-to-r from-orange-50 to-red-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-700",
    },
    {
      label: "Resolved",
      value: stats?.resolved || 0,
      icon: <FiCheckCircle size={20} />,
      bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-700",
    },
  ];

  // Compute data for charts from allComplaints
  const getStatusDistribution = () => {
    const statusCounts = {
      Submitted: 0,
      "Preliminary Review": 0,
      "Under Investigation": 0,
      "Awaiting Evidence": 0,
      "Escalated to CIABOC": 0,
      Resolved: 0,
      Closed: 0,
    };
    allComplaints.forEach((c) => {
      const status = c.current_status;
      if (statusCounts.hasOwnProperty(status)) statusCounts[status]++;
      else statusCounts[status] = 1;
    });
    return Object.entries(statusCounts)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  };

  const getCategoryDistribution = () => {
    const catCounts = {};
    allComplaints.forEach((c) => {
      const cat = c.category || "Unspecified";
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    });
    return Object.entries(catCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const anonymousCount = allComplaints.filter((c) => c.is_anonymous).length;
  const namedCount = allComplaints.filter((c) => !c.is_anonymous).length;

  const chartStatusData = getStatusDistribution();
  const chartCategoryData = getCategoryDistribution();

  const statusColors = ["#2563EB", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6", "#06B6D4", "#6B7280"];

  const handleStatClick = (status) => {
    if (!status) {
      navigate("/admin/complaints");
    } else {
      navigate(`/admin/complaints?status=${encodeURIComponent(status)}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white shadow-lg shadow-slate-950/10 rounded-3xl p-6 border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              Investigation Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Monitor complaints and investigation activities.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {primaryStats.map((card, index) => {
          let statusFilter = "";
          if (card.label === "Pending Review") statusFilter = "Preliminary Review";
          else if (card.label === "Under Investigation") statusFilter = "Under Investigation";
          else if (card.label === "Resolved") statusFilter = "Resolved";
          return (
            <div
              key={index}
              className={`${card.bgColor} p-5 rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer`}
              onClick={() => handleStatClick(statusFilter)}
              tabIndex={0}
              role="button"
              aria-label={`Show ${card.label}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleStatClick(statusFilter);
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">{card.label}</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-3">{card.value}</h3>
                </div>
                <div className={`w-11 h-11 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center`}>
                  {card.icon}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Statistics: Anonymous & Named Complaints */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-5">Additional Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-[#F5F3FF] border border-[#DDD6FE] rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-600 font-medium">Anonymous Complaints</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">{anonymousCount}</h3>
          </div>
          <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-600 font-medium">Named Complaints</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">{namedCount}</h3>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {!chartsLoading && allComplaints.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Pie Chart: Status Distribution */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Complaint Status Distribution</h2>
                <p className="text-sm text-slate-500 mt-1">Current workload by complaint status.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">Overview</span>
            </div>
            <ResponsiveContainer width="100%" height={isMobile ? 420 : 350}>
              <PieChart>
                <Pie data={chartStatusData} dataKey="value" nameKey="name" outerRadius={isMobile ? 70 : 120} label={!isMobile}>
                  {chartStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                {!isMobile && <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "14px", paddingTop: "10px" }} />}
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart: Category Comparison */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Complaint Type Comparison</h2>
                <p className="text-sm text-slate-500 mt-1">Compare the number of complaints by category.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">Bar Chart</span>
            </div>
            <ResponsiveContainer width="100%" height={isMobile ? 340 : 350}>
              <BarChart data={chartCategoryData} margin={{ top: 10, right: 10, left: -18, bottom: 42 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#475569" }} interval={0} angle={-18} textAnchor="end" height={70} />
                <YAxis tick={{ fontSize: 12, fill: "#475569" }} allowDecimals={false} />
                <Tooltip cursor={{ fill: "rgba(37, 99, 235, 0.08)" }} contentStyle={{ borderRadius: "12px", borderColor: "#CBD5E1", boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)" }} />
                <Legend />
                <Bar dataKey="value" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      {chartsLoading && (
        <div className="text-center py-10">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default Dashboard;