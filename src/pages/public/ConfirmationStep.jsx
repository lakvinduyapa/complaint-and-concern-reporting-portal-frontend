import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Stepper from "../../components/forms/Stepper";
import { useComplaint } from "../../hooks/useComplaint";


const ConfirmationStep = () => {

  const navigate = useNavigate();
  const { submissionResult, complaintData } = useComplaint();
  const [copied, setCopied] = useState(false);

  useEffect(() => {

    if (!submissionResult?.data?.crn) {
      navigate("/");
    }

  }, [submissionResult, navigate]);

  const crn = submissionResult?.data?.crn || "N/A";
  const status = submissionResult?.data?.status || "Submitted";
  const submittedAt = submissionResult?.data?.submittedAt
    ? new Date(submissionResult.data.submittedAt).toLocaleDateString()
    : new Date().toLocaleDateString();
  const category = submissionResult?.data?.category || complaintData?.complaint?.category || "N/A";
  const uploadSummary = submissionResult?.uploadSummary;

  const handleCopy = async () => {

    if (!crn || crn === "N/A") {
      return;
    }

    try {
      await navigator.clipboard.writeText(crn);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }

  };

  return (

    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">

      {/* Stepper */}
      <Stepper currentStep={6} />


      {/* Success Content */}
      <div className="flex flex-col items-center text-center">

        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">

          <span className="text-5xl text-green-600">

            ✓

          </span>

        </div>



        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">

          Report Submitted Successfully

        </h2>

        <p className="text-gray-500 mt-3 max-w-2xl">

          Your complaint has been securely submitted to the Internal Affairs
          Unit (IAU). Please save your Complaint Reference Number (CRN)
          for future tracking.

        </p>

      </div>

      {uploadSummary?.failed?.length > 0 && (

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-5">

          <h4 className="font-semibold text-yellow-800 mb-2">

            Evidence Upload Notice

          </h4>

          <p className="text-sm text-yellow-700">

            Complaint submitted successfully. {uploadSummary.uploaded} of {uploadSummary.attempted} evidence files uploaded.

          </p>

          <ul className="mt-2 text-sm text-yellow-800 list-disc pl-5">

            {uploadSummary.failed.map((item) => (

              <li key={item.fileName}>

                {item.fileName}: {item.message}

              </li>

            ))}

          </ul>

        </div>

      )}



      {/* CRN Card */}
      <div className="mt-10 border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center bg-blue-50">

        <p className="text-sm font-semibold text-blue-700 mb-3">

          COMPLAINT REFERENCE NUMBER (CRN)

        </p>

        <h3 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-wide">

          {crn}

        </h3>

        <button
          onClick={handleCopy}
          className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
        >

          {copied ? "Copied" : "Copy CRN"}

        </button>

      </div>



      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">

        {/* Submission Date */}
        <div className="border border-gray-200 rounded-2xl p-5">

          <p className="text-sm text-gray-500 mb-2">

            Submission Date

          </p>

          <h4 className="font-bold text-gray-800">

            {submittedAt}

          </h4>

        </div>



        {/* Category */}
        <div className="border border-gray-200 rounded-2xl p-5">

          <p className="text-sm text-gray-500 mb-2">

            Complaint Category

          </p>

          <h4 className="font-bold text-gray-800">

            {category}

          </h4>

        </div>



        {/* Status */}
        <div className="border border-gray-200 rounded-2xl p-5">

          <p className="text-sm text-gray-500 mb-2">

            Current Status

          </p>

          <h4 className="font-bold text-blue-600">

            {status}

          </h4>

        </div>

      </div>



      {/* Tracking Instructions */}
      <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">

        <h3 className="text-lg font-bold text-gray-800 mb-3">

          Complaint Tracking

        </h3>

        <p className="text-gray-600 leading-relaxed">

          You may track the progress of your complaint using the Complaint
          Reference Number (CRN) through the complaint tracking portal.
          Status updates will be available once the complaint enters the
          review process.

        </p>

      </div>



      {/* Confidentiality Notice */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-5">

        <h4 className="font-semibold text-green-800 mb-2">

          Confidentiality Assurance

        </h4>

        <p className="text-sm text-green-700">

          Your submission is securely stored and only accessible to authorized
          Internal Affairs Unit personnel involved in the investigation process.

        </p>

      </div>



      {/* Actions */}
      <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4">

        {/* Track Complaint */}
        <button
          onClick={() => navigate("/track-complaint")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all"
        >

          Track Complaint

        </button>



        {/* Return Home */}
        <button
          onClick={() => navigate("/")}
          className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold transition-all"
        >

          Return Home

        </button>

      </div>

    </div>

  );

};

export default ConfirmationStep;