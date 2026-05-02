import { FaLock, FaCalendarAlt, FaInfoCircle, FaClock } from "react-icons/fa";
import Stepper from "../components/Stepper";

export default function ComplaintStep({ nextStep, prevStep }) {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <FaLock />
          Secure Portal
        </div>

        <div className="flex gap-3 text-xs">
          <span className="text-blue-600 font-semibold">
            IAU Complaint Reporting Portal
          </span>
          <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full">
            LIVE PROTECTION
          </span>
        </div>
      </div>

      {/* Container */}
      <div className="max-w-5xl mx-auto py-10 px-4">

        <h2 className="text-2xl font-bold mb-1">
          Complaint Details
        </h2>
        <p className="text-gray-500 mb-6">
          Please provide comprehensive information regarding the incident you are reporting.
        </p>

        {/* Stepper */}
        <Stepper currentStep={2} />

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md p-8">

          {/* Top Info */}
          <div className="bg-blue-50 border border-blue-200 text-blue-600 p-4 rounded-lg mb-6 text-sm">
            No login required. Your submission is confidential and protected by high-level encryption.
          </div>

          {/* SECTION 1 */}
          <h3 className="text-lg font-semibold mb-4">
            Step 2: Nature of Incident
          </h3>

          {/* Classification */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2 text-gray-700 font-semibold">
              <FaInfoCircle className="text-blue-500" />
              Classification
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select className="border rounded-lg p-2">
                <option>Select a category</option>
                <option>Fraud</option>
                <option>Corruption</option>
                <option>Harassment</option>
              </select>

              <select className="border rounded-lg p-2">
                <option>One-time Incident</option>
                <option>Repeated</option>
                <option>Ongoing</option>
              </select>
            </div>
          </div>

          {/* Time & Location */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2 text-gray-700 font-semibold">
              <FaCalendarAlt className="text-blue-500" />
              Time & Location
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input type="date" className="border rounded-lg p-2" />
              <input
                placeholder="e.g. Head Office, 4th Floor"
                className="border rounded-lg p-2"
              />
            </div>
          </div>

          {/* Narrative */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">
              Detailed Narrative
            </h4>

            <textarea
              rows="5"
              placeholder="Provide names, dates, amounts, or any specific details..."
              className="w-full border rounded-lg p-3"
            />

            <p className="text-xs text-gray-400 mt-1">
              Focus on facts: who, what, when, and how.
            </p>
          </div>

          {/* Awareness */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2 text-gray-700 font-semibold">
              <FaClock className="text-blue-500" />
              Awareness & History
            </div>

            <p className="text-sm mb-3">
              How did you become aware of this incident?
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <label><input type="radio" name="aware" /> Direct Observation</label>
              <label><input type="radio" name="aware" /> Informed by third-party</label>
              <label><input type="radio" name="aware" /> Discovered via records/files</label>
              <label><input type="radio" name="aware" /> Other means</label>
            </div>

            <p className="text-sm mt-4">
              Has this matter been reported before?
            </p>

            <div className="flex gap-4 mt-2 text-sm">
              <label><input type="radio" name="reported" /> Yes</label>
              <label><input type="radio" name="reported" /> No</label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={prevStep}
              className="border px-4 py-2 rounded-lg"
            >
              ← Previous Step
            </button>

            <button
              onClick={nextStep}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Continue →
            </button>
          </div>

        </div>

        {/* Bottom */}
        <p className="text-xs text-gray-400 text-center mt-6">
          © 2026 SLT Mobitel Internal Affairs Unit. All rights reserved.
        </p>

      </div>
    </div>
  );
}