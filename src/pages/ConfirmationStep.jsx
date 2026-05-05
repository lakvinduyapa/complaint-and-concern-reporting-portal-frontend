import { useState } from "react";
import { FaLock, FaCheckCircle, FaCopy } from "react-icons/fa";
import Stepper from "../components/Stepper";

export default function ConfirmationStep({ data, crn }) {
  const [copied, setCopied] = useState(false);

  const copyCRN = async () => {
    if (!crn) return;

    try {
      await navigator.clipboard.writeText(crn);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Failed to copy CRN");
    }
  };

  const handleReset = () => {
    // simple reset (keep for now)
    window.location.reload();
  };

  const fileCount = data?.evidenceData?.files?.length || 0;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <FaLock /> Secure Portal
        </div>

        <div className="text-blue-600 font-semibold text-sm">
          IAU Complaint Reporting Portal
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-10 px-4 text-center">

        <Stepper currentStep={6} />

        <div className="bg-white rounded-2xl shadow-md p-8">

          {/* Success */}
          <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />

          <h2 className="text-2xl font-bold mb-2">
            Report Submitted Successfully
          </h2>

          <p className="text-gray-500 mb-6">
            Your report has been securely submitted.
          </p>

          {/* CRN */}
          <div className="border-2 border-dashed border-blue-300 p-6 rounded-xl mb-6">
            <p className="text-sm text-blue-500 mb-2">
              COMPLAINT REFERENCE NUMBER (CRN)
            </p>

            <div className="flex justify-center items-center gap-3">
              <h3 className="text-2xl font-bold">
                {crn ? crn : "Generating..."}
              </h3>

              <FaCopy
                className="cursor-pointer"
                onClick={copyCRN}
              />
            </div>

            <p className="text-xs mt-2">
              {copied
                ? "Copied!"
                : "Save this number to track your complaint"}
            </p>
          </div>

          {/* DETAILS */}
          <div className="grid grid-cols-2 gap-4 text-left mb-6">

            <div className="border p-3 rounded">
              <p className="text-xs text-gray-400">Submission Date</p>
              <p>{new Date().toDateString()}</p>
            </div>

            <div className="border p-3 rounded">
              <p className="text-xs text-gray-400">Report Type</p>
              <p>{data?.userData?.submissionType || "-"}</p>
            </div>

            <div className="border p-3 rounded">
              <p className="text-xs text-gray-400">Category</p>
              <p>{data?.complaintData?.complaintCategory || "-"}</p>
            </div>

            <div className="border p-3 rounded">
              <p className="text-xs text-gray-400">Evidence</p>
              <p>
                {fileCount > 0
                  ? `${fileCount} File${fileCount > 1 ? "s" : ""}`
                  : "No Files"}
              </p>
            </div>

          </div>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            Return to Home →
          </button>

        </div>
      </div>
    </div>
  );
}