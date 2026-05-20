import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiSearch,
} from "react-icons/fi";

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

  const navigate = useNavigate();

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
      } catch (err) {
        setError(err?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      bgColor: "bg-white",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-700",
    },

    {
      label: "Pending Review",
      value: stats?.pending || 0,
      icon: <FiClock size={20} />,
      bgColor: "bg-white",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-700",
    },

    {
      label: "Under Investigation",
      value: stats?.underInvestigation || 0,
      icon: <FiSearch size={20} />,
      bgColor: "bg-white",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-700",
    },

    {
      label: "Resolved",
      value: stats?.resolved || 0,
      icon: <FiCheckCircle size={20} />,
      bgColor: "bg-white",
      iconBg: "bg-green-100",
      iconColor: "text-green-700",
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      Submitted: "bg-cyan-100 text-cyan-700",
      "Preliminary Review": "bg-yellow-100 text-yellow-700",
      "Under Investigation": "bg-orange-100 text-orange-700",
      "Awaiting Evidence": "bg-purple-100 text-purple-700",
      "Escalated to CIABOC": "bg-red-100 text-red-700",
      Resolved: "bg-green-100 text-green-700",
      Closed: "bg-gray-100 text-gray-700",
    };

    return (
      styles[status] || "bg-gray-100 text-gray-700"
    );
  };

  // Handler for stat box click
  const handleStatClick = (status) => {
    if (!status) {
      navigate("/admin/complaints");
    } else {
      navigate(
        `/admin/complaints?status=${encodeURIComponent(status)}`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white shadow-lg shadow-slate-950/10 rounded-3xl p-6 border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Investigation Dashboard
            </h1>

            <p className="text-slate-500 mt-1">
              Monitor complaints and investigation activities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 shadow-sm min-w-[140px]">
              <p className="text-xs text-slate-500 font-medium">
                Escalated Cases
              </p>

              <p className="text-xl font-bold text-slate-900 mt-1">
                {stats?.escalated || 0}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 shadow-sm min-w-[170px]">
              <p className="text-xs text-slate-500 font-medium">
                Active Investigations
              </p>

              <p className="text-xl font-bold text-slate-900 mt-1">
                {stats?.underInvestigation || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {primaryStats.map((card, index) => {
          let statusFilter = "";

          if (card.label === "Pending Review") {
            statusFilter = "Preliminary Review";
          } else if (card.label === "Under Investigation") {
            statusFilter = "Under Investigation";
          } else if (card.label === "Resolved") {
            statusFilter = "Resolved";
          }

          return (
            <div
              key={index}
              className={`${card.bgColor} p-5 rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer`}
              onClick={() => handleStatClick(statusFilter)}
              tabIndex={0}
              role="button"
              aria-label={`Show ${card.label}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleStatClick(statusFilter);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">
                    {card.label}
                  </p>

                  <h3 className="text-3xl font-bold text-slate-900 mt-3">
                    {card.value}
                  </h3>
                </div>

                <div
                  className={`w-11 h-11 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center`}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Complaints */}
      <div className="bg-white rounded-3xl shadow-lg shadow-slate-950/10 overflow-hidden border border-slate-200">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Complaint Activity
            </h2>
          </div>

          <Link
            to="/admin/complaints"
            className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
          >
            View All
          </Link>
        </div>

        {recentComplaints.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    CRN
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Category
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Report Type
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Submitted
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {recentComplaints.map((complaint) => (
                  <tr
                    key={complaint._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/complaints/${complaint._id}`}
                        className="font-mono text-sm text-cyan-700 hover:text-cyan-800"
                      >
                        {complaint.crn}
                      </Link>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {complaint.category}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusBadge(
                          complaint.currentStatus
                        )}`}
                      >
                        {complaint.currentStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {complaint.isAnonymous ? (
                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-xs font-medium">
                          Anonymous
                        </span>
                      ) : (
                        <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-md text-xs font-medium">
                          Named
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(
                        complaint.createdAt
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center">
            <p className="text-slate-500 text-sm">
              No complaints available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;