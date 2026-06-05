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

      <div className="bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden">
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
              <tr className="bg-slate-50 border-b">
                <th className="px-4 py-3 text-left">CRN</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Reporter</th>
                <th className="px-4 py-3 text-left">Submitted</th>
                <th className="px-4 py-3 text-left">Assign To</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {complaints.length > 0 ? (
                complaints.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-mono text-cyan-600">
                      {item.crn}
                    </td>

                    <td className="px-4 py-3">{item.category}</td>

                    <td className="px-4 py-3">{item.current_status}</td>

                    <td className="px-4 py-3">
                      {item.is_anonymous
                        ? "Anonymous"
                        : item.reporter_full_name || "N/A"}
                    </td>

                    <td className="px-4 py-3">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={selectedOfficers[item.id] || ""}
                        onChange={(e) =>
                          handleOfficerChange(item.id, e.target.value)
                        }
                        className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-full"
                      >
                        <option value="">Select Officer</option>

                        {officers.map((officer) => (
                          <option key={officer.id} value={officer.id}>
                            {officer.full_name} ({officer.role})
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleAssign(item.id)}
                        disabled={assigningId === item.id}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs disabled:opacity-50"
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