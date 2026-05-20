import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Stepper from "../../components/forms/Stepper";
import { useComplaint } from "../../hooks/useComplaint";

const SubjectStep = () => {
  const navigate = useNavigate();

  const { complaintData, setComplaintData } = useComplaint();

  const [error, setError] = useState("");

  const isAnonymousReporter =
    complaintData.reporter.submissionType === "anonymous";

  const subjects = complaintData.subjects.length
    ? complaintData.subjects
    : [
        {
          fullName: "",
          designation: "",
          organization: "",
          relationship: "",
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

  const addSubject = () => {
    setComplaintData((prev) => ({
      ...prev,
      subjects: [
        ...prev.subjects,
        {
          fullName: "",
          designation: "",
          organization: "",
          relationship: "",
        },
      ],
    }));
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

    setError("");

    navigate("/evidence-upload");
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 md:p-10">
      {/* Stepper */}
      <Stepper currentStep={3} />

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Subject Information
        </h2>

        <p className="text-gray-500 mt-2">
          Provide information regarding individuals involved in the incident.
        </p>
      </div>

      {/* Subject Forms */}
      {subjects.map((subject, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-2xl bg-white p-6 mb-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={subject.fullName}
                onChange={(e) =>
                  updateSubject(index, "fullName", e.target.value)
                }
                placeholder="Enter subject name"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Designation / Role
              </label>

              <input
                type="text"
                value={subject.designation}
                onChange={(e) =>
                  updateSubject(index, "designation", e.target.value)
                }
                placeholder="Enter designation"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Organization */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Organization
              </label>

              <input
                type="text"
                value={subject.organization}
                onChange={(e) =>
                  updateSubject(index, "organization", e.target.value)
                }
                placeholder="Enter organization"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Relationship */}
            {!isAnonymousReporter && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Relationship to Reporter
                </label>

                <input
                  type="text"
                  value={subject.relationship}
                  onChange={(e) =>
                    updateSubject(index, "relationship", e.target.value)
                  }
                  placeholder="Example: Supervisor"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Add Subject */}
      <button
        type="button"
        onClick={addSubject}
        className="w-full border-2 border-dashed border-gray-300 rounded-2xl py-5 text-gray-500 hover:border-cyan-500 hover:text-cyan-600 transition-all"
      >
        + Add Another Subject
      </button>

      {/* Error */}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Senior Management */}
      <div className="mt-8">
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Does this involve senior management?
        </label>

        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 text-gray-700">
            <input type="radio" name="management" />
            Yes
          </label>

          <label className="flex items-center gap-2 text-gray-700">
            <input type="radio" name="management" />
            No
          </label>

          <label className="flex items-center gap-2 text-gray-700">
            <input type="radio" name="management" />
            Unsure
          </label>
        </div>
      </div>

      {/* Escalation Notice */}
      <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-sm text-red-700">
          Complaints involving senior management may require escalation to
          higher governance or external oversight authorities.
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-10 flex items-center justify-between">
        {/* Back */}
        <button
          onClick={() => navigate("/complaint-details")}
          className="ui-button-secondary px-6 py-3"
        >
          Back
        </button>

        {/* Continue */}
        <button
          onClick={handleContinue}
          className="ui-button-primary px-8 py-3 rounded-xl font-semibold transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SubjectStep;