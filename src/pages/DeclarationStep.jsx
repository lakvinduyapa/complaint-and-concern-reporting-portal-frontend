import { useState } from "react";
import { FaLock, FaExclamationTriangle } from "react-icons/fa";
import Stepper from "../components/Stepper";
import axios from "axios";

const API_URL = "http://localhost:5000/api/complaints/full-submit";

export default function DeclarationStep({ nextStep, prevStep, data, setCrn }) {

  const [confirm1, setConfirm1] = useState(false);
  const [confirm2, setConfirm2] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = confirm1 && confirm2;

  const handleSubmit = async () => {
    if (!isValid) return;

    try {
      setLoading(true);

      const formData = new FormData();

      // SAFE DATA EXTRACTION
      const userData = data.userData || {};
      const complaintDataRaw = data.complaintData || {};
      const subjectData = data.subjectData || {};
      const evidenceRaw = data.evidenceData || {};

      //  FIX complaint data
      const complaintData = {
        ...complaintDataRaw,
        previousReportDetails:
          complaintDataRaw.reportedPreviously === "Yes"
            ? complaintDataRaw.previousReportDetails || ""
            : "",
      };

      // FINAL VALIDATION (important)
      if (!complaintData.complaintCategory) {
        alert("Complaint data missing");
        setLoading(false);
        return;
      }

      if (
        complaintData.reportedPreviously === "Yes" &&
        !complaintData.previousReportDetails
      ) {
        alert("Please provide previous report details");
        setLoading(false);
        return;
      }

      //  FIX evidence data (FULL MODEL MATCH)
      const evidenceData = {
        hasEvidence: evidenceRaw.hasEvidence || "No",
        evidenceType: evidenceRaw.evidenceType || [],
        witnessNames: evidenceRaw.witnessNames || [],
        additionalInfo: evidenceRaw.additionalInfo || "",
      };

      // APPEND JSON DATA
      formData.append("userData", JSON.stringify(userData));
      formData.append("complaintData", JSON.stringify(complaintData));
      formData.append("subjectData", JSON.stringify(subjectData));
      formData.append("evidenceData", JSON.stringify(evidenceData));

      //  MULTIPLE FILE SUPPORT
      if (evidenceRaw.files?.length > 0) {
        evidenceRaw.files.forEach((file) => {
          formData.append("files", file);
        });
      }

      //  DEBUG (very useful)
      const debugData = {};
      formData.forEach((value, key) => {
        debugData[key] = value;
      });
      console.log("FINAL SUBMIT DATA:", debugData);

      //  API CALL
      const res = await axios.post(API_URL, formData);

      //  SAVE CRN
      if (setCrn) {
        setCrn(res.data.crn);
      }

      nextStep();

    } catch (err) {
      console.error("SUBMIT ERROR:", err);
      alert(err.response?.data?.error || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <FaLock /> Secure Portal
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-10 px-4">

        <h2 className="text-2xl font-bold mb-1">
          Declaration & Finalize
        </h2>

        <Stepper currentStep={5} />

        <div className="bg-white rounded-2xl shadow-md p-8">

          {/* Declaration */}
          <div className="border rounded-xl p-4 mb-6 bg-gray-50">
            <h4 className="font-semibold mb-2">
              Official Declaration Statement
            </h4>
            <p className="text-sm text-gray-600">
              I confirm all details are true and accurate.
            </p>
          </div>

          {/* Checkboxes */}
          <label className="flex gap-2 mb-4">
            <input
              type="checkbox"
              checked={confirm1}
              onChange={() => setConfirm1(!confirm1)}
            />
            Confirm accuracy
          </label>

          <label className="flex gap-2 mb-6">
            <input
              type="checkbox"
              checked={confirm2}
              onChange={() => setConfirm2(!confirm2)}
            />
            Consent processing
          </label>

          {/* Warning */}
          <div className="bg-orange-50 border p-3 rounded mb-6 flex gap-2">
            <FaExclamationTriangle />
            Logged securely
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button onClick={prevStep} className="border px-4 py-2 rounded">
              ← Previous
            </button>

            <button
              onClick={handleSubmit}
              disabled={!isValid || loading}
              className="bg-blue-500 text-white px-6 py-2 rounded"
            >
              {loading ? "Submitting..." : "Finalize Submission →"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}