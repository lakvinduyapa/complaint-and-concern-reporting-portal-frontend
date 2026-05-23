import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { trackComplaintByCRN } from "../../services/trackingService";

const TrackComplaint = () => {

  const navigate = useNavigate();

  const [crn, setCrn] = useState("");

  const [loading, setLoading] = useState(false);

  const [complaint, setComplaint] = useState(null);

  const [error, setError] = useState("");



  // ========================================
  // Handle Tracking
  // ========================================

  const handleTrack = async () => {

  if (!crn.trim()) {
    setError("Please enter a Complaint Reference Number");
    return;
  }

  try {

    setLoading(true);
    setError("");

    const data = await trackComplaintByCRN(crn);

    setComplaint(data.data);

  } catch (err) {

    setComplaint(null);

    setError(err.message || "Complaint not found");

  } finally {

    setLoading(false);

  }

};



  // ========================================
  // Status Text Colors
  // ========================================

  const getStatusColor = (status) => {
  switch (status) {
    case "Submitted":
      return "bg-cyan-50 text-cyan-700 border border-cyan-200";

    case "Preliminary Review":
      return "bg-purple-50 text-purple-700 border border-purple-200";

    case "Under Investigation":
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";

    case "Awaiting Evidence":
      return "bg-orange-50 text-orange-700 border border-orange-200";

    case "Escalated to CIABOC":
      return "bg-red-50 text-red-700 border border-red-200";

    case "Resolved":
      return "bg-green-50 text-green-700 border border-green-200";

    case "Closed":
      return "bg-gray-50 text-gray-700 border border-gray-200";

    default:
      return "bg-slate-50 text-slate-700 border border-slate-200";
  }
};



  // ========================================
  // Status Dot Colors
  // ========================================

  const getStatusDotColor = (status) => {

    const colors = {

      "Submitted": "bg-cyan-600",
      "Preliminary Review": "bg-yellow-600",
      "Under Investigation": "bg-orange-600",
      "Awaiting Evidence": "bg-purple-600",
      "Escalated to CIABOC": "bg-red-600",
      "Resolved": "bg-green-600",
      "Closed": "bg-gray-600"

    };

    return colors[status] || "bg-gray-600";

  };



  return (

    <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 md:p-10">

      {/* Header */}
      <div className="text-center mb-10">

        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">

          Track Complaint Status

        </h2>

        <p className="text-sm md:text-base text-slate-500 mt-3 leading-relaxed">

          Enter your Complaint Reference Number (CRN) to track complaint
          progress.

        </p>

      </div>

      <div className="flex justify-center mb-8">
  <div className="bg-green-50 border border-green-100 rounded-2xl px-6 py-4">
    <p className="text-sm text-slate-500">
      Complaint Tracking Portal
    </p>

    <h3 className="text-xl font-bold text-slate-900 mt-1">
      Real-Time Status Updates
    </h3>
  </div>
</div>




      {/* Search Section */}
      <div className="max-w-3xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-6">

        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Enter CRN"
            value={crn}
            onChange={(e) => setCrn(e.target.value)}
            className="ui-input flex-1 px-5 py-4"
          />



          <button
            onClick={handleTrack}
            disabled={loading}
            className="w-full md:w-auto bg-[#3e9638] hover:bg-[#31802c] text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60"
          >

            {loading ? "Searching..." : "Track"}

          </button>

        </div>

      </div>



      {/* Error Message */}
      {error && (

        <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-4">

          <p className="text-red-700 text-sm leading-relaxed">

            {error}

          </p>

        </div>

      )}



      {/* Complaint Result */}
      {complaint && (

        <div className="mt-12">

          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* CRN */}
            <div className="panel-surface p-5 rounded-2xl border border-slate-200">

              <p className="text-sm text-slate-500 mb-2">

                Complaint Reference

              </p>

              <span
  className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
    complaint.currentStatus
  )}`}
>
  {complaint.currentStatus}
</span>

            </div>



            {/* Category */}
            <div className="panel-surface p-5 rounded-2xl border border-slate-200">

              <p className="text-sm text-slate-500 mb-2">

                Category

              </p>

              <h4 className="font-bold text-slate-900">

                {complaint.category}

              </h4>

            </div>



            {/* Current Status */}
            <div className="panel-surface p-5 rounded-2xl border border-slate-200">

              <p className="text-sm text-slate-500 mb-2">

                Current Status

              </p>

              <h4 className={`font-bold ${getStatusColor(complaint.currentStatus)}`}>

                {complaint.currentStatus}

              </h4>

            </div>

          </div>



          {/* Timeline */}
          <div className="mt-10">

            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">

              Status Timeline

            </h3>

            <div className="space-y-6">

              {complaint.statusHistory?.map((item, index) => (

                <div
                  key={index}
                   className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-start gap-4"
                >

                  <div
                    className={`w-5 h-5 rounded-full ${getStatusDotColor(item.status)} mt-1 flex-shrink-0`}
                  />



                  <div className="flex-1">

                    <h4 className="font-semibold text-slate-900">

                      {item.status}

                    </h4>

                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">

                      {item.note}

                    </p>

                    <p className="text-xs text-slate-400 mt-2">

                      Updated:{" "}
                      {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleDateString()
                        : "N/A"}

                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      )}



      {/* Actions */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">

        <button
          onClick={() => navigate("/")}
          className="w-full sm:w-auto bg-[#3e9638] hover:bg-[#31802c] text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
        >

          Return Home

        </button>

      </div>

    </div>

  );

};

export default TrackComplaint;