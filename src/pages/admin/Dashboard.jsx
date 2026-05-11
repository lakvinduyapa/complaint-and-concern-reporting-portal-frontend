import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiSearch,
  FiShield,
} from "react-icons/fi";

import {
  getDashboardStats,
  getRecentComplaints
} from "../../services/adminDashboardService";

import LoadingSpinner from "../../components/common/LoadingSpinner";


const Dashboard = () => {

  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    const fetchData = async () => {

      try {

        setLoading(true);

        const [statsData, complaintsData] = await Promise.all([
          getDashboardStats(),
          getRecentComplaints(5)
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
      border: "border-blue-500"
    },

    {
      label: "Pending Review",
      value: stats?.pending || 0,
      icon: <FiClock size={20} />,
      border: "border-amber-500"
    },

    {
      label: "Under Investigation",
      value: stats?.underInvestigation || 0,
      icon: <FiSearch size={20} />,
      border: "border-orange-500"
    },

    {
      label: "Resolved",
      value: stats?.resolved || 0,
      icon: <FiCheckCircle size={20} />,
      border: "border-green-500"
    }

  ];


  const getStatusBadge = (status) => {

    const styles = {

      "Submitted":
        "bg-slate-100 text-slate-700 border border-slate-200",

      "Preliminary Review":
        "bg-blue-100 text-blue-700 border border-blue-200",

      "Under Investigation":
        "bg-amber-100 text-amber-700 border border-amber-200",

      "Awaiting Evidence":
        "bg-purple-100 text-purple-700 border border-purple-200",

      "Escalated to CIABOC":
        "bg-red-100 text-red-700 border border-red-200",

      "Resolved":
        "bg-green-100 text-green-700 border border-green-200",

      "Closed":
        "bg-gray-100 text-gray-700 border border-gray-200"

    };

    return styles[status] ||
      "bg-gray-100 text-gray-700 border border-gray-200";

  };


  return (

    <div className="space-y-6">

      {/* Top Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">

                <FiShield size={22} />

              </div>

              <div>

                <h1 className="text-2xl font-bold text-gray-900">

                  Investigation Dashboard

                </h1>

                <p className="text-sm text-gray-500 mt-1">

                  Internal Affairs Unit Governance Portal

                </p>

              </div>

            </div>

          </div>


          <div className="flex items-center gap-3">

            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">

              <p className="text-xs text-red-600 font-medium">

                Escalated Cases

              </p>

              <p className="text-xl font-bold text-red-700">

                {stats?.escalated || 0}

              </p>

            </div>


            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">

              <p className="text-xs text-gray-500 font-medium">

                Active Investigations

              </p>

              <p className="text-xl font-bold text-gray-900">

                {stats?.underInvestigation || 0}

              </p>

            </div>

          </div>

        </div>

      </div>


      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        {primaryStats.map((card, index) => (

          <div
            key={index}
            className={`bg-white border-l-4 ${card.border} border border-gray-200 rounded-lg p-5`}
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500 font-medium">

                  {card.label}

                </p>

                <h3 className="text-3xl font-bold text-gray-900 mt-3">

                  {card.value}

                </h3>

              </div>


              <div className="w-11 h-11 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center">

                {card.icon}

              </div>

            </div>

          </div>

        ))}

      </div>


      {/* Recent Complaints */}
      <div className="bg-white border border-gray-200 rounded-lg">

        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">

          <div>

            <h2 className="text-lg font-semibold text-gray-900">

              Recent Complaint Activity

            </h2>

            <p className="text-sm text-gray-500 mt-1">

              Latest submissions and investigation updates

            </p>

          </div>


          <Link
            to="/admin/complaints"
            className="text-sm font-medium text-blue-700 hover:text-blue-800"
          >

            View All

          </Link>

        </div>


        {recentComplaints.length > 0 ? (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">

                    CRN

                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">

                    Category

                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">

                    Status

                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">

                    Report Type

                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">

                    Submitted

                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-100">

                {recentComplaints.map((complaint) => (

                  <tr
                    key={complaint._id}
                    className="hover:bg-gray-50 transition-all"
                  >

                    <td className="px-6 py-4">

                      <Link
                        to={`/admin/complaints/${complaint._id}`}
                        className="font-mono text-sm text-blue-700 hover:underline"
                      >

                        {complaint.crn}

                      </Link>

                    </td>


                    <td className="px-6 py-4 text-sm text-gray-700">

                      {complaint.category}

                    </td>


                    <td className="px-6 py-4">

                      <span className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusBadge(complaint.currentStatus)}`}>

                        {complaint.currentStatus}

                      </span>

                    </td>


                    <td className="px-6 py-4">

                      {complaint.isAnonymous ? (

                        <span className="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 rounded-md text-xs font-medium">

                          Anonymous

                        </span>

                      ) : (

                        <span className="bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1 rounded-md text-xs font-medium">

                          Named

                        </span>

                      )}

                    </td>


                    <td className="px-6 py-4 text-sm text-gray-500">

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

            <p className="text-gray-500 text-sm">

              No complaints available.

            </p>

          </div>

        )}

      </div>

    </div>

  );

};

export default Dashboard;