import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Stepper from "../../components/forms/Stepper";
import { useComplaint } from "../../hooks/useComplaint";

const EvidenceStep = () => {
  const navigate = useNavigate();
  const { complaintData, setComplaintData } = useComplaint();
  const [error, setError] = useState("");
  const { evidence } = complaintData;

  const evidenceOptions = [
    "Document",
    "Record",
    "Email or Communication",
    "Photograph",
    "Video",
    "Witness Testimony",
    "Financial Record",
    "Other"
  ];

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    const maxSizePerFile = 10 * 1024 * 1024;

    let validFiles = [];
    let validationError = "";

    if (selectedFiles.length > 5) {
      setError("You can upload up to 5 files maximum.");
      return;
    }

    for (let file of selectedFiles) {
      if (!allowedTypes.includes(file.type)) {
        validationError = `${file.name} is not allowed. Only PDF, DOCX, JPG, PNG accepted.`;
        break;
      }

      if (file.size > maxSizePerFile) {
        validationError = `${file.name} exceeds 10MB limit.`;
        break;
      }

      validFiles.push(file);
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setComplaintData((prev) => ({
      ...prev,
      evidence: {
        ...prev.evidence,
        files: validFiles
      }
    }));
  };

  const updateEvidence = (field, value) => {
    setComplaintData((prev) => ({
      ...prev,
      evidence: {
        ...prev.evidence,
        [field]: value
      }
    }));
  };

  const toggleEvidenceType = (type) => {
    const selected = evidence.evidenceTypes.includes(type);
    const nextTypes = selected
      ? evidence.evidenceTypes.filter((t) => t !== type)
      : [...evidence.evidenceTypes, type];

    setComplaintData((prev) => ({
      ...prev,
      evidence: {
        ...prev.evidence,
        evidenceTypes: nextTypes
      }
    }));
  };

  const handleContinue = () => {
    if (evidence.hasEvidence === null || evidence.hasEvidence === undefined) {
      setError("Please select whether you have supporting evidence.");
      return;
    }

    setError("");
    navigate("/report/declaration");
  };

  return (
    <div className="ui-card-strong p-6 md:p-10">

      <Stepper currentStep={4} />

      <div className="mb-8">
        <h2 className="ui-section-title">Supporting Evidence</h2>
        <p className="ui-subtitle mt-2">Provide any supporting documents or evidence related to your complaint.</p>
      </div>

      {/* Do you have supporting evidence? */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 md:p-8 border border-slate-200 mb-8">

        <label className="block text-sm font-semibold text-slate-700 mb-4">
          Do you have supporting evidence? <span className="text-red-500">*</span>
        </label>

        <div className="flex gap-8">
          <label className="flex items-center gap-2 text-slate-700">
            <input
              type="radio"
              name="hasEvidence"
              checked={evidence.hasEvidence === true}
              onChange={() => updateEvidence("hasEvidence", true)}
              className="accent-green-600 w-4 h-4"
            />
            <span>Yes</span>
          </label>

          <label className="flex items-center gap-2 text-slate-700">
            <input
              type="radio"
              name="hasEvidence"
              checked={evidence.hasEvidence === false}
              onChange={() => updateEvidence("hasEvidence", false)}
              className="accent-green-600 w-4 h-4"
            />
            <span>No</span>
          </label>
        </div>

      </div>

      {/* Conditional sections - Show only if Yes */}
      {evidence.hasEvidence && (
        <>
          {/* Evidence Type */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 md:p-8 border border-slate-200 mb-8">

            <label className="block text-sm font-semibold text-slate-700 mb-4">
              Evidence Type
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {evidenceOptions.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => toggleEvidenceType(type)}
                  className={`border rounded-lg py-2 px-3 text-sm font-medium transition-all ${
                    evidence.evidenceTypes.includes(type)
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-slate-300 text-slate-700 hover:border-green-500"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

          </div>

          {/* File Upload */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 md:p-8 border border-slate-200 mb-8">

            <label className="block text-sm font-semibold text-slate-700 mb-4">
              File Upload
            </label>

            <label className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:border-green-600 transition-all cursor-pointer block bg-white">

              <div className="flex flex-col items-center">

                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <span className="text-xl text-green-600">↑</span>
                </div>

                <h4 className="font-semibold text-slate-900 mb-1">Drag & Drop Files Here</h4>
                <p className="text-sm text-slate-500 mb-4">or click to browse</p>

                <span className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all">
                  Browse Files
                </span>

                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />

              </div>

            </label>

            <div className="mt-4 text-xs text-slate-600 space-y-2">
              <p><strong>Allowed:</strong> PDF, DOCX, JPG, PNG</p>
              <p><strong>Limits:</strong> Max 10MB per file. Up to 5 files.</p>
            </div>

            {evidence.files.length > 0 && (
              <div className="mt-4 bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">Selected ({evidence.files.length}):</p>
                <ul className="text-sm text-slate-600 space-y-1">
                  {evidence.files.map((file) => (
                    <li key={file.name}>• {file.name}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </>
      )}

      {/* Names of witness(es) */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 md:p-8 border border-slate-200 mb-8">

        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Names of witness(es)
        </label>

        <input
          type="text"
          value={evidence.witnessInfo}
          onChange={(e) => updateEvidence("witnessInfo", e.target.value)}
          placeholder="Enter witness names separated by comma (optional)"
          className="ui-input"
        />

        <p className="text-xs text-slate-500 mt-2">Multiple names separated by comma. Kept confidential.</p>

      </div>

      {/* Additional Information */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 md:p-8 border border-slate-200 mb-8">

        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Additional Information
        </label>

        <textarea
          rows="4"
          value={evidence.additionalNotes}
          onChange={(e) => updateEvidence("additionalNotes", e.target.value)}
          placeholder="Any other context or related information (optional)"
          className="ui-textarea resize-none"
        />

      </div>

      {/* Error */}
      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="mt-10 flex items-center justify-between">

        <button
          onClick={() => navigate("/report/subject-information")}
          className="px-6 py-3 rounded-xl font-semibold border border-green-600 text-green-600 hover:bg-green-50 transition-all"
        >
          Back
        </button>

        <button
          onClick={handleContinue}
          className="px-8 py-3 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
        >
          Next
        </button>

      </div>

    </div>
  );
};

export default EvidenceStep;
