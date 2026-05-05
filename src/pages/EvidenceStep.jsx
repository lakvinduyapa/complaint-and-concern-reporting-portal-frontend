import {
  FaLock,
  FaUpload,
  FaTrash,
} from "react-icons/fa";
import Stepper from "../components/Stepper";

export default function EvidenceStep({ nextStep, prevStep, data, setData }) {

  const eData = data.evidenceData || {};

  const hasEvidence = eData.hasEvidence === "Yes";
  const selectedTypes = eData.evidenceType || [];
  const files = eData.files || [];

  //  Toggle evidence type
  const toggleType = (type) => {
    const updated = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];

    setData((prev) => ({
      ...prev,
      evidenceData: {
        ...prev.evidenceData,
        evidenceType: updated,
      },
    }));
  };

  //  Handle Yes / No
  const setHasEvidence = (value) => {
    setData((prev) => ({
      ...prev,
      evidenceData: {
        ...prev.evidenceData,
        hasEvidence: value,
        //  reset when No
        ...(value === "No" && {
          evidenceType: [],
          files: [],
        }),
      },
    }));
  };

  //  Handle file upload
  const handleFiles = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File too large (Max 10MB)");
      return;
    }

    setData((prev) => ({
      ...prev,
      evidenceData: {
        ...prev.evidenceData,
        files: [...(prev.evidenceData?.files || []), file],
      },
    }));
  };

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);

    setData((prev) => ({
      ...prev,
      evidenceData: {
        ...prev.evidenceData,
        files: updated,
      },
    }));
  };

  //  NEXT VALIDATION
  const handleNext = () => {
    const e = data.evidenceData || {};

    if (!e.hasEvidence) {
      alert("Please select Yes or No");
      return;
    }

    if (e.hasEvidence === "Yes" && (!e.evidenceType || e.evidenceType.length === 0)) {
      alert("Please select at least one evidence type");
      return;
    }

    nextStep();
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <FaLock /> Secure Portal
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-10 px-4">

        <h2 className="text-2xl font-bold mb-1">
          Supporting Evidence
        </h2>

        <Stepper currentStep={4} />

        <div className="bg-white rounded-2xl shadow-md p-8">

          {/* YES / NO */}
          <p className="mb-3">Do you have supporting evidence?</p>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setHasEvidence("Yes")}
              className={`px-6 py-2 border rounded ${hasEvidence ? "bg-blue-50 border-blue-500" : ""}`}
            >
              Yes
            </button>

            <button
              onClick={() => setHasEvidence("No")}
              className={`px-6 py-2 border rounded ${!hasEvidence ? "bg-blue-50 border-blue-500" : ""}`}
            >
              No
            </button>
          </div>

          {hasEvidence && (
            <>
              {/* TYPES */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  "Documents",
                  "Records",
                  "Email or Communication",
                  "Photographs",
                  "Videos",
                  "Witness testimony",
                  "Financial records",
                  "Other"
                ].map((type) => (
                  <div
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`p-4 border rounded cursor-pointer text-center ${
                      selectedTypes.includes(type)
                        ? "bg-blue-50 border-blue-500"
                        : ""
                    }`}
                  >
                    <p>{type}</p>
                  </div>
                ))}
              </div>

              {/* FILE UPLOAD */}
              <div className="border-dashed border-2 p-8 rounded text-center mb-6">
                <FaUpload className="mx-auto mb-2 text-gray-400" />
                <label className="cursor-pointer text-blue-500">
                  Browse Files
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFiles}
                  />
                </label>
              </div>

              {/* FILE LIST */}
              {files.map((file, index) => (
                <div key={index} className="border p-3 rounded mb-2 flex justify-between">
                  <span>{file.name}</span>
                  <FaTrash onClick={() => removeFile(index)} className="cursor-pointer" />
                </div>
              ))}
            </>
          )}

          {/* Footer */}
          <div className="flex justify-between mt-6">
            <button onClick={prevStep}>← Back</button>
            <button onClick={handleNext}>Next →</button>
          </div>

        </div>
      </div>
    </div>
  );
}