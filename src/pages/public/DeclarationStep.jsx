import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Stepper from "../../components/forms/Stepper";
import { useComplaint } from "../../hooks/useComplaint";
import { submitComplaint } from "../../services/complaintService";

const DeclarationStep = ({ onSubmit }) => {
  const navigate = useNavigate();
  const {
    complaintData,
    setSubmissionResult,
    clearComplaintDraft,
    resetComplaintDraft
  } = useComplaint();
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = checked1 && checked2;

  const buildSubmissionPayload = () => {
    const { reporter, complaint, subjects, evidence } = complaintData;
    const sanitizedReporter = {
      ...reporter,
      preferredContactMethod:
        reporter.submissionType === "anonymous"
          ? "none"
          : reporter.preferredContactMethod || "none"
    };

    return {
      category: complaint.category,
      incidentDate: complaint.incidentDate,
      incidentEndDate: complaint.incidentEndDate,
      incidentLocation: complaint.incidentLocation,
      frequency: complaint.frequency,
      awarenessMethod: complaint.awarenessMethod,
      description: complaint.description,
      previouslyReported: complaint.previouslyReported,
      previousReportDetails: complaint.previouslyReported
        ? [complaint.previousReportedTo, complaint.previousReportOutcome].filter(Boolean).join(" | ")
        : "",
      reporter: sanitizedReporter,
      subjects,
      hasEvidence: evidence.hasEvidence,
      evidenceCount: Array.isArray(evidence.files) ? evidence.files.length : 0,
      submissionSource: "web"
    };
  };

  const handleSubmit = async () => {
    setError("");
    if (!checked1) return setError("Please confirm the declaration (checkbox 1).");
    if (!checked2) return setError("Please confirm the declaration (checkbox 2).");

    if (onSubmit && typeof onSubmit === "function") {
      return onSubmit();
    }

    try {
      setIsSubmitting(true);

      const submissionResult = await submitComplaint(buildSubmissionPayload());

      setSubmissionResult(submissionResult);
      clearComplaintDraft();
      resetComplaintDraft();

      navigate("/report/confirmation", {
        state: { submissionResult }
      });
    } catch (submitError) {
      setError(
        submitError?.message ||
        "Failed to submit complaint. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ui-card-strong p-6 md:p-10">

      <Stepper currentStep={5} />

      <div className="mb-8">
        <h2 className="ui-section-title">Declaration & Submission</h2>
        <p className="ui-subtitle mt-2">
          Please review and confirm the declaration before submitting your complaint.
        </p>
      </div>

      <div className="space-y-6">
        <div className="panel-surface p-6 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Declaration</h3>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-sm text-slate-700 leading-relaxed shadow-sm">
            <p>
              I hereby confirm that the information provided is, to the best of my knowledge, true and accurate. I understand that deliberate or malicious false reports are treated seriously and may result in disciplinary action under CEO's Circular No. 23/2026. I acknowledge that the IAU will treat this submission with strict confidentiality and that no retaliation will be taken against me for raising a genuine concern.
            </p>
          </div>
        </div>

        <div className="panel-surface p-5 md:p-6">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={checked1}
              onChange={(e) => {
                setChecked1(e.target.checked);
                if (error) setError("");
              }}
              className="mt-1 accent-green-600 w-4 h-4"
            />
            <span className="text-sm text-slate-700 leading-relaxed">
              I confirm the above declaration and consent to the IAU processing my submission for investigation purposes. This must be ticked to enable Submit.
            </span>
          </label>
        </div>

        <div className="panel-surface p-5 md:p-6">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={checked2}
              onChange={(e) => {
                setChecked2(e.target.checked);
                if (error) setError("");
              }}
              className="mt-1 accent-green-600 w-4 h-4"
            />
            <span className="text-sm text-slate-700 leading-relaxed">
              I understand that this portal is monitored and all submissions are logged for audit purposes. This must be ticked to enable Submit.
            </span>
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            onClick={() => navigate("/report/evidence-upload")}
            className="ui-button-secondary px-8 py-3"
          >
            Back
          </button>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className={`px-8 py-3 rounded-xl font-semibold text-white transition-all shadow-md hover:shadow-lg ${canSubmit && !isSubmitting ? "bg-green-600 hover:bg-green-700" : "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none hover:shadow-none"}`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

    </div>
  );
};

export default DeclarationStep;
