import { FaLock, FaUserPlus } from "react-icons/fa";
import Stepper from "../components/Stepper";

export default function SubjectStep({ nextStep, prevStep, data, setData }) {

  const subjects = data.subjectData?.subjects || [
    { name: "", designation: "", organisation: "", relationshipToReporter: "" },
  ];

  // Handle input change
  const handleChange = (index, e) => {
    const updated = [...subjects];
    updated[index][e.target.name] = e.target.value;

    setData((prev) => ({
      ...prev,
      subjectData: {
        ...prev.subjectData,
        subjects: updated,
      },
    }));
  };

  // Add subject
  const addSubject = () => {
    const updated = [
      ...subjects,
      { name: "", designation: "", organisation: "", relationshipToReporter: "" },
    ];

    setData((prev) => ({
      ...prev,
      subjectData: {
        ...prev.subjectData,
        subjects: updated,
      },
    }));
  };

  // Senior management selection
  const handleSenior = (value) => {
    setData((prev) => ({
      ...prev,
      subjectData: {
        ...prev.subjectData,
        involvesSeniorManagement: value,
      },
    }));
  };

  // Senior names input
  const handleSeniorNames = (value) => {
    const namesArray = value.split(",").map((n) => n.trim());

    setData((prev) => ({
      ...prev,
      subjectData: {
        ...prev.subjectData,
        seniorPersonNames: namesArray,
      },
    }));
  };

  // NEXT STEP
  const handleNext = () => {
    const s = data.subjectData || {};

    //  validation
    if (!s.involvesSeniorManagement) {
      alert("Please select senior management involvement");
      return;
    }

    if (
      s.involvesSeniorManagement === "Yes" &&
      (!s.seniorPersonNames || s.seniorPersonNames.length === 0)
    ) {
      alert("Please enter senior person names");
      return;
    }

    //  transform correctly for backend
    const names = subjects.map((sub) => sub.name || "Unknown");

    const updatedData = {
      ...data,
      subjectData: {
        ...s,
        names,
        designation: subjects[0]?.designation || "",
        organisation: subjects[0]?.organisation || "Unknown",
        relationshipToReporter:
          subjects[0]?.relationshipToReporter || "Unknown",
      },
    };

    setData(updatedData);
    nextStep(updatedData);
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
          Subject Information
        </h2>

        <Stepper currentStep={3} />

        <div className="bg-white rounded-2xl shadow-md p-8">

          {/* Subjects */}
          {subjects.map((sub, index) => (
            <div key={index} className="border rounded-xl p-6 mb-6">

              <h4 className="font-semibold mb-4">
                {index + 1}. Subject Profile
              </h4>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  name="name"
                  value={sub.name}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="Full Name"
                  className="border p-2 rounded"
                />

                <input
                  name="designation"
                  value={sub.designation}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="Designation / Role"
                  className="border p-2 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  name="organisation"
                  value={sub.organisation}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="Organization (SLT / Mobitel / etc)"
                  className="border p-2 rounded"
                />

                <input
                  name="relationshipToReporter"
                  value={sub.relationshipToReporter}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="Relationship"
                  className="border p-2 rounded"
                />
              </div>

            </div>
          ))}

          {/* Add */}
          <button onClick={addSubject} className="w-full border-dashed border p-3 mt-2">
            <FaUserPlus /> Add Another
          </button>

          {/* Senior */}
          <div className="mt-6">
            <p>Senior Management involved?</p>

            {["Yes", "No", "Unsure"].map((item) => (
              <label key={item} className="mr-4">
                <input
                  type="radio"
                  value={item}
                  checked={data.subjectData?.involvesSeniorManagement === item}
                  onChange={() => handleSenior(item)}
                /> {item}
              </label>
            ))}
          </div>

          {/* Senior Names */}
          {data.subjectData?.involvesSeniorManagement === "Yes" && (
            <input
              type="text"
              placeholder="Enter senior person names (comma separated)"
              className="border p-2 mt-4 w-full"
              onChange={(e) => handleSeniorNames(e.target.value)}
            />
          )}

          {/* Footer */}
          <div className="flex justify-between mt-8">
            <button onClick={prevStep}>← Back</button>
            <button onClick={handleNext}>Next →</button>
          </div>

        </div>
      </div>
    </div>
  );
}