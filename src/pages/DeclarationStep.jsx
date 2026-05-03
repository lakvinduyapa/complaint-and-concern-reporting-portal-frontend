import { useState } from "react";
import { FaLock, FaExclamationTriangle } from "react-icons/fa";
import Stepper from "../components/Stepper";

export default function DeclarationStep({ nextStep, prevStep, data }) {
  const [confirm1, setConfirm1] = useState(false);
  const [confirm2, setConfirm2] = useState(false);

  // validation (NO captcha now)
  const isValid = confirm1 && confirm2;

  // submit handler
  const handleSubmit = () => {
    if (!isValid) return;

    console.log("FINAL SUBMISSION:", data);

    // send to backend here
    // axios.post("/api/complaint", data)

    nextStep(); // move to confirmation page
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
      <div className="max-w-4xl mx-auto py-10 px-4">

        <h2 className="text-2xl font-bold mb-1">
          Declaration & Finalize
        </h2>
        <p className="text-gray-500 mb-6">
          Please review final statement and confirm submission.
        </p>

        <Stepper currentStep={5} />

        <div className="bg-white rounded-2xl shadow-md p-8">

          {/* Declaration Box */}
          <div className="border rounded-xl p-4 mb-6 bg-gray-50">
            <h4 className="font-semibold mb-2">
              Official Declaration Statement
            </h4>

            <p className="text-sm text-gray-600 leading-relaxed">
              I hereby declare that the information provided in this report is,
              to the best of my knowledge and belief, true, correct, and complete.
              I understand that submitting a false report knowingly may result in
              disciplinary action or legal consequences.
              <br /><br />
              I acknowledge that the Internal Affairs Unit (IAU) will handle this
              information with the utmost confidentiality.
            </p>
          </div>

          {/* Checkbox 1 */}
          <label className="flex items-start gap-2 mb-4 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={confirm1}
              onChange={() => setConfirm1(!confirm1)}
            />
            I confirm that the information provided is accurate and I understand
            the implications of providing false information.
          </label>

          {/* Checkbox 2 */}
          <label className="flex items-start gap-2 mb-6 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={confirm2}
              onChange={() => setConfirm2(!confirm2)}
            />
            I consent to the processing of my data by the IAU as per the
            confidentiality policy.
          </label>

          {/* Security Notice */}
          <div className="bg-orange-50 border border-orange-200 text-orange-700 p-3 rounded text-sm mb-6 flex gap-2">
            <FaExclamationTriangle />
            Audit & Security Notice: All submissions are securely logged and monitored.
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              className="border px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              ← Previous Step
            </button>

            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className={`px-6 py-2 rounded-lg text-white ${
                isValid
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Finalize Submission →
            </button>
          </div>

          {/* Error message */}
          {!isValid && (
            <p className="text-red-500 text-xs mt-3 text-right">
              Please accept both declarations to continue
            </p>
          )}
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          SSL Encrypted • IAU Verified • GDPR Compliant
        </p>

      </div>
    </div>
  );
}