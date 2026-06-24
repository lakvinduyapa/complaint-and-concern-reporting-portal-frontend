import { useEffect, useState } from "react";
import {
  getAssignableOfficers,
  getUnassignedComplaints,
  assignComplaintToOfficer,
} from "../../services/adminComplaintService";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import {
  FiShield,
  FiFileText,
  FiClock,
  FiFilter,
  FiUsers,
} from "react-icons/fi";

const InvestigationManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [selectedOfficers, setSelectedOfficers] = useState({});
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [complaintResult, officerResult] = await Promise.all([
        getUnassignedComplaints(),
        getAssignableOfficers(),
      ]);

      setComplaints(complaintResult || []);
      setOfficers(officerResult || []);
    } catch (err) {
      setError(err?.message || "Failed to load investigation data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOfficerChange = (complaintId, officerId) => {
    setSelectedOfficers((prev) => ({
      ...prev,
      [complaintId]: officerId,
    }));
  };

  const handleAssign = async (complaintId) => {
    const selectedOfficer = selectedOfficers[complaintId];

    if (!selectedOfficer) {
      setError("Please select an officer before assigning.");
      return;
    }

    try {
      setAssigningId(complaintId);
      setError("");
      setSuccessMessage("");

      await assignComplaintToOfficer(complaintId, selectedOfficer);

      setSuccessMessage("Complaint assigned successfully.");
      await fetchData();
    } catch (err) {
      setError(err?.message || "Failed to assign complaint.");
    } finally {
      setAssigningId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="complaints-hero animate-fade-up">
  <div className="complaints-hero-content">
    <div>
      <div className="complaints-eyebrow">
        <FiShield />
        Internal Affairs Unit
      </div>

      <h1>Investigation Management</h1>

      <p>
        Review unassigned complaints and assign them to investigators from a
        centralized investigation workspace.
      </p>
    </div>

    <div className="complaints-hero-card">
      <span>Pending Cases</span>
      <strong>{complaints.length}</strong>
      <small>Awaiting Assignment</small>
    </div>
  </div>
</section>

{/* Overview Cards */}
<section
  className="complaints-kpi-grid animate-fade-up"
  style={{ animationDelay: "0.1s" }}
>
  <div className="complaints-kpi-card">
    <div className="complaints-kpi-icon blue">
      <FiFileText />
    </div>
    <div>
      <p>Unassigned Cases</p>
      <h3>{complaints.length}</h3>
    </div>
  </div>

  <div className="complaints-kpi-card">
    <div className="complaints-kpi-icon green">
      <FiShield />
    </div>
    <div>
      <p>Available Officers</p>
      <h3>{officers.length}</h3>
    </div>
  </div>

  <div className="complaints-kpi-card">
    <div className="complaints-kpi-icon amber">
      <FiClock />
    </div>
    <div>
      <p>Pending Assignment</p>
      <h3>{complaints.length}</h3>
    </div>
  </div>

  <div className="complaints-kpi-card">
  <div className="complaints-kpi-icon purple">
    <FiUsers />
  </div>

  <div>
    <p>Assigned Cases</p>
    <h3>--</h3>
  </div>
</div>
</section>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl">
          {successMessage}
        </div>
      )}

      <section
  className="complaints-filter-card animate-fade-up"
  style={{ animationDelay: "0.2s" }}
>
  <div className="complaints-section-heading">
    <div>
      <h2>Investigation Assignment Queue</h2>
      <p>
        Assign pending complaints to available investigation officers.
      </p>
    </div>

    <FiFilter className="complaints-section-icon" />
  </div>
</section>

      <section
  className="complaints-table-card animate-fade-up"
  style={{ animationDelay: "0.3s" }}
>
        <div className="complaints-table-header">
          <p className="text-sm font-medium text-slate-700">
            Unassigned Complaints
          </p>

          <p className="text-sm text-slate-500">
            {complaints.length} complaint{complaints.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="complaints-table-wrapper">
          <table className="complaints-table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">CRN</th>
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Reporter</th>
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Submitted</th>
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Assign To</th>
                <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Action</th>
              </tr>
            </thead>

            <tbody>
              {complaints.length > 0 ? (
                complaints.map((item) => (
                  <tr
  key={item.id}
  className="
border-b
border-slate-100
hover:bg-blue-50/40
hover:shadow-sm
transition-all
duration-200
"
>
                    <td className="px-4 py-4">
  <span className="font-mono font-semibold text-[#1456C4]">
    {item.crn}
  </span>
</td>

                    <td className="px-4 py-5">{item.category}</td>

                    <td className="px-4 py-5">
  <span
    className={`
      px-3 py-1 rounded-full text-xs font-semibold
      ${
        item.current_status === "Submitted"
          ? "bg-blue-100 text-blue-700"
          : item.current_status === "Under Investigation"
          ? "bg-teal-100 text-teal-700"
          : item.current_status === "Resolved"
          ? "bg-green-100 text-green-700"
          : item.current_status === "Escalated"
          ? "bg-red-100 text-red-700"
          : "bg-slate-100 text-slate-700"
      }
    `}
  >
    {item.current_status}
  </span>
</td>

                    <td className="px-4 py-5">
                      {item.is_anonymous
                        ? "Anonymous"
                        : item.reporter_full_name || "N/A"}
                    </td>

                    <td className="px-4 py-5">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="px-4 py-5">
                      <select
                        value={selectedOfficers[item.id] || ""}
                        onChange={(e) =>
                          handleOfficerChange(item.id, e.target.value)
                        }
                        className="
w-full
rounded-xl
border
border-slate-200
bg-white
px-4
py-2.5
text-sm
shadow-sm
focus:ring-2
focus:ring-[#1456C4]
focus:border-[#1456C4]
outline-none
transition-all
duration-200
"
                      >
                        <option value="">Select Officer</option>

                        {officers.map((officer) => (
                          <option key={officer.id} value={officer.id}>
                            {officer.full_name} ({officer.role})
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-5">
                      <button
                        type="button"
                        onClick={() => handleAssign(item.id)}
                        disabled={assigningId === item.id}
                        className="complaints-action-button"
                      >
                        {assigningId === item.id ? "Assigning..." : "Assign Case"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    No unassigned complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default InvestigationManagement;