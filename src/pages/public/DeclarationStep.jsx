import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Stepper from "../../components/forms/Stepper";
import { useComplaint } from "../../hooks/useComplaint";
import { submitComplaint } from "../../services/complaintService";
import { uploadEvidence } from "../../services/uploadService";

const DeclarationStep = () => {
  const navigate = useNavigate();
  const { complaintData, setComplaintData, setSubmissionResult, resetComplaintDraft } =
    useComplaint();

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
            setUploadWarning(
              "Complaint submitted, but some evidence files failed to upload."
            );
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
    <div className="ui-card-strong p-6 md:p-10">

      {/* Stepper */}
      <Stepper currentStep={5} />

      {/* Header */}
      <div className="mb-8">
        <h2 className="ui-section-title">
          Declaration & Consent
        </h2>

        <p className="ui-subtitle mt-2">
          Please review and confirm the following declarations before submitting your complaint.
        </p>
      </div>

      {/* Declaration Box */}
      <div className="border border-green-200 rounded-2xl p-6 bg-green-50">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Official Declaration Statement
        </h3>

        <p className="text-slate-700 leading-relaxed">
          I confirm that the information provided is true, accurate, and submitted in good faith.
          I understand that false or misleading submissions may lead to disciplinary or legal action.
        </p>
      </div>

      {/* Checkboxes */}
      <div className="mt-8 space-y-5">

        {[
          {
            key: "truthful",
            text: "I confirm the information provided is accurate and truthful."
          },
          {
            key: "consent",
            text: "I consent to processing of this complaint for investigation purposes."
          },
          {
            key: "auditAcknowledgement",
            text: "I acknowledge that complaint activity may be securely logged for audit purposes."
          }
        ].map((item) => (
          <label key={item.key} className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={declaration[item.key]}
              onChange={(e) => updateDeclaration(item.key, e.target.checked)}
              className="mt-1 w-5 h-5 accent-green-600"
            />
            <span className="text-slate-700">{item.text}</span>
          </label>
        ))}

      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Upload Warning */}
      {uploadWarning && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-700">{uploadWarning}</p>
        </div>
      )}

      {/* Compliance Notice */}
      <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-5">
        <h4 className="font-semibold text-green-700 mb-2">
          Compliance Notice
        </h4>

        <p className="text-sm text-slate-700">
          All complaints are handled confidentially by authorized personnel only.
        </p>
      </div>

      {/* Security Notice */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-5">
        <h4 className="font-semibold text-green-700 mb-2">
          Secure Submission
        </h4>

        <p className="text-sm text-slate-700">
          Your complaint will be encrypted and assigned a unique reference number for tracking.
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-10 flex items-center justify-between">

        {/* Back */}
        <button
          onClick={() => navigate("/evidence-upload")}
          disabled={submitting}
          className="px-6 py-3 rounded-xl font-semibold border border-green-600 text-green-600 hover:bg-green-50 transition-all disabled:opacity-60"
        >
          Back
        </button>

        {/* Submit */}
        <button
          onClick={handleFinalize}
          disabled={submitting}
          className="px-8 py-3 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Finalize Submission"}
        </button>

      </div>
    </div>
  );
};

export default DeclarationStep;