import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Stepper from "../../components/forms/Stepper";
import { useComplaint } from "../../hooks/useComplaint";
import { submitComplaint } from "../../services/complaintService";
import { uploadEvidence } from "../../services/uploadService";


const DeclarationStep = () => {

  const navigate = useNavigate();
  const { complaintData, setComplaintData, setSubmissionResult, resetComplaintDraft } = useComplaint();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadWarning, setUploadWarning] = useState("");
  const { declaration } = complaintData;

  const updateDeclaration = (field, value) => {

    setComplaintData((prev) => ({
      ...prev,
      declaration: {
        ...prev.declaration,
        [field]: value
      }
    }));

  };

  const handleFinalize = async () => {

    setError("");
    setUploadWarning("");

    if (!declaration.truthful || !declaration.consent || !declaration.auditAcknowledgement) {
      setError("Please accept all declarations before submission.");
      return;
    }

    if (!complaintData.complaint.category) {
      setError("Complaint category is required.");
      return;
    }

    if (!complaintData.complaint.description || complaintData.complaint.description.trim().length < 50) {
      setError("Incident description must be at least 50 characters.");
      return;
    }

    if (!complaintData.subjects[0]?.fullName?.trim()) {
      setError("At least one subject full name is required.");
      return;
    }

    const sanitizedSubjects = complaintData.subjects
      .map((subject) => ({
        fullName: (subject.fullName || "").trim(),
        designation: subject.designation,
        organisation: subject.organization,
        relationship: subject.relationship
      }))
      .filter((subject) => subject.fullName);

    if (!sanitizedSubjects.length) {
      setError("At least one subject full name is required.");
      return;
    }

    const payload = {
      category: complaintData.complaint.category,
      incidentDate: complaintData.complaint.incidentDate || null,
      incidentLocation: complaintData.complaint.incidentLocation,
      frequency: complaintData.complaint.frequency || null,
      awarenessMethod: complaintData.complaint.awarenessMethod,
      description: complaintData.complaint.description,
      previouslyReported: complaintData.complaint.previouslyReported,
      previousReportDetails: complaintData.complaint.previousReportDetails,
      reporter: {
        submissionType: complaintData.reporter.submissionType,
        fullName: complaintData.reporter.fullName,
        email: complaintData.reporter.email,
        phone: complaintData.reporter.phone,
        preferredContactMethod: complaintData.reporter.preferredContact || "none"
      },
      subjects: sanitizedSubjects
    };

    try {

      setSubmitting(true);

      const response = await submitComplaint(payload);
      const complaintId = response?.data?.complaintId;

      const evidenceFiles = complaintData.evidence.files || [];
      const uploadSummary = {
        attempted: evidenceFiles.length,
        uploaded: 0,
        failed: []
      };

      if (complaintId && evidenceFiles.length > 0) {

        const evidenceType = complaintData.evidence.evidenceTypes[0] || "Other";
        const notes = [
          complaintData.evidence.witnessInfo,
          complaintData.evidence.additionalNotes
        ].filter(Boolean).join(" | ");

        for (const file of evidenceFiles) {
          try {
            const formData = new FormData();
            formData.append("complaintId", complaintId);
            formData.append("evidenceType", evidenceType);
            formData.append("notes", notes);
            formData.append("file", file);
            await uploadEvidence(formData);
            uploadSummary.uploaded += 1;
          } catch (uploadError) {
            uploadSummary.failed.push({
              fileName: file.name,
              message: uploadError?.message || "Upload failed"
            });
            setUploadWarning("Complaint submitted, but one or more evidence files could not be uploaded.");
          }
        }

      }

      setSubmissionResult({
        ...response,
        data: {
          ...response?.data,
          category: complaintData.complaint.category
        },
        uploadSummary
      });

      resetComplaintDraft();
      navigate("/confirmation");

    } catch (err) {

      setError(err?.message || "Failed to submit complaint");

    } finally {

      setSubmitting(false);

    }

  };

  return (

    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">

      {/* Stepper */}
      <Stepper currentStep={5} />


      {/* Header */}
      <div className="mb-8">

        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">

          Declaration & Consent

        </h2>

        <p className="text-gray-500 mt-2">

          Please review and confirm the following declarations before
          submitting your complaint.

        </p>

      </div>



      {/* Official Declaration */}
      <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50">

        <h3 className="text-lg font-bold text-gray-800 mb-4">

          Official Declaration Statement

        </h3>

        <p className="text-gray-700 leading-relaxed">

          I confirm that the information provided in this submission is true,
          accurate, and provided in good faith to the best of my knowledge.
          I understand that intentionally false or misleading submissions may
          result in disciplinary or legal action.

        </p>

      </div>



      {/* Consent Checkboxes */}
      <div className="mt-8 space-y-5">

        <label className="flex items-start gap-3">

          <input
            type="checkbox"
            checked={declaration.truthful}
            onChange={(e) => updateDeclaration("truthful", e.target.checked)}
            className="mt-1 w-5 h-5"
          />

          <span className="text-gray-700">

            I confirm that the information provided is accurate and truthful.

          </span>

        </label>



        <label className="flex items-start gap-3">

          <input
            type="checkbox"
            checked={declaration.consent}
            onChange={(e) => updateDeclaration("consent", e.target.checked)}
            className="mt-1 w-5 h-5"
          />

          <span className="text-gray-700">

            I consent to the Internal Affairs Unit processing this complaint
            for investigation purposes.

          </span>

        </label>



        <label className="flex items-start gap-3">

          <input
            type="checkbox"
            checked={declaration.auditAcknowledgement}
            onChange={(e) => updateDeclaration("auditAcknowledgement", e.target.checked)}
            className="mt-1 w-5 h-5"
          />

          <span className="text-gray-700">

            I acknowledge that complaint activity may be securely logged for
            compliance and audit purposes.

          </span>

        </label>

      </div>

      {error && (

        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">

          <p className="text-sm text-red-700">

            {error}

          </p>

        </div>

      )}

      {uploadWarning && (

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">

          <p className="text-sm text-yellow-700">

            {uploadWarning}

          </p>

        </div>

      )}



      {/* Compliance Warning */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-5">

        <h4 className="font-semibold text-yellow-800 mb-2">

          Compliance Notice

        </h4>

        <p className="text-sm text-yellow-700 leading-relaxed">

          The Internal Affairs Unit maintains strict confidentiality throughout
          the investigation process. Information will only be accessed by
          authorized personnel involved in complaint handling and governance
          review.

        </p>

      </div>



      {/* Security Notice */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">

        <h4 className="font-semibold text-blue-800 mb-2">

          Secure Submission

        </h4>

        <p className="text-sm text-blue-700">

          Your submission will be encrypted and assigned a unique Complaint
          Reference Number (CRN) for future tracking.

        </p>

      </div>



      {/* Buttons */}
      <div className="mt-10 flex items-center justify-between">

        {/* Back */}
        <button
          onClick={() => navigate("/evidence-upload")}
          disabled={submitting}
          className="border border-gray-300 px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all disabled:opacity-60"
        >

          Back

        </button>



        {/* Finalize */}
        <button
          onClick={handleFinalize}
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all disabled:opacity-60"
        >

          {submitting ? "Submitting..." : "Finalize Submission"}

        </button>

      </div>

    </div>

  );

};

export default DeclarationStep;