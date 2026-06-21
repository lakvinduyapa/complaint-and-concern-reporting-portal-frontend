import { useEffect, useState } from "react";
import {
  getAssignableOfficers,
  getUnassignedComplaints,
  assignComplaintToOfficer,
} from "../../services/adminComplaintService";
import LoadingSpinner from "../../components/common/LoadingSpinner";

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
      <div>
  <h1 className="text-4xl font-bold text-slate-900">
    Investigation Management
  </h1>

  <p className="text-slate-500 mt-2">
    Review unassigned complaints and assign them to investigators.
  </p>
</div>

{/* Overview Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
  <div className="
bg-white
rounded-3xl
border
border-slate-200
shadow-lg
p-5
hover:-translate-y-1
hover:shadow-xl
transition-all
duration-300
animate-fade-up
">
    <p className="text-xs uppercase tracking-wider text-slate-500">
      Unassigned Cases
    </p>

    <h2 className="text-4xl font-bold text-[#1456C4] mt-2">
      {complaints.length}
    </h2>
  </div>

  <div className="
bg-white
rounded-3xl
border
border-slate-200
shadow-lg
p-5
hover:-translate-y-1
hover:shadow-xl
transition-all
duration-300
animate-fade-up
">
    <p className="text-xs uppercase tracking-wider text-slate-500">
      Available Officers
    </p>

    <h2 className="text-4xl font-bold text-[#005E5E] mt-2">
      {officers.length}
    </h2>
  </div>

  <div className="
bg-white
rounded-3xl
border
border-slate-200
shadow-lg
p-5
hover:-translate-y-1
hover:shadow-xl
transition-all
duration-300
animate-fade-up
">
    <p className="text-xs uppercase tracking-wider text-slate-500">
      Pending Assignment
    </p>

    <h2 className="text-4xl font-bold text-[#F59E0B] mt-2">
      {complaints.length}
    </h2>
  </div>
</div>

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

      <div
  className="
  bg-white
  border
  border-slate-200
  rounded-3xl
  shadow-lg
  overflow-hidden
  animate-fade-up
  "
>
        <div className="p-4 border-b bg-white flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">
            Unassigned Complaints
          </p>

          <p className="text-sm text-slate-500">
            {complaints.length} complaint{complaints.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
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
                        className="
px-5
py-2.5
bg-[#1456C4]
hover:bg-[#001A72]
hover:scale-105
text-white
rounded-xl
text-sm
font-semibold
transition-all
duration-200
shadow-md
hover:shadow-lg
disabled:opacity-50
"
                      >
                        {assigningId === item.id ? "Assigning..." : "Assign"}
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
      </div>
    </div>
  );
};

export default InvestigationManagement;