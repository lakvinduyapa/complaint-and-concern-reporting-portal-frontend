import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Stepper from "../../components/forms/Stepper";
import { useComplaint } from "../../hooks/useComplaint";

const ComplaintStep = () => {

  const navigate = useNavigate();

  const { complaintData, setComplaintData } = useComplaint();

  const [error, setError] = useState("");

  const { complaint } = complaintData;



  // ========================================
  // Update Complaint Data
  // ========================================

  const updateComplaint = (field, value) => {

    setComplaintData((prev) => ({
      ...prev,
      complaint: {
        ...prev.complaint,
        [field]: value
      }
    }));

  };



  // ========================================
  // Continue Validation
  // ========================================

  const handleContinue = () => {

    if (!complaint.category) {

      setError("Please select a complaint category.");

      return;

    }

    if (!complaint.incidentDate) {

      setError("Incident date is required.");

      return;

    }

    if (!complaint.frequency) {

      setError("Please select the frequency of the incident.");

      return;

    }

    if (!complaint.awarenessMethod) {

      setError("Please select how you became aware of the incident.");

      return;

    }

    if (!complaint.description || complaint.description.trim().length < 50) {

      setError("Incident description must be at least 50 characters.");

      return;

    }

    setError("");

    navigate("/report/subject-information");

  };



  return (

    <div className="ui-card-strong p-4 sm:p-6 md:p-10">

      {/* Stepper */}
      <Stepper currentStep={2} />



      {/* Header */}
      <div className="mb-8">

        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">

          Complaint Details

        </h2>

        <p className="text-sm md:text-base text-slate-500 mt-2 leading-relaxed">

          Provide detailed information regarding the incident or concern.

        </p>

      </div>



      {/* Form */}
      <div className="space-y-8">

        {/* ===== INCIDENT DETAILS SECTION ===== */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 md:p-8 border border-slate-200">

          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Incident Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Complaint Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Complaint Category <span className="text-red-500">*</span>
              </label>
              <select
                value={complaint.category}
                onChange={(e) => updateComplaint("category", e.target.value)}
                className="ui-select"
              >
                <option value="">Select Category</option>
                <option value="Bribery">Bribery</option>
                <option value="Corruption">Corruption</option>
                <option value="Fraud">Fraud</option>
                <option value="Financial Misconduct">Financial Misconduct</option>
                <option value="Abuse of Authority">Abuse of Authority</option>
                <option value="Misuse of Position">Misuse of Position</option>
                <option value="Discrimination">Discrimination</option>
                <option value="Unfair Contract Award">Unfair Contract Award</option>
                <option value="Company Property">Company Property</option>
                <option value="Conflict of Interest">Conflict of Interest</option>
                <option value="Confidentiality Breach">Confidentiality Breach</option>
                <option value="Falsification of Records">Falsification of Records</option>
                <option value="Harassment">Harassment</option>
                <option value="Workplace Misconduct">Workplace Misconduct</option>
                <option value="Policy Violation">Policy Violation</option>
                <option value="Other Malpractice">Other Malpractice</option>
              </select>
            </div>

            {/* Incident Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Incident Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={complaint.incidentDate}
                onChange={(e) => updateComplaint("incidentDate", e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="ui-input"
              />
            </div>

            {/* Incident End Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Incident End Date <span className="text-slate-400 text-xs font-normal">(if applicable)</span>
              </label>
              <input
                type="date"
                value={complaint.incidentEndDate}
                onChange={(e) => updateComplaint("incidentEndDate", e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="ui-input"
              />
            </div>

            {/* Incident Location */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Location / Division <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={complaint.incidentLocation}
                onChange={(e) => updateComplaint("incidentLocation", e.target.value)}
                placeholder="e.g., Head Office, Regional Unit, Department"
                className="ui-input"
              />
            </div>

          </div>

        </div>

        {/* ===== INCIDENT CONTEXT SECTION ===== */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 md:p-8 border border-slate-200">

          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Incident Context
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Frequency */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Frequency of Occurrence <span className="text-red-500">*</span>
              </label>
              <select
                value={complaint.frequency}
                onChange={(e) => updateComplaint("frequency", e.target.value)}
                className="ui-select"
              >
                <option value="">Select Frequency</option>
                <option value="One-time incident">One-time incident</option>
                <option value="Repeated incident">Repeated (periodic)</option>
                <option value="Ongoing">Ongoing continuously</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

          </div>

          {/* How did you become aware */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-slate-700 mb-4">
              How Did You Become Aware? <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-slate-700">
                <input
                  type="radio"
                  name="awarenessMethod"
                  value="Direct Witness"
                  checked={complaint.awarenessMethod === "Direct Witness"}
                  onChange={(e) => updateComplaint("awarenessMethod", e.target.value)}
                  className="accent-green-600 w-4 h-4"
                />
                <span>Direct Witness</span>
              </label>
              <label className="flex items-center gap-2 text-slate-700">
                <input
                  type="radio"
                  name="awarenessMethod"
                  value="Another Person Informed Me"
                  checked={complaint.awarenessMethod === "Another Person Informed Me"}
                  onChange={(e) => updateComplaint("awarenessMethod", e.target.value)}
                  className="accent-green-600 w-4 h-4"
                />
                <span>Another Person Informed Me</span>
              </label>
              <label className="flex items-center gap-2 text-slate-700">
                <input
                  type="radio"
                  name="awarenessMethod"
                  value="Documents/Records"
                  checked={complaint.awarenessMethod === "Documents/Records"}
                  onChange={(e) => updateComplaint("awarenessMethod", e.target.value)}
                  className="accent-green-600 w-4 h-4"
                />
                <span>Documents/Records</span>
              </label>
              <label className="flex items-center gap-2 text-slate-700">
                <input
                  type="radio"
                  name="awarenessMethod"
                  value="Other"
                  checked={complaint.awarenessMethod === "Other"}
                  onChange={(e) => updateComplaint("awarenessMethod", e.target.value)}
                  className="accent-green-600 w-4 h-4"
                />
                <span>Other</span>
              </label>
            </div>
          </div>

        </div>

        {/* ===== DESCRIPTION SECTION ===== */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 md:p-8 border border-slate-200">

          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Incident Description
          </h3>

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Description of Complaint <span className="text-red-500">*</span>
          </label>

          <textarea
            rows="6"
            value={complaint.description}
            onChange={(e) => updateComplaint("description", e.target.value)}
            placeholder="Describe what occurred, when it happened, what actions were taken, and why you believe this is a concern. Minimum 50 characters required."
            className="ui-textarea resize-none"
          />

          <p className="text-xs text-slate-500 mt-2">
            Minimum 50 characters required. Include relevant names, actions, dates, and circumstances.
          </p>

        </div>

        {/* ===== PREVIOUS REPORT SECTION ===== */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 md:p-8 border border-slate-200">

          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Prior Reporting History
          </h3>

          <label className="block text-sm font-semibold text-slate-700 mb-4">
            Has this matter been reported previously? <span className="text-red-500">*</span>
          </label>

          <div className="flex gap-8">
            <label className="flex items-center gap-2 text-slate-700">
              <input
                type="radio"
                name="reported"
                checked={complaint.previouslyReported === true}
                onChange={() => updateComplaint("previouslyReported", true)}
                className="accent-green-600 w-4 h-4"
              />
              <span className="font-medium">Yes</span>
            </label>
            <label className="flex items-center gap-2 text-slate-700">
              <input
                type="radio"
                name="reported"
                checked={complaint.previouslyReported === false}
                onChange={() => updateComplaint("previouslyReported", false)}
                className="accent-green-600 w-4 h-4"
              />
              <span className="font-medium">No</span>
            </label>
          </div>

          {complaint.previouslyReported && (
            <div className="mt-6 p-5 bg-white border border-slate-200 rounded-xl space-y-4">
              <p className="text-sm text-slate-600 font-medium">Please provide details about the previous report:</p>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Reported to whom?
                </label>
                <input
                  type="text"
                  value={complaint.previousReportedTo}
                  onChange={(e) => updateComplaint("previousReportedTo", e.target.value)}
                  placeholder="Enter person or department name"
                  className="ui-input"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  What was the outcome?
                </label>
                <input
                  type="text"
                  value={complaint.previousReportOutcome}
                  onChange={(e) => updateComplaint("previousReportOutcome", e.target.value)}
                  placeholder="Enter outcome or current status"
                  className="ui-input"
                />
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Error Message */}
      {error && (

        <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4">

          <p className="text-sm text-red-700 leading-relaxed">

            {error}

          </p>

        </div>

      )}



      {/* Important Notice */}
      <div className="mt-8 bg-amber-50 border-l-4 border-amber-500 rounded-lg p-5">

        <p className="text-sm text-amber-900 leading-relaxed">

          <span className="font-semibold">⚠️ Important:</span> False or intentionally misleading submissions may be subject to internal disciplinary review.

        </p>

      </div>



      {/* Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Back Button */}
        <button
          onClick={() => navigate("/report")}
          className="w-full sm:w-auto border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold px-6 py-3 rounded-xl transition-all duration-300"
        >

          Back

        </button>


        <button
          onClick={handleContinue}
          className="w-full sm:w-auto bg-[#3e9638] hover:bg-[#31802c] text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
        >

          Next

        </button>

      </div>

    </div>

  );

};

export default ComplaintStep;