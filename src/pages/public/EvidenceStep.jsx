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
    { label: "Document", value: "Document" },
    { label: "Record", value: "Record" },
    { label: "Email or Communication", value: "Email or Communication" },
    { label: "Photograph", value: "Photograph" },
    { label: "Video", value: "Video" },
    { label: "Witness Testimony", value: "Witness Testimony" },
    { label: "Financial Record", value: "Financial Record" },
    { label: "Other", value: "Other" }
  ];

  const toggleEvidenceType = (item) => {

    const selected = evidence.evidenceTypes.includes(item);
    const nextTypes = selected
      ? evidence.evidenceTypes.filter((type) => type !== item)
      : [...evidence.evidenceTypes, item];

    setComplaintData((prev) => ({
      ...prev,
      evidence: {
        ...prev.evidence,
        evidenceTypes: nextTypes
      }
    }));

  };

  const handleFileChange = (event) => {

    const selectedFiles = Array.from(event.target.files || []);

    setComplaintData((prev) => ({
      ...prev,
      evidence: {
        ...prev.evidence,
        files: selectedFiles
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

  const handleContinue = () => {

    if (evidence.files.length > 5) {
      setError("You can upload up to 5 files.");
      return;
    }

    setError("");
    navigate("/declaration");

  };

  return (

    <div className="ui-card-strong p-6 md:p-10">

      {/* Stepper */}
      <Stepper currentStep={4} />


      {/* Header */}
      <div className="mb-8">

        <h2 className="ui-section-title">

          Supporting Evidence

        </h2>

        <p className="ui-subtitle mt-2">

          Upload any supporting evidence related to the complaint.

        </p>

      </div>



      {/* Evidence Type */}
      <div className="mb-8">

          <label className="block text-sm font-semibold text-slate-700 mb-4">

          Evidence Type

        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {evidenceOptions.map((item) => (

            <button
              type="button"
              key={item.value}
              onClick={() => toggleEvidenceType(item.value)}
              className={`border rounded-xl py-4 px-3 text-sm font-medium transition-all ${
                evidence.evidenceTypes.includes(item.value)
                  ? "border-cyan-500 bg-cyan-50 text-cyan-600"
                  : "border-slate-300 text-slate-700 hover:border-cyan-500 hover:bg-cyan-50"
              }`}
            >

              {item.label}

            </button>

          ))}

        </div>

      </div>



      {/* Upload Area */}
      <label className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:border-cyan-500 transition-all cursor-pointer block bg-transparent">

        <div className="flex flex-col items-center">

          <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center mb-4">

            <span className="text-2xl text-cyan-500">

              ↑

            </span>

          </div>

          <h3 className="text-lg font-bold text-slate-900">

            Drag & Drop Files Here

          </h3>

          <p className="text-slate-500 mt-2">

            or click to browse evidence files

          </p>

          <span className="mt-5 inline-block ui-button-primary px-6 py-3">

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

      {evidence.files.length > 0 && (

        <div className="mt-4 bg-cyan-50 border border-cyan-200 rounded-xl p-4">

          <p className="text-sm font-semibold text-cyan-600 mb-2">

            Selected Files ({evidence.files.length})

          </p>

          <ul className="text-sm text-slate-700 space-y-1">

            {evidence.files.map((file) => (

              <li key={file.name}>

                {file.name}

              </li>

            ))}

          </ul>

        </div>

      )}



      {/* Upload Rules */}
      <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-5">

          <h4 className="font-semibold text-slate-900 mb-3">

          Accepted File Types

        </h4>

        <div className="flex flex-wrap gap-3">

          <span className="bg-white border border-slate-200 px-3 py-1 rounded-full text-sm text-slate-700">

            PDF

          </span>

          <span className="bg-white border px-3 py-1 rounded-full text-sm text-gray-700">

            DOCX

          </span>

          <span className="bg-white border px-3 py-1 rounded-full text-sm text-gray-700">

            JPG

          </span>

          <span className="bg-white border px-3 py-1 rounded-full text-sm text-gray-700">

            PNG

          </span>

          <span className="bg-white border px-3 py-1 rounded-full text-sm text-gray-700">

            MP4

          </span>

        </div>

        <p className="text-sm text-gray-500 mt-4">

          Maximum upload size: 10MB per file

        </p>

      </div>



      {/* Witness Information */}
      <div className="mt-8">

          <label className="block text-sm font-semibold text-slate-700 mb-2">

          Witness Information (Optional)

        </label>

        <textarea
          rows="4"
          value={evidence.witnessInfo}
          onChange={(e) => updateEvidence("witnessInfo", e.target.value)}
          placeholder="Provide names or details of witnesses if available..."
          className="ui-textarea resize-none"
        />

      </div>



      {/* Additional Notes */}
      <div className="mt-6">

          <label className="block text-sm font-semibold text-slate-700 mb-2">

          Additional Notes

        </label>

        <textarea
          rows="4"
          value={evidence.additionalNotes}
          onChange={(e) => updateEvidence("additionalNotes", e.target.value)}
          placeholder="Add any additional evidence-related information..."
          className="ui-textarea resize-none"
        />

      </div>



      {/* Security Notice */}
      <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-4">

        <p className="text-sm text-green-700">

          All uploaded evidence is encrypted and securely stored for
          investigation purposes only.

        </p>

      </div>

      {error && (

        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">

          <p className="text-sm text-red-700">

            {error}

          </p>

        </div>

      )}



      {/* Buttons */}
      <div className="mt-10 flex items-center justify-between">

        {/* Back */}
        <button
          onClick={() => navigate("/subject-information")}
          className="ui-button-secondary px-6 py-3"
        >

          Back

        </button>



        {/* Continue */}
        <button
          onClick={handleContinue}
          className="ui-button-primary px-8 py-3"
        >

          Continue

        </button>

      </div>

    </div>

  );

};

export default EvidenceStep;