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
    icon: <FiFileText size={24} />,
    bgColor: "bg-[#F8FBFF]",
    gradient: "linear-gradient(135deg, #0A3D91 0%, #1456C4 100%)",
    circleBg: "bg-blue-100",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
  },
  {
    label: "Pending Review",
    value: stats?.pending || 0,
    icon: <FiClock size={24} />,
    bgColor: "bg-[#FFFBF2]",
    gradient: "linear-gradient(135deg, #B45309 0%, #F59E0B 100%)",
    circleBg: "bg-orange-100",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-700",
  },
  {
    label: "Under Investigation",
    value: stats?.underInvestigation || 0,
    icon: <FiSearch size={24} />,
    bgColor: "bg-[#F8FFFB]",
    gradient: "linear-gradient(135deg, #1456C4 0%, #46C36F 100%)",
    circleBg: "bg-cyan-100",
    iconBg: "bg-cyan-100",
    iconColor: "text-blue-700",
  },
  {
    label: "Resolved",
    value: stats?.resolved || 0,
    icon: <FiCheckCircle size={24} />,
    bgColor: "bg-[#F6FFF9]",
    gradient: "linear-gradient(135deg, #00B86B 0%, #46C36F 100%)",
    circleBg: "bg-green-100",
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

      {/* Primary Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
        {primaryStats.map((card, index) => {
          let statusFilter = "";
          if (card.label === "Pending Review") statusFilter = "Preliminary Review";
          else if (card.label === "Under Investigation") statusFilter = "Under Investigation";
          else if (card.label === "Resolved") statusFilter = "Resolved";
          return (
            <div
  key={index}
  className={`${card.bgColor}
  relative
  overflow-hidden
  h-[180px]
  p-6
  rounded-3xl
  border
  border-slate-200
  shadow-lg
  hover:shadow-xl
  transition-all
  duration-200
  hover:-translate-y-1
  cursor-pointer`}
>

  <div
  className="absolute -top-10 -right-10 w-36 h-36 rounded-full opacity-10"
  style={{
    background: card.gradient,
  }}
/>
             <div className="h-full flex flex-col justify-between">
  <div className="flex justify-between items-start">
    <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
      {card.label}
    </p>

    <div
  className="w-14 h-14 rounded-2xl flex items-center justify-center"
  style={{
    background: card.gradient,
    color: "#fff",
  }}
>
      {card.icon}
    </div>
  </div>

  <div className="mt-4">
    <h3 className="text-5xl font-extrabold text-slate-900">
      {card.value}
    </h3>

    <p className="text-sm text-slate-500 mt-2">
      Dashboard statistic
    </p>
  </div>
</div>
            </div>
          );
        })}
      </div>

      {/* Additional Statistics: Anonymous & Named Complaints */}
      <div>
        <div className="mb-6">
  <h2 className="text-2xl font-bold text-slate-900">
    Analytics Overview
  </h2>

  <p className="text-slate-500 mt-1">
    Complaint trends and distribution
  </p>
</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 text-2xl">
        👤
      </div>

      <div>
        <p className="text-slate-500 text-sm">
          Anonymous Complaints
        </p>

        <h3 className="text-4xl font-bold text-slate-900">
          {anonymousCount}
        </h3>

        <p className="text-sm text-slate-500">
          {allComplaints.length > 0
            ? Math.round(
                (anonymousCount / allComplaints.length) * 100
              )
            : 0}
          % of complaints
        </p>
      </div>
    </div>
  </div>

  <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-700 text-2xl">
        📝
      </div>

      <div>
        <p className="text-slate-500 text-sm">
          Named Complaints
        </p>

        <h3 className="text-4xl font-bold text-slate-900">
          {namedCount}
        </h3>

        <p className="text-sm text-slate-500">
          {allComplaints.length > 0
            ? Math.round(
                (namedCount / allComplaints.length) * 100
              )
            : 0}
          % of complaints
        </p>
      </div>
    </div>
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
      <h2 className="text-xl font-bold text-slate-900">
        Complaint Status Distribution
      </h2>

      <p className="text-sm text-slate-500 mt-1">
        Current workload by complaint status
      </p>
    </div>

    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
      Overview
    </span>
  </div>

  <ResponsiveContainer
    width="100%"
    height={isMobile ? 320 : 350}
  >
    <PieChart>
      <Pie
        data={chartStatusData}
        cx="50%"
        cy="50%"
        innerRadius={80}
        outerRadius={130}
        paddingAngle={3}
        dataKey="value"
      >
        {chartStatusData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={statusColors[index % statusColors.length]}
          />
        ))}
      </Pie>

      <Tooltip />
      <Legend />
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
                <defs>
  <linearGradient
    id="categoryGradient"
    x1="0"
    y1="0"
    x2="0"
    y2="1"
  >
    <stop
      offset="0%"
      stopColor="#1456C4"
    />
    <stop
      offset="100%"
      stopColor="#005E5E"
    />
  </linearGradient>
</defs>

<Bar
  dataKey="value"
  fill="url(#categoryGradient)"
  radius={[12, 12, 0, 0]}
/>
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