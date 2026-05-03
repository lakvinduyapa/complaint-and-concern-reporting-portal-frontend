import {
  FaUser,
  FaUserSecret,
  FaLock,
  FaShieldAlt,
  FaClock,
} from "react-icons/fa";
import Stepper from "../components/Stepper";

export default function ReporterStep({ next, data, setData }) {

  // FIX: derive state from global data
  const isAnonymous = data.submission_type === "Anonymous";

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
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

        <div className="flex gap-3 text-xs">
          <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full">
            CONFIDENTIAL
          </span>
          <span className="text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            AUTO-SAVING
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-10 px-4">

        <h2 className="text-2xl font-bold mb-1">
          Step 1: Reporter Details
        </h2>

        <p className="text-gray-500 mb-6">
          Start by identifying yourself or choose to remain anonymous.
        </p>

        <Stepper currentStep={1} />

        <div className="bg-white rounded-2xl shadow-md p-8">

          <div className="bg-blue-50 border border-blue-200 text-blue-600 p-4 rounded-lg mb-6 text-sm">
            No login required. Your submission is confidential and protected by high-level encryption.
          </div>

          <h3 className="text-sm font-semibold text-gray-500 mb-3">
            REPORTING IDENTITY
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-6">

            {/* Named */}
            <div
              onClick={() =>
                setData({ ...data, submission_type: "Named" })
              }
              className={`rounded-xl p-5 text-center cursor-pointer transition ${
                !isAnonymous
                  ? "border-2 border-blue-500 bg-blue-50 shadow"
                  : "border hover:shadow"
              }`}
            >
              <FaUser className={`mx-auto text-lg mb-2 ${
                !isAnonymous ? "text-blue-500" : "text-gray-400"
              }`} />
              <p className="font-semibold">Named Reporting</p>
              <p className="text-xs text-gray-500">
                Provide your details for follow-up and protection.
              </p>
            </div>

            {/* Anonymous */}
            <div
              onClick={() =>
                setData({ ...data, submission_type: "Anonymous" })
              }
              className={`rounded-xl p-5 text-center cursor-pointer transition ${
                isAnonymous
                  ? "border-2 border-blue-500 bg-blue-50 shadow"
                  : "border hover:shadow"
              }`}
            >
              <FaUserSecret className={`mx-auto text-lg mb-2 ${
                isAnonymous ? "text-blue-500" : "text-gray-400"
              }`} />
              <p className="font-semibold">Anonymous Reporting</p>
              <p className="text-xs text-gray-500">
                No personal identification required.
              </p>
            </div>

          </div>

          {/* Notice */}
          {isAnonymous && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 rounded mb-6 text-sm">
              You are submitting anonymously. No personal details will be collected.
            </div>
          )}

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1">
              Reporter Category *
            </label>
            <select
              name="reporter_category"
              value={data.reporter_category || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 text-sm"
            >
              <option value="">Select category</option>
              <option>Permanent Employee</option>
              <option>Contract Employee</option>
              <option>External Party</option>
            </select>
          </div>

          {/* Named only */}
          {!isAnonymous && (
            <>
              <h3 className="text-sm font-semibold text-gray-500 mb-3">
                PROFESSIONAL IDENTITY
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <input name="full_name" value={data.full_name || ""} onChange={handleChange} placeholder="Full Name *" className="input" />
                <input name="employee_id" value={data.employee_id || ""} onChange={handleChange} placeholder="Employee ID" className="input" />
                <input name="department" value={data.department || ""} onChange={handleChange} placeholder="Department *" className="input" />
                <input name="designation" value={data.designation || ""} onChange={handleChange} placeholder="Designation *" className="input" />
              </div>

              <h3 className="text-sm font-semibold text-gray-500 mb-3">
                CONTACT INFORMATION
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <input name="email" value={data.email || ""} onChange={handleChange} placeholder="Email Address *" className="input" />
                <input name="phone" value={data.phone || ""} onChange={handleChange} placeholder="Phone Number *" className="input" />
              </div>

              <div className="mb-6">
                <select
                  name="contact_method"
                  value={data.contact_method || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 text-sm"
                >
                  <option value="">Preferred Contact Method</option>
                  <option>Email</option>
                  <option>Phone</option>
                </select>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <FaLock /> Your progress is automatically saved
            </p>

            <button
              onClick={next}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow"
            >
              Continue to Details →
            </button>
          </div>

        </div>

        <div className="grid grid-cols-3 text-center mt-10 text-gray-600 text-sm">
          <div className="flex flex-col items-center gap-1">
            <FaLock />
            <p>Data Privacy</p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <FaShieldAlt />
            <p>Anti-Retaliation</p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <FaClock />
            <p>24/7 Monitoring</p>
          </div>
        </div>

      </div>
    </div>
  );
}