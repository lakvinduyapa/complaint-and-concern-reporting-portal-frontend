import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Stepper from "../../components/forms/Stepper";
import { useComplaint } from "../../hooks/useComplaint";


const ComplaintStep = () => {

  const navigate = useNavigate();
  const { complaintData, setComplaintData } = useComplaint();
  const [error, setError] = useState("");
  const { complaint } = complaintData;

  const updateComplaint = (field, value) => {

    setComplaintData((prev) => ({
      ...prev,
      complaint: {
        ...prev.complaint,
        [field]: value
      }
    }));

  };

  const handleContinue = () => {

    if (!complaint.category) {
      setError("Please select a complaint category.");
      return;
    }

    if (!complaint.description || complaint.description.trim().length < 50) {
      setError("Incident description must be at least 50 characters.");
      return;
    }

    setError("");
    navigate("/subject-information");

  };

  return (

    <div className="ui-card-strong p-6 md:p-10">

      {/* Stepper */}
      <Stepper currentStep={2} />


      {/* Header */}
      <div className="mb-8">

        <h2 className="ui-section-title">

          Complaint Details

        </h2>

        <p className="ui-subtitle mt-2">

          Provide detailed information regarding the incident or concern.

        </p>

      </div>



      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Complaint Category */}
        <div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Complaint Category

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
            <option value="Procurement Irregularity">Procurement Irregularity</option>
            <option value="Harassment">Harassment</option>
            <option value="Confidentiality Breach">Confidentiality Breach</option>
            <option value="Other Malpractice">Other Malpractice</option>

          </select>

        </div>



        {/* Incident Date */}
        <div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Incident Date

          </label>

          <input
            type="date"
            value={complaint.incidentDate}
            onChange={(e) => updateComplaint("incidentDate", e.target.value)}
            className="ui-input"
          />

        </div>



        {/* Incident Location */}
        <div className="md:col-span-2">

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Incident Location

          </label>

          <input
            type="text"
            value={complaint.incidentLocation}
            onChange={(e) => updateComplaint("incidentLocation", e.target.value)}
            placeholder="Enter incident location"
            className="ui-input"
          />

        </div>



        {/* Frequency */}
        <div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Frequency

          </label>

          <select
            value={complaint.frequency}
            onChange={(e) => updateComplaint("frequency", e.target.value)}
            className="ui-select"
          >

            <option value="">Select Frequency</option>
            <option value="One-time incident">One-time incident</option>
            <option value="Repeated incident">Repeated incident</option>
            <option value="Ongoing">Ongoing</option>

          </select>

        </div>



        {/* Awareness Method */}
        <div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            How did you become aware?

          </label>

          <select
            value={complaint.awarenessMethod}
            onChange={(e) => updateComplaint("awarenessMethod", e.target.value)}
            className="ui-select"
          >

            <option value="">Select Method</option>
            <option value="Direct Witness">Direct Witness</option>
            <option value="Indirect Knowledge">Indirect Knowledge</option>
            <option value="Documentation Review">Documentation Review</option>
            <option value="Third-party Information">Third-party Information</option>

          </select>

        </div>



        {/* Description */}
        <div className="md:col-span-2">

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Incident Description

          </label>

          <textarea
            rows="6"
            value={complaint.description}
            onChange={(e) => updateComplaint("description", e.target.value)}
            placeholder="Provide a detailed description of the incident..."
            className="ui-textarea resize-none"
          />

          <p className="text-sm text-slate-400 mt-2">

            Include relevant names, actions, dates, and circumstances.

          </p>

        </div>



        {/* Previously Reported */}
        <div className="md:col-span-2">

          <label className="block text-sm font-semibold text-slate-700 mb-4">

            Has this matter been reported previously?

          </label>

          <div className="flex items-center gap-6">

            <label className="flex items-center gap-2 text-slate-700">

              <input
                type="radio"
                name="reported"
                checked={complaint.previouslyReported === true}
                onChange={() => updateComplaint("previouslyReported", true)}
              />

              Yes

            </label>

            <label className="flex items-center gap-2 text-slate-700">

              <input
                type="radio"
                name="reported"
                checked={complaint.previouslyReported === false}
                onChange={() => updateComplaint("previouslyReported", false)}
              />

              No

            </label>

          </div>

        </div>

      </div>

      {complaint.previouslyReported && (

        <div className="mt-6">

          <label className="block text-sm font-semibold text-gray-700 mb-2">

            Previous Report Details

          </label>

          <textarea
            rows="3"
            value={complaint.previousReportDetails}
            onChange={(e) => updateComplaint("previousReportDetails", e.target.value)}
            placeholder="Where and when was this reported before?"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

        </div>

      )}

      {error && (

        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">

          <p className="text-sm text-red-700">

            {error}

          </p>

        </div>

      )}



      {/* Compliance Notice */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">

        <p className="text-sm text-yellow-700">

          False or intentionally misleading submissions may be subject to
          internal disciplinary review.

        </p>

      </div>



      {/* Buttons */}
      <div className="mt-10 flex items-center justify-between">

        <button 
          onClick={() => navigate("/")}
          className="ui-button-secondary px-6 py-3">

          Back

        </button>

        <button 
          onClick={handleContinue}
          className="ui-button-primary px-8 py-3">

          Continue

        </button>

      </div>

    </div>

  );

};

export default ComplaintStep;