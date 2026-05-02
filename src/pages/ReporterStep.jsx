import { useState } from "react";
import {
  FaUser,
  FaUserSecret,
  FaLock,
  FaShieldAlt,
  FaClock,
} from "react-icons/fa";
import Stepper from "../components/Stepper";

export default function ReporterStep() {
  const [isAnonymous, setIsAnonymous] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <FaLock />
          Secure Portal
        </div>

        <div className="flex gap-3 text-xs">
          <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full">
            CONFIDENTIAL
          </span>
          <span className="text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            AUTO-SAVING
          </span>
        </div>
      </div>

      {/* Container */}
      <div className="max-w-5xl mx-auto py-10 px-4">

        {/* Title */}
        <h2 className="text-2xl font-bold mb-1">
          Step 1: Reporter Details
        </h2>
        <p className="text-gray-500 mb-6">
          Start by identifying yourself or choose to remain anonymous.
        </p>

        {/* Stepper */}
        <Stepper currentStep={1} />

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md p-8">

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 text-blue-600 p-4 rounded-lg mb-6 text-sm">
            No login required. Your submission is confidential and protected by high-level encryption.
          </div>

          {/* Identity */}
          <h3 className="text-sm font-semibold text-gray-500 mb-3">
            REPORTING IDENTITY
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-6">

            {/* Named */}
            <div
              onClick={() => setIsAnonymous(false)}
              className={`rounded-xl p-5 text-center cursor-pointer transition ${
                !isAnonymous
                  ? "border-2 border-blue-500 bg-blue-50 shadow"
                  : "border hover:shadow"
              }`}
            >
              <FaUser className={`mx-auto text-lg mb-2 ${
                !isAnonymous ? "text-blue-500" : "text-gray-400"
              }`} />
              <p className="font-semibold">Named Reporting</p>
              <p className="text-xs text-gray-500">
                Provide your details for follow-up and protection.
              </p>
            </div>

            {/* Anonymous */}
            <div
              onClick={() => setIsAnonymous(true)}
              className={`rounded-xl p-5 text-center cursor-pointer transition ${
                isAnonymous
                  ? "border-2 border-blue-500 bg-blue-50 shadow"
                  : "border hover:shadow"
              }`}
            >
              <FaUserSecret className={`mx-auto text-lg mb-2 ${
                isAnonymous ? "text-blue-500" : "text-gray-400"
              }`} />
              <p className="font-semibold">Anonymous Reporting</p>
              <p className="text-xs text-gray-500">
                No personal identification required.
              </p>
            </div>

          </div>

          {/* 🔥 Anonymous Notice */}
          {isAnonymous && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 rounded mb-6 text-sm">
              You are submitting anonymously. No personal details will be collected.
            </div>
          )}

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1">
              Reporter Category *
            </label>
            <select className="w-full border rounded-lg p-2 text-sm">
              <option>Permanent Employee</option>
              <option>Contract Employee</option>
              <option>External Party</option>
            </select>
          </div>

          {/* 🔥 HIDE THIS WHEN ANONYMOUS */}
          {!isAnonymous && (
            <>
              {/* Professional */}
              <h3 className="text-sm font-semibold text-gray-500 mb-3">
                PROFESSIONAL IDENTITY
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <input placeholder="Full Name *" className="input" />
                <input placeholder="Employee ID" className="input" />
                <input placeholder="Department *" className="input" />
                <input placeholder="Designation *" className="input" />
              </div>

              {/* Contact */}
              <h3 className="text-sm font-semibold text-gray-500 mb-3">
                CONTACT INFORMATION
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <input placeholder="Email Address *" className="input" />
                <input placeholder="Phone Number *" className="input" />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-1">
                  Preferred Contact Method *
                </label>
                <select className="w-full border rounded-lg p-2 text-sm">
                  <option>Email</option>
                  <option>Phone</option>
                </select>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <FaLock /> Your progress is automatically saved
            </p>

            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow">
              Continue to Details →
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="grid grid-cols-3 text-center mt-10 text-gray-600 text-sm">
          <div className="flex flex-col items-center gap-1">
            <FaLock />
            <p>Data Privacy</p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <FaShieldAlt />
            <p>Anti-Retaliation</p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <FaClock />
            <p>24/7 Monitoring</p>
          </div>
        </div>

      </div>
    </div>
  );
}