import { useState } from "react";

import StatusTimeline from "../../components/tracking/StatusTimeline";
import { trackComplaintByCRN } from "../../services/trackingService";

const TrackComplaint = () => {
  const [crn, setCrn] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [complaint, setComplaint] = useState(null);

  const handleTrack = async (event) => {
    event.preventDefault();

    const normalizedCrn = crn.trim();

    if (!normalizedCrn) {
      setError("Please enter a CRN to continue.");
      setComplaint(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await trackComplaintByCRN(normalizedCrn);
      setComplaint(response?.data || null);
    } catch (requestError) {
      setComplaint(null);
      setError(requestError?.message || "Unable to track the complaint right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ui-card-strong p-6 md:p-10">
      <div className="mb-8">
        <div className="inline-flex items-center rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 border border-green-200">
          Complaint Tracking
        </div>

        <h2 className="ui-section-title mt-4">Track your complaint</h2>

        <p className="ui-subtitle mt-2 max-w-2xl">
          Enter your CRN to check the current complaint status, submission time, and the latest progress updates.
        </p>
      </div>

      <form onSubmit={handleTrack} className="panel-surface p-6 md:p-8">
        <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="crn">
          Complaint Reference Number
        </label>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            id="crn"
            type="text"
            value={crn}
            onChange={(event) => setCrn(event.target.value)}
            placeholder="Enter your CRN"
            className="ui-input flex-1"
            autoComplete="off"
          />

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Tracking..." : "Track Complaint"}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
      </form>

      {complaint && (
        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="panel-surface p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-500">CRN</p>
                <h3 className="text-2xl font-bold text-slate-900">{complaint.crn}</h3>
              </div>

              <div className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 border border-green-200">
                {complaint.currentStatus}
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Category</p>
                <p className="mt-1 text-base font-semibold text-slate-900">{complaint.category || "Not available"}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Submitted At</p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {complaint.submittedAt ? new Date(complaint.submittedAt).toLocaleString() : "Not available"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Escalation Required</p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {complaint.escalationRequired ? "Yes" : "No"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Complaint ID</p>
                <p className="mt-1 break-all text-base font-semibold text-slate-900">{complaint.complaintId}</p>
              </div>
            </div>
          </div>

          <StatusTimeline
            currentStatus={complaint.currentStatus}
            statusHistory={complaint.statusHistory || []}
          />
        </div>
      )}
    </div>
  );
};

export default TrackComplaint;