import { FaLock, FaUserPlus, FaExclamationTriangle } from "react-icons/fa";
import Stepper from "../components/Stepper";

export default function SubjectStep({ nextStep, prevStep, data, setData }) {

  // FIX: use global state instead of local state
  const subjects = data.subjects || [
    { name: "", role: "", department: "", relationship: "" },
  ];

  const handleChange = (index, e) => {
    const updated = [...subjects];
    updated[index][e.target.name] = e.target.value;

    setData({
      ...data,
      subjects: updated, //  SAVE globally
    });
  };

  const addSubject = () => {
    const updated = [
      ...subjects,
      { name: "", role: "", department: "", relationship: "" },
    ];

    setData({
      ...data,
      subjects: updated, //  SAVE globally
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <FaLock />
          Secure Portal
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
          Subject Information
        </h2>
        <p className="text-gray-500 mb-6">
          Please identify individuals involved in the incident.
        </p>

        <Stepper currentStep={3} />

        <div className="bg-white rounded-2xl shadow-md p-8">

          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-blue-600">
              Persons of Interest
            </h3>
            <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs">
              CONFIDENTIAL
            </span>
          </div>

          {/* SUBJECT LOOP */}
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
                  placeholder="Full Name / Identity"
                  className="border p-2 rounded"
                />

                <input
                  name="role"
                  value={sub.role}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="Role or Designation"
                  className="border p-2 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  name="department"
                  value={sub.department}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="Department / Organization"
                  className="border p-2 rounded"
                />

                <input
                  name="relationship"
                  value={sub.relationship}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="Relationship to You"
                  className="border p-2 rounded"
                />
              </div>
            </div>
          ))}

          {/* Add Button */}
          <button
            onClick={addSubject}
            className="w-full border-dashed border-2 p-3 rounded-lg text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <FaUserPlus />
            Add Another Person Involved
          </button>

          {/* Senior Management FIXED */}
          <div className="mt-6 border-t pt-6">
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <FaExclamationTriangle className="text-yellow-500" />
              Does this case involve Senior Management?
            </div>

            <div className="flex gap-6 mt-2 text-sm">
              <label>
                <input
                  type="radio"
                  name="involves_senior"
                  value="Yes"
                  checked={data.involves_senior === "Yes"}
                  onChange={(e) =>
                    setData({ ...data, involves_senior: e.target.value })
                  }
                /> Yes
              </label>

              <label>
                <input
                  type="radio"
                  name="involves_senior"
                  value="No"
                  checked={data.involves_senior === "No"}
                  onChange={(e) =>
                    setData({ ...data, involves_senior: e.target.value })
                  }
                /> No
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between mt-8">
            <button onClick={prevStep} className="border px-4 py-2 rounded-lg">
              ← Previous Step
            </button>

            <button onClick={nextStep} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
              Continue to Evidence →
            </button>
          </div>

        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          © 2026 SLT Mobitel Internal Affairs Unit
        </p>

      </div>
    </div>
  );
}