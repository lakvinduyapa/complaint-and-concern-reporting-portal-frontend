import {
  FaLock,
  FaUpload,
  FaFileAlt,
  FaImage,
  FaEnvelope,
  FaLink,
  FaTrash,
} from "react-icons/fa";
import Stepper from "../components/Stepper";

export default function EvidenceStep({ nextStep, prevStep, data, setData }) {

  const hasEvidence = data.hasEvidence ?? true;
  const selectedTypes = data.selectedTypes || [];
  const files = data.evidence || [];

  const toggleType = (type) => {
    const updated = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];

    setData({
      ...data,
      selectedTypes: updated,
    });
  };

  //  FIXED FILE HANDLER
  const handleFiles = (e) => {
    const uploaded = Array.from(e.target.files);

    if (!uploaded.length) return;

    const file = uploaded[0]; //  only take ONE file

    // size validation
    if (file.size > 10 * 1024 * 1024) {
      setData({
        ...data,
        evidence: [{ file, error: "File too large (Max 10MB)" }],
        evidence_file: null,
      });
      return;
    }

    //  correct structure
    setData({
      ...data,
      evidence: [{ file, error: null }],
      evidence_file: file, //  important for backend
    });
  };

  const removeFile = () => {
    setData({
      ...data,
      evidence: [],
      evidence_file: null,
    });
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

      <div className="max-w-5xl mx-auto py-10 px-4">

        <h2 className="text-2xl font-bold mb-1">
          Supporting Evidence
        </h2>

        <Stepper currentStep={4} />

        <div className="bg-white rounded-2xl shadow-md p-8">

          {/* YES / NO */}
          <p className="mb-3">Do you have evidence?</p>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setData({ ...data, hasEvidence: true })}
              className={`px-6 py-2 border rounded ${hasEvidence ? "bg-blue-50 border-blue-500" : ""}`}
            >
              Yes
            </button>

            <button
              onClick={() => setData({ ...data, hasEvidence: false })}
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
                  { name: "Documents", icon: <FaFileAlt /> },
                  { name: "Photos", icon: <FaImage /> },
                  { name: "Emails", icon: <FaEnvelope /> },
                  { name: "Web Links", icon: <FaLink /> },
                ].map((item) => (
                  <div
                    key={item.name}
                    onClick={() => toggleType(item.name)}
                    className={`p-4 border rounded cursor-pointer text-center ${
                      selectedTypes.includes(item.name)
                        ? "bg-blue-50 border-blue-500"
                        : ""
                    }`}
                  >
                    {item.icon}
                    <p className="text-sm mt-2">{item.name}</p>
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
                <p className="text-xs text-gray-400">
                  Max 1 file (backend supports single file)
                </p>
              </div>

              {/* FILE LIST */}
              {files.map((item, index) => (
                <div key={index} className="border p-3 rounded mb-2 flex justify-between items-center">
                  <div>
                    <p className="text-sm">{item.file.name}</p>
                    {item.error ? (
                      <p className="text-red-500 text-xs">{item.error}</p>
                    ) : (
                      <p className="text-green-500 text-xs">Ready</p>
                    )}
                  </div>

                  <FaTrash
                    className="cursor-pointer text-gray-400"
                    onClick={removeFile}
                  />
                </div>
              ))}
            </>
          )}

          {/* Footer */}
          <div className="flex justify-between mt-6">
            <button onClick={prevStep} className="border px-4 py-2 rounded">
              ← Previous
            </button>

            <button
              onClick={nextStep}
              className="bg-blue-500 text-white px-6 py-2 rounded"
            >
              Save and Continue →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}