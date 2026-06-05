import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Stepper from "../../components/forms/Stepper";
import { useComplaint } from "../../hooks/useComplaint";

const SubjectStep = () => {
  const navigate = useNavigate();

  const { complaintData, setComplaintData } = useComplaint();

  const [error, setError] = useState("");

  const subjects = complaintData.subjects.length
    ? complaintData.subjects
    : [
        {
          fullName: "",
          designation: "",
          organisation: "",
          relationship: "",
          seniorManagementInvolved: false,
          seniorManagementPersonName: ""
        },
      ];

  const updateSubject = (index, field, value) => {
    setComplaintData((prev) => {
      const nextSubjects = [...prev.subjects];

      if (!nextSubjects[index]) {
        return prev;
      }

      nextSubjects[index] = {
        ...nextSubjects[index],
        [field]: value,
      };

      return {
        ...prev,
        subjects: nextSubjects,
      };
    });
  };

  const removeSubject = (index) => {
    setComplaintData((prev) => {
      if (prev.subjects.length <= 1) {
        return prev;
      }

      return {
        ...prev,
        subjects: prev.subjects.filter(
          (_, subjectIndex) => subjectIndex !== index
        ),
      };
    });
  };

  const handleContinue = () => {
    if (!subjects[0].fullName || !subjects[0].fullName.trim()) {
      setError("At least one subject full name is required.");
      return;
    }

    if (subjects[0].seniorManagementInvolved === true) {
      if (!subjects[0].seniorManagementPersonName || !subjects[0].seniorManagementPersonName.trim()) {
        setError("Senior personnel name is required when 'Yes' is selected.");
        return;
      }
    }

    setError("");
    navigate("/report/evidence-upload");
  };

  return (
    <div className="ui-card-strong p-6 md:p-10">
      {/* Stepper */}
      <Stepper currentStep={3} />

      {/* Header */}
      <div className="mb-8">
        <h2 className="ui-section-title">
          Subject Information
        </h2>

        <p className="ui-subtitle mt-2">
          Provide information regarding individuals involved in the incident.
        </p>
      </div>

      {/* Subject Forms */}
      {subjects.map((subject, index) => (
        <div
          key={index}
          className="panel-surface p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Subject Profile {index + 1}
            </h3>

            {subjects.length > 1 && (
              <button
                type="button"
                onClick={() => removeSubject(index)}
                className="text-sm text-red-600 hover:text-red-700 font-semibold"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Name(s) of person(s) involved
              </label>

              <input
                type="text"
                value={subject.fullName}
                onChange={(e) =>
                  updateSubject(index, "fullName", e.target.value)
                }
                placeholder="Multiple names separated by comma. State 'Unknown' if not known."
                className="ui-input"
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Designation / Role
              </label>

              <input
                type="text"
                value={subject.designation}
                onChange={(e) =>
                  updateSubject(index, "designation", e.target.value)
                }
                placeholder="Enter designation"
                className="ui-input"
              />
            </div>


            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Organisation of subject(s)
              </label>

              <select
                value={subject.organisation}
                onChange={(e) =>
                  updateSubject(index, "organisation", e.target.value)
                }
                className="ui-select"
              >
                <option value="">Select Organisation</option>
                <option value="SLT">SLT</option>
                <option value="Mobitel">Mobitel</option>
                <option value="SLTS">SLTS</option>
                <option value="External">External</option>
                <option value="Vendor">Vendor</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            {/* Relationship */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-4">
                Relationship of subject to reporter
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {["Superior", "Manager", "Peer", "Colleague", "Subordinate", "External party", "Unknown"].map((rel) => (
                    <label key={rel} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${subject.relationship === rel ? "border-[#1f5ea8] bg-[#eff6ff] shadow-sm" : "border-slate-200 hover:border-[#1f5ea8] hover:bg-slate-50"}`}>
                      <input
                        type="radio"
                        name={`relationship-${index}`}
                        value={rel}
                        checked={subject.relationship === rel}
                        onChange={(e) =>
                          updateSubject(index, "relationship", e.target.value)
                        }
                        className="accent-[#1f5ea8] w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-slate-700">{rel}</span>
                    </label>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Error */}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Senior Management */}
      <div className="mt-8 panel-surface p-6">
        <label className="block text-sm font-semibold text-slate-700 mb-4">
          Does the complaint involve senior management or any IAU member? <span className="text-red-500">*</span>
        </label>

        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 text-slate-700">
            <input
              type="radio"
              name="management"
              checked={subjects[0].seniorManagementInvolved === true}
              onChange={() => updateSubject(0, "seniorManagementInvolved", true)}
              className="accent-[#1f5ea8]"
            />
            Yes
          </label>

          <label className="flex items-center gap-2 text-slate-700">
            <input
              type="radio"
              name="management"
              checked={subjects[0].seniorManagementInvolved === false}
              onChange={() => updateSubject(0, "seniorManagementInvolved", false)}
              className="accent-[#1f5ea8]"
            />
            No
          </label>

          <label className="flex items-center gap-2 text-slate-700">
            <input
              type="radio"
              name="management"
              checked={subjects[0].seniorManagementInvolved === "unsure"}
              onChange={() => updateSubject(0, "seniorManagementInvolved", "unsure")}
              className="accent-[#1f5ea8]"
            />
            Unsure
          </label>
        </div>
      </div>

      {/* Senior Management Person Name */}
      {subjects[0].seniorManagementInvolved === true && (
        <div className="mt-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            If yes — name(s) of senior personnel involved <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value={subjects[0].seniorManagementPersonName}
            onChange={(e) => updateSubject(0, "seniorManagementPersonName", e.target.value)}
            placeholder="Conditionally displayed. Free text."
            className="ui-input"
          />
        </div>
      )}

      {/* CIABOC Escalation Notice */}
      {subjects[0].seniorManagementInvolved === true && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-sm text-red-700 font-semibold mb-2">CIABOC Escalation Notice</p>
          <p className="text-sm text-red-600 leading-relaxed">
            This complaint involves senior management or IAU member. The system will automatically flag this submission for direct CIABOC escalation and display an on-screen notice to the reporter.
          </p>
        </div>
      )}

      {/* Escalation Notice */}
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <p className="text-sm text-amber-700 leading-relaxed">
          Complaints involving senior management may require escalation to higher governance or external oversight authorities.
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-10 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Back */}
        <button
          onClick={() => navigate("/report/complaint-details")}
          className="w-full sm:w-auto border border-green-600 bg-white hover:bg-green-50 text-green-600 font-semibold px-6 py-3 rounded-xl transition-all duration-300"
        >
          Back
        </button>

        {/* Continue */}
        <button
          onClick={handleContinue}
          className="w-full sm:w-auto bg-[#3e9638] hover:bg-[#31802c] text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SubjectStep;