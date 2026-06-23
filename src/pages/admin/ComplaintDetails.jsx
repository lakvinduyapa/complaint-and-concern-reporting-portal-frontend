// src/pages/admin/ComplaintDetails.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiFileText,
  FiLock,
  FiShield,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiActivity,
  FiClipboard,
  FiMessageSquare,
  FiEye,
  FiPaperclip,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";

import LoadingSpinner from "../../components/common/LoadingSpinner";

import {
  getAdminComplaintDetails,
  getStatusOptions,
  updateComplaintStatus,
} from "../../services/adminComplaintService";

import { getEvidenceByComplaintId } from "../../services/evidenceService";

const ComplaintDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const normalizeComplaint = (complaintData) => {
    if (!complaintData) return null;

    const reporter =
      complaintData.reporter ||
      (complaintData.reporter_submission_type ||
      complaintData.reporter_category ||
      complaintData.reporter_full_name_detail ||
      complaintData.reporter_employee_id ||
      complaintData.reporter_department ||
      complaintData.reporter_designation ||
      complaintData.reporter_email ||
      complaintData.reporter_phone ||
      complaintData.reporter_preferred_contact_method
        ? {
            submissionType:
              complaintData.reporter_submission_type ||
              (complaintData.is_anonymous ? "anonymous" : "named"),
            reporterCategory: complaintData.reporter_category || "",
            fullName:
              complaintData.reporter_full_name_detail ||
              complaintData.reporter_full_name ||
              complaintData.reporterFullName ||
              "",
            employeeId: complaintData.reporter_employee_id || "",
            department: complaintData.reporter_department || "",
            designation: complaintData.reporter_designation || "",
            email: complaintData.reporter_email || "",
            phone: complaintData.reporter_phone || "",
            preferredContactMethod:
              complaintData.reporter_preferred_contact_method || "",
          }
        : null);

    return {
      ...complaintData,
      currentStatus:
        complaintData.currentStatus || complaintData.current_status,
      escalationRequired:
        complaintData.escalationRequired ?? complaintData.escalation_required,
      isAnonymous:
        complaintData.isAnonymous ?? complaintData.is_anonymous,
      reporter,
    };
  };

  const [complaint, setComplaint] = useState(null);
  const [evidenceList, setEvidenceList] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const BACKEND_URL = "http://localhost:5000";

  const currentUser = JSON.parse(
    localStorage.getItem("adminUser") || "{}"
  );

  const getDisplayStatus = (status) => {
    if (status === "Resolved" || status === "Closed") {
      return "Resolved / Closed";
    }
    return status;
  };

  const getSubmitStatus = (status) => {
    if (status === "Resolved" || status === "Closed") {
      return "Resolved";
    }
    return status;
  };

  const canUpdateInvestigation =
    currentUser.role === "admin" ||
    currentUser.role === "senior_investigator" ||
    currentUser.role === "officer";

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const [complaintResult, statusResult, evidenceResult] =
          await Promise.all([
            getAdminComplaintDetails(id),
            getStatusOptions(),
            getEvidenceByComplaintId(id),
          ]);

        const normalizedComplaint = normalizeComplaint(complaintResult);

        setComplaint(normalizedComplaint);
        setSelectedStatus(
          getSubmitStatus(normalizedComplaint?.currentStatus || "Submitted")
        );
        setStatusOptions(statusResult || []);
        setEvidenceList(evidenceResult?.data || []);
      } catch (err) {
        setError(err?.message || "Failed to fetch complaint details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleStatusUpdate = async (event) => {
    event.preventDefault();

    try {
      setUpdating(true);
      setError("");
      setSuccessMessage("");

      await updateComplaintStatus(id, {
        status: selectedStatus,
        note,
      });

      const refreshed = await getAdminComplaintDetails(id);
      setComplaint(normalizeComplaint(refreshed));

      setSuccessMessage("Investigation status updated successfully.");
      setNote("");
    } catch (err) {
      setError(err?.message || "Failed to update complaint");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusStyle = () => {
    return "bg-white text-gray-700 border border-gray-200";
  };

  const getPriorityStyle = () => {
    return "bg-white text-gray-700 border border-gray-200";
  };

  const getEvidenceUrl = (filePath) => {
    if (!filePath) return "#";
    const cleanedPath = filePath.replace(/\\/g, "/");
    if (cleanedPath.startsWith("http")) {
      return cleanedPath;
    }
    return `${BACKEND_URL}/${cleanedPath}`;
  };

  const renderNamedReporterValue = (value, fallback = "N/A") => {
    if (value === null || value === undefined || value === "") {
      return fallback;
    }
    return value;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="bg-white border border-gray-200 p-4 rounded-md text-red-700">
        Complaint not found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header with Back button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Report Details</h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete complaint record & investigation summary
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/complaints")}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
        >
          <FiArrowLeft />
          Back to list
        </button>
      </div>

      {/* Error / Success messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-md text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {/* Main Card – all details in one box */}
      <div className="bg-white shadow-md rounded-2xl border border-slate-200 overflow-hidden">
        {/* Quick stats row (CRN, Status, Priority, Category, Submitted) */}
        <div className="grid grid-cols-2 md:grid-cols-5 bg-slate-50 border-b border-slate-200 divide-x divide-y md:divide-y-0 divide-slate-200">
          <div className="p-4 min-w-0">
            <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-medium">
              <FiFileText size={14} />
              CRN
            </div>
            <p className="font-bold text-slate-900 mt-1 break-words">
              {complaint.crn}
            </p>
          </div>

          <div className="p-4 min-w-0">
            <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-medium">
              <FiActivity size={14} />
              Status
            </div>
            <div className="mt-1">
              <span
                className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusStyle(
                  complaint.currentStatus
                )}`}
              >
                {complaint.currentStatus}
              </span>
            </div>
          </div>

          <div className="p-4 min-w-0">
            <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-medium">
              <FiShield size={14} />
              Priority
            </div>
            <div className="mt-1">
              <span
                className={`px-3 py-1 rounded-md text-xs font-medium ${getPriorityStyle()}`}
              >
                {complaint.escalationRequired ? "HIGH" : "MEDIUM"}
              </span>
            </div>
          </div>

          <div className="p-4 min-w-0">
            <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-medium">
              <FiClipboard size={14} />
              Category
            </div>
            <p className="font-semibold text-slate-900 mt-1 break-words">
              {complaint.category}
            </p>
          </div>

          <div className="p-4 min-w-0">
            <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-medium">
              <FiCalendar size={14} />
              Submitted
            </div>
            <p className="font-semibold text-slate-900 mt-1 text-sm break-words">
              {complaint.createdAt
                ? new Date(complaint.createdAt).toLocaleDateString()
                : complaint.created_at
                ? new Date(complaint.created_at).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        {/* === DETAILS BODY === */}
        <div className="p-6 space-y-6">
          {/* ---------- REPORTER INFORMATION ---------- */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FiUser className="text-slate-700" />
                <h2 className="font-semibold text-slate-900">
                  Reporter Information
                </h2>
              </div>
              {/* Badge: Named / Anonymous */}
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${
                  complaint.isAnonymous
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}
              >
                {complaint.isAnonymous ? (
                  <>
                    <FiUserX size={12} />
                    Anonymous
                  </>
                ) : (
                  <>
                    <FiUserCheck size={12} />
                    Named Reporter
                  </>
                )}
              </span>
            </div>

            {complaint.isAnonymous ? (
              // ---- Anonymous view ----
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-slate-500 mb-1">Submission Type</p>
                  <p className="font-medium text-slate-800">
                    {complaint?.reporter?.submissionType || "Anonymous"}
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-slate-500 mb-1">Visibility</p>
                  <p className="font-medium text-slate-800">Hidden</p>
                </div>
                <div className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-slate-500 mb-1">Full Name</p>
                  <p className="font-medium text-slate-800">Anonymous</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-slate-500 mb-1">Email</p>
                  <p className="font-medium text-slate-800">Hidden</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-slate-500 mb-1">Phone</p>
                  <p className="font-medium text-slate-800">Hidden</p>
                </div>
              </div>
            ) : (
              // ---- Named reporter – all fields in the requested order ----
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-1">
                    Reporter Category
                  </p>
                  <p className="font-semibold text-slate-900 break-words">
                    {renderNamedReporterValue(
                      complaint?.reporter?.reporterCategory
                    )}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-1">
                    Full Name
                  </p>
                  <p className="font-semibold text-slate-900 break-words">
                    {renderNamedReporterValue(complaint?.reporter?.fullName)}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-1">
                    Staff ID
                  </p>
                  <p className="font-semibold text-slate-900 break-words">
                    {renderNamedReporterValue(complaint?.reporter?.employeeId)}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-1">
                    Department
                  </p>
                  <p className="font-semibold text-slate-900 break-words">
                    {renderNamedReporterValue(complaint?.reporter?.department)}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-1">
                    Designation
                  </p>
                  <p className="font-semibold text-slate-900 break-words">
                    {renderNamedReporterValue(
                      complaint?.reporter?.designation,
                      "Not applicable"
                    )}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-1">
                    Contact Method
                  </p>
                  <p className="font-semibold text-slate-900 break-words">
                    {renderNamedReporterValue(
                      complaint?.reporter?.preferredContactMethod,
                      "N/A"
                    )}
                  </p>
                </div>

                <div className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-1">
                    Email
                  </p>
                  <p className="font-semibold text-slate-900 break-all">
                    {renderNamedReporterValue(complaint?.reporter?.email)}
                  </p>
                </div>

                <div className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-1">
                    Phone Number
                  </p>
                  <p className="font-semibold text-slate-900 break-words">
                    {renderNamedReporterValue(complaint?.reporter?.phone)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ---------- COMPLAINT CATEGORIES ---------- */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <FiClipboard className="text-slate-700" />
              <h2 className="font-semibold text-slate-900">
                Complaint Category
              </h2>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="font-semibold text-slate-900">
                {complaint.category || "N/A"}
              </p>
            </div>
          </div>

          {/* ---------- INCIDENT DETAILS ---------- */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <FiMapPin className="text-slate-700" />
              <h2 className="font-semibold text-slate-900">
                Incident Details
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs uppercase text-slate-500 font-medium mb-1">
                  Incident Date
                </p>
                <p className="font-medium text-slate-800 flex items-center gap-2">
                  <FiCalendar size={16} />
                  {complaint.incidentDate
                    ? new Date(complaint.incidentDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs uppercase text-slate-500 font-medium mb-1">
                  Location
                </p>
                <p className="font-medium text-slate-800 flex items-center gap-2 break-words">
                  <FiMapPin size={16} />
                  {complaint.incidentLocation || "N/A"}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:col-span-2">
                <p className="text-xs uppercase text-slate-500 font-medium mb-1">
                  Frequency
                </p>
                <p className="font-medium text-slate-800">
                  {complaint.frequency || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* ---------- DESCRIPTION ---------- */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <FiFileText className="text-slate-700" />
              <h2 className="font-semibold text-slate-900">Description</h2>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                {complaint.description || "No narrative available."}
              </p>
            </div>
          </div>

          {/* ---------- EVIDENCE ---------- */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <FiPaperclip className="text-slate-700" />
              <h2 className="font-semibold text-slate-900">Evidence</h2>
            </div>

            {evidenceList.length > 0 ? (
              <div className="space-y-4">
                {evidenceList.map((evidence) => (
                  <div
                    key={evidence.id}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 break-words">
                        {evidence.original_file_name || "Evidence File"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 break-words">
                        Type: {evidence.evidence_type || "Document"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 break-words">
                        MIME: {evidence.mime_type || "N/A"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Size:{" "}
                        {evidence.file_size
                          ? `${(Number(evidence.file_size) / 1024).toFixed(
                              2
                            )} KB`
                          : "N/A"}
                      </p>
                    </div>
                    <a
                      href={getEvidenceUrl(evidence.file_path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition"
                    >
                      <FiEye size={16} />
                      View Evidence
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-5">
                <p className="text-sm text-slate-500">
                  No evidence uploaded for this complaint.
                </p>
              </div>
            )}
          </div>

          {/* ---------- INVESTIGATION CONTROL CENTER ---------- */}
          {canUpdateInvestigation && (
            <div className="border-t border-slate-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <FiShield className="text-slate-700" />
                <h2 className="font-semibold text-slate-900">
                  Investigation Control Center
                </h2>
              </div>

              <form onSubmit={handleStatusUpdate} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Update Investigation Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {statusOptions.map((status) => {
                      if (status === "Closed") return null;
                      return (
                        <option key={status} value={getSubmitStatus(status)}>
                          {getDisplayStatus(status)}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Additional Note
                  </label>
                  <textarea
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Enter status update note"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
                >
                  {updating ? "Updating Status..." : "Update Status"}
                </button>
              </form>
            </div>
          )}

          {/* ---------- INTERNAL NOTES (optional) ---------- */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <FiMessageSquare className="text-slate-700" />
              <h2 className="font-semibold text-slate-900">
                Internal Investigation Notes
              </h2>
            </div>

            {complaint.investigationNotes?.length > 0 ? (
              <div className="space-y-4">
                {complaint.investigationNotes.map((noteEntry, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 bg-slate-50 rounded-xl p-4"
                  >
                    <p className="font-medium text-sm text-slate-800">
                      {noteEntry.addedBy}
                    </p>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed break-words mt-2">
                      {noteEntry.note}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No internal notes available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;