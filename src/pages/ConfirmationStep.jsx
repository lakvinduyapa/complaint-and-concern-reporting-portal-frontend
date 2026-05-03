import { useState } from "react";
import { FaLock, FaCheckCircle, FaCopy } from "react-icons/fa";
import Stepper from "../components/Stepper";

export default function ConfirmationStep({ data, crn }) {
  const [copied, setCopied] = useState(false);

  const copyCRN = () => {
    if (!crn) return;

    navigator.clipboard.writeText(crn);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    window.location.reload(); // simple reset
  };

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

        <div className="text-xs text-blue-500 bg-blue-100 px-3 py-1 rounded-full">
          LIVE PROTECTION
        </div>
      </div>

      {/* Container */}
      <div className="max-w-4xl mx-auto py-10 px-4 text-center">

        <Stepper currentStep={6} />

        <div className="bg-white rounded-2xl shadow-md p-8">

          {/* Success Icon */}
          <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />

          <h2 className="text-2xl font-bold mb-2">
            Report Submitted Successfully
          </h2>

          <p className="text-gray-500 mb-6">
            Your report has been securely transmitted to the Internal Affairs Unit.
          </p>

          {/* CRN */}
          <div className="border-2 border-dashed border-blue-300 p-6 rounded-xl mb-6">
            <p className="text-sm text-blue-500 mb-2">
              COMPLAINT REFERENCE NUMBER (CRN)
            </p>

            <div className="flex justify-center items-center gap-3">
              <h3 className="text-2xl font-bold">
                {crn || "Generating..."}
              </h3>

              <FaCopy
                className="cursor-pointer text-gray-500 hover:text-black"
                onClick={copyCRN}
              />
            </div>

            <p className="text-xs text-gray-400 mt-2">
              {copied
                ? "Copied to clipboard!"
                : "Please save this number to track your complaint"}
            </p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-left mb-6">

            <div className="border p-3 rounded">
              <p className="text-xs text-gray-400">Submission Date</p>
              <p>{new Date().toDateString()}</p>
            </div>

            <div className="border p-3 rounded">
              <p className="text-xs text-gray-400">Report Type</p>
              <p>{data?.submission_type || "-"}</p>
            </div>

            <div className="border p-3 rounded">
              <p className="text-xs text-gray-400">Category</p>
              <p>{data?.complaint_category || "-"}</p>
            </div>

            <div className="border p-3 rounded">
              <p className="text-xs text-gray-400">Evidence</p>
              <p>{data?.evidence_file ? "1 File" : "0 Files"}</p>
            </div>

          </div>

          {/* Button */}
          <button
            onClick={handleReset}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Return to Home →
          </button>

        </div>
      </div>
    </div>
  );
}