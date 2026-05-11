import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiClock,
  FiFileText,
  FiLock,
  FiShield,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiActivity,
  FiClipboard,
  FiMessageSquare,
} from "react-icons/fi";

import LoadingSpinner from "../../components/common/LoadingSpinner";

import {
  getAdminComplaintDetails,
  getStatusOptions,
  updateComplaintStatus
} from "../../services/adminComplaintService";


const ComplaintDetails = () => {

  const navigate = useNavigate();

  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);

  const [statusOptions, setStatusOptions] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState("");

  const [note, setNote] = useState("");

  const [escalate, setEscalate] = useState(false);

  const [escalationReason, setEscalationReason] = useState("");

  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");


  useEffect(() => {

    const fetchDetails = async () => {

      try {

        setLoading(true);

        const [complaintResult, statusResult] = await Promise.all([

          getAdminComplaintDetails(id),
          getStatusOptions()

        ]);

        setComplaint(complaintResult);

        setSelectedStatus(
          complaintResult.currentStatus || "Submitted"
        );

        setStatusOptions(statusResult || []);

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

      await updateComplaintStatus(id, {

        status: selectedStatus,
        note,
        escalate,
        escalationReason

      });

      const refreshed = await getAdminComplaintDetails(id);

      setComplaint(refreshed);

      setSuccessMessage("Investigation status updated successfully.");

      setNote("");

      setEscalate(false);

      setEscalationReason("");

    } catch (err) {

      setError(err?.message || "Failed to update complaint");

    } finally {

      setUpdating(false);

    }

  };


  const getStatusStyle = (status) => {

    switch (status) {

      case "Resolved":
        return "bg-green-100 text-green-700 border border-green-200";

      case "Escalated":
        return "bg-red-100 text-red-700 border border-red-200";

      case "Under Investigation":
        return "bg-amber-100 text-amber-700 border border-amber-200";

      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";

    }

  };


  const getPriorityStyle = () => {

    if (complaint?.escalationRequired) {

      return "bg-red-100 text-red-700 border border-red-200";

    }

    return "bg-amber-100 text-amber-700 border border-amber-200";

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

      <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-700">

        Complaint not found.

      </div>

    );

  }


  return (

    <div className="space-y-6 overflow-x-hidden">


      {/* Investigation Header */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

        {/* Top */}
        <div className="border-b border-gray-100 px-6 py-5">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div className="flex items-start gap-4">

              <div className="w-14 h-14 bg-slate-900 text-white rounded-xl flex items-center justify-center shrink-0">

                <FiShield size={24} />

              </div>

              <div>

                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">

                  Internal Affairs Investigation Record

                </h1>

                <p className="text-sm text-gray-500 mt-1">

                  Governance & Ethics Review Management System

                </p>

              </div>

            </div>


            <button
              onClick={() => navigate("/admin/complaints")}
              className="flex items-center gap-2 border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >

              <FiArrowLeft />

              Back to Queue

            </button>

          </div>

        </div>


        {/* Metadata Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-5 divide-x divide-y lg:divide-y-0 divide-gray-100">

          <div className="p-4 min-w-0">

            <p className="text-xs uppercase text-gray-500 font-medium">

              CRN

            </p>

            <p className="font-bold text-gray-900 mt-2 break-words">

              {complaint.crn}

            </p>

          </div>


          <div className="p-4 min-w-0">

            <p className="text-xs uppercase text-gray-500 font-medium">

              Status

            </p>

            <div className="mt-2">

              <span className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusStyle(complaint.currentStatus)}`}>

                {complaint.currentStatus}

              </span>

            </div>

          </div>


          <div className="p-4 min-w-0">

            <p className="text-xs uppercase text-gray-500 font-medium">

              Priority

            </p>

            <div className="mt-2">

              <span className={`px-3 py-1 rounded-md text-xs font-medium ${getPriorityStyle()}`}>

                {complaint.escalationRequired
                  ? "HIGH"
                  : "MEDIUM"}

              </span>

            </div>

          </div>


          <div className="p-4 min-w-0">

            <p className="text-xs uppercase text-gray-500 font-medium">

              Category

            </p>

            <p className="font-semibold text-gray-900 mt-2 break-words">

              {complaint.category}

            </p>

          </div>


          <div className="p-4 min-w-0">

            <p className="text-xs uppercase text-gray-500 font-medium">

              Submitted

            </p>

            <p className="font-semibold text-gray-900 mt-2 text-sm break-words">

              {new Date(
                complaint.createdAt
              ).toLocaleDateString()}

            </p>

          </div>

        </div>

      </div>


      {/* Alerts */}
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


      {/* Main Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">


        {/* LEFT */}
        <div className="xl:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">


          {/* Case Summary */}
          <section className="border-b border-gray-100 p-6">

            <div className="flex items-center gap-2 mb-5">

              <FiFileText className="text-gray-700" />

              <h2 className="font-semibold text-gray-900">

                Case Summary

              </h2>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">

              <div className="space-y-5">

                <div>

                  <p className="text-gray-500 mb-1">

                    Incident Date

                  </p>

                  <p className="font-medium text-gray-800 flex items-center gap-2 break-words">

                    <FiCalendar size={14} />

                    {complaint.incidentDate
                      ? new Date(
                          complaint.incidentDate
                        ).toLocaleDateString()
                      : "N/A"}

                  </p>

                </div>


                <div>

                  <p className="text-gray-500 mb-1">

                    Incident Location

                  </p>

                  <p className="font-medium text-gray-800 flex items-center gap-2 break-words">

                    <FiMapPin size={14} />

                    {complaint.incidentLocation || "N/A"}

                  </p>

                </div>

              </div>


              <div className="space-y-5">

                <div>

                  <p className="text-gray-500 mb-1">

                    Frequency

                  </p>

                  <p className="font-medium text-gray-800 break-words">

                    {complaint.frequency || "N/A"}

                  </p>

                </div>


                <div>

                  <p className="text-gray-500 mb-1">

                    Awareness Method

                  </p>

                  <p className="font-medium text-gray-800 break-words">

                    {complaint.awarenessMethod || "N/A"}

                  </p>

                </div>

              </div>

            </div>

          </section>


          {/* Incident Narrative */}
          <section className="border-b border-gray-100 p-6">

            <div className="flex items-center gap-2 mb-5">

              <FiClipboard className="text-gray-700" />

              <h2 className="font-semibold text-gray-900">

                Incident Narrative

              </h2>

            </div>


            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">

              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">

                {complaint.description || "No narrative available."}

              </p>

            </div>

          </section>


          {/* Subject Registry */}
          <section className="border-b border-gray-100 p-6">

            <div className="flex items-center gap-2 mb-5">

              <FiUser className="text-gray-700" />

              <h2 className="font-semibold text-gray-900">

                Subject Registry

              </h2>

            </div>


            {complaint.subjects?.length > 0 ? (

              <div className="space-y-4">

                {complaint.subjects.map((subject, index) => (

                  <div
                    key={index}
                    className="border border-gray-100 rounded-xl p-5 shadow-sm"
                  >

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">

                      <div>

                        <p className="text-gray-500 mb-1">

                          Full Name

                        </p>

                        <p className="font-medium text-gray-800 break-words">

                          {subject.fullName || "N/A"}

                        </p>

                      </div>


                      <div>

                        <p className="text-gray-500 mb-1">

                          Designation

                        </p>

                        <p className="font-medium text-gray-800 break-words">

                          {subject.designation || "N/A"}

                        </p>

                      </div>


                      <div>

                        <p className="text-gray-500 mb-1">

                          Organization

                        </p>

                        <p className="font-medium text-gray-800 break-words">

                          {subject.organisation || "N/A"}

                        </p>

                      </div>


                      <div>

                        <p className="text-gray-500 mb-1">

                          Relationship

                        </p>

                        <p className="font-medium text-gray-800 break-words">

                          {subject.relationship || "N/A"}

                        </p>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            ) : (

              <p className="text-sm text-gray-500">

                No subject records available.

              </p>

            )}

          </section>


          {/* Investigation Timeline */}
          <section className="p-6">

            <div className="flex items-center gap-2 mb-6">

              <FiActivity className="text-gray-700" />

              <h2 className="font-semibold text-gray-900">

                Investigation Activity

              </h2>

            </div>


            <div className="space-y-6">

              {complaint.statusHistory?.map((entry, index) => (

                <div
                  key={index}
                  className="flex gap-4 min-w-0"
                >

                  <div className="flex flex-col items-center">

                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">

                      <FiClock
                        size={14}
                        className="text-slate-700"
                      />

                    </div>

                    {index !==
                      complaint.statusHistory.length - 1 && (

                      <div className="w-px flex-1 bg-gray-300 mt-2"></div>

                    )}

                  </div>


                  <div className="pb-6 flex-1 min-w-0">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">

                      <h3 className="font-semibold text-gray-900 break-words">

                        {entry.status}

                      </h3>

                      <span className="text-xs text-gray-500">

                        {entry.updatedAt
                          ? new Date(
                              entry.updatedAt
                            ).toLocaleString()
                          : "N/A"}

                      </span>

                    </div>


                    <p className="text-sm text-gray-600 mt-2 leading-relaxed break-words whitespace-pre-wrap">

                      {entry.note || "No investigation note added."}

                    </p>


                    <p className="text-xs text-gray-500 mt-3">

                      Updated By:
                      {" "}
                      {entry.updatedBy || "System"}

                    </p>

                  </div>

                </div>

              ))}

            </div>

          </section>

        </div>


        {/* RIGHT CONTROL PANEL */}
        <div className="space-y-5 xl:sticky xl:top-6 self-start">


          {/* Investigation Control */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

            <div className="bg-slate-900 px-5 py-4 border-b border-slate-800">

              <div className="flex items-center gap-2 text-white">

                <FiShield />

                <h2 className="font-semibold">

                  Investigation Control Center

                </h2>

              </div>

            </div>


            <form
              onSubmit={handleStatusUpdate}
              className="p-5 space-y-5"
            >

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">

                  Update Investigation Status

                </label>

                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value)
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-700"
                >

                  {statusOptions.map((status) => (

                    <option
                      key={status}
                      value={status}
                    >

                      {status}

                    </option>

                  ))}

                </select>

              </div>


              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">

                  Investigation Note

                </label>

                <textarea
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Enter internal investigation note"
                  className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-700"
                />

              </div>


                <div className="border border-red-100 bg-red-50 rounded-xl p-4">

                <label className="flex items-center gap-2 text-sm font-medium text-red-700">

                  <input
                    type="checkbox"
                    checked={escalate}
                    onChange={(e) =>
                      setEscalate(e.target.checked)
                    }
                  />

                  Escalate Investigation

                </label>

              </div>


              {escalate && (

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">

                    Escalation Reason

                  </label>

                  <textarea
                    rows={3}
                    value={escalationReason}
                    onChange={(e) =>
                      setEscalationReason(e.target.value)
                    }
                    placeholder="Enter escalation details"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />

                </div>

              )}


              <button
                type="submit"
                disabled={updating}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl text-sm font-medium transition-all shadow-sm"
              >

                {updating
                  ? "Updating Investigation..."
                  : "Update Investigation"}

              </button>

            </form>

          </div>


          {/* Reporter Information */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">

            <div className="flex items-center gap-2 mb-5">

              <FiUser className="text-gray-700" />

              <h2 className="font-semibold text-gray-900">

                Reporter Information

              </h2>

            </div>


            <div className="space-y-5 text-sm">

              <div>

                <p className="text-gray-500 mb-1">

                  Submission Type

                </p>

                <p className="font-medium text-gray-800">

                  {complaint?.reporter?.submissionType || "N/A"}

                </p>

              </div>


              <div>

                <p className="text-gray-500 mb-1">

                  Full Name

                </p>

                <p className="font-medium text-gray-800">

                  {complaint.isAnonymous
                    ? "Anonymous"
                    : complaint?.reporter?.fullName || "N/A"}

                </p>

              </div>


              <div>

                <p className="text-gray-500 mb-1">

                  Email

                </p>

                <p className="font-medium text-gray-800 break-all">

                  {complaint.isAnonymous
                    ? "Hidden"
                    : complaint?.reporter?.email || "N/A"}

                </p>

              </div>


              <div>

                <p className="text-gray-500 mb-1">

                  Phone

                </p>

                <p className="font-medium text-gray-800">

                  {complaint.isAnonymous
                    ? "Hidden"
                    : complaint?.reporter?.phone || "N/A"}

                </p>

              </div>

            </div>

          </div>


          {/* Restricted Record */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-sm">

            <div className="flex items-center gap-2 mb-4">

              <FiLock />

              <h2 className="font-semibold">

                Restricted Governance Record

              </h2>

            </div>


            <p className="text-sm text-slate-300 leading-relaxed">

              Access to this investigation file is restricted to
              authorized Internal Affairs Unit officers and
              governance investigators.

            </p>

          </div>


          {/* Internal Notes */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">

            <div className="flex items-center gap-2 mb-5">

              <FiMessageSquare className="text-gray-700" />

              <h2 className="font-semibold text-gray-900">

                Internal Investigation Notes

              </h2>

            </div>


            {complaint.investigationNotes?.length > 0 ? (

              <div className="space-y-4">

                {complaint.investigationNotes.map(
                  (noteEntry, index) => (

                    <div
                      key={index}
                      className="border border-gray-100 bg-gray-50 rounded-xl p-4"
                    >

                      <div className="flex items-center justify-between mb-3">

                        <div>

                          <p className="font-medium text-sm text-gray-800 break-words">

                            {noteEntry.addedBy}

                          </p>

                          <p className="text-xs text-gray-500 mt-1">

                            {noteEntry.addedAt
                              ? new Date(
                                  noteEntry.addedAt
                                ).toLocaleString()
                              : "N/A"}

                          </p>

                        </div>


                        {noteEntry.isConfidential && (

                          <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 border border-red-200 px-2 py-1 rounded-md">

                            <FiLock size={12} />

                            Confidential

                          </span>

                        )}

                      </div>


                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed break-words">

                        {noteEntry.note}

                      </p>

                    </div>

                  )
                )}

              </div>

            ) : (

              <p className="text-sm text-gray-500">

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