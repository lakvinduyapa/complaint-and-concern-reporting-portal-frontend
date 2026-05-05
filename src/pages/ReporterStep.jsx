import {
  FaUser,
  FaUserSecret,
  FaLock,
} from "react-icons/fa";
import Stepper from "../components/Stepper";

export default function ReporterStep({ next, data, setData }) {

  const isAnonymous = data.userData?.submissionType === "Anonymous";

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      userData: {
        ...prev.userData,
        [name]: value,
      },
    }));
  };

  // Identity selection
  const handleIdentity = (type) => {
    setData((prev) => ({
      ...prev,
      userData: {
        submissionType: type,

        // CLEAR DATA IF ANONYMOUS
        ...(type === "Anonymous" && {
          fullName: "",
          email: "",
          telephone: "",
          preferredContactMethod: "",
        }),
      },
    }));
  };

  // NEXT STEP VALIDATION
  const handleNext = () => {
    const u = data.userData || {};

    if (!u.submissionType) {
      alert("Please select reporting type");
      return;
    }

    if (!u.reporterCategory) {
      alert("Please select reporter category");
      return;
    }

    if (u.submissionType === "Named") {
      if (!u.fullName || !u.email) {
        alert("Name and Email are required");
        return;
      }
    }

    next();
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

          {/* Identity */}
          <div className="grid grid-cols-2 gap-4 mb-6">

            <div
              onClick={() => handleIdentity("Named")}
              className={`rounded-xl p-5 text-center cursor-pointer ${
                !isAnonymous ? "border-2 border-blue-500 bg-blue-50" : "border"
              }`}
            >
              <FaUser className="mx-auto mb-2" />
              <p>Named Reporting</p>
            </div>

            <div
              onClick={() => handleIdentity("Anonymous")}
              className={`rounded-xl p-5 text-center cursor-pointer ${
                isAnonymous ? "border-2 border-blue-500 bg-blue-50" : "border"
              }`}
            >
              <FaUserSecret className="mx-auto mb-2" />
              <p>Anonymous Reporting</p>
            </div>

          </div>

          {/* Category */}
          <select
            name="reporterCategory"
            value={data.userData?.reporterCategory || ""}
            onChange={handleChange}
            className="w-full border p-2 mb-4"
          >
            <option value="">Select category</option>
            <option>Employee</option>
            <option>Vendor</option>
            <option>Supplier</option>
            <option>Contractor</option>
            <option>Customer</option>
            <option>Shareholder</option>
            <option>General Public</option>
            <option>Other</option>
          </select>

          {/* Named only */}
          {!isAnonymous && (
            <>
              <input
                name="fullName"
                value={data.userData?.fullName || ""}
                onChange={handleChange}
                placeholder="Full Name"
                className="input"
              />

              <input
                name="email"
                value={data.userData?.email || ""}
                onChange={handleChange}
                placeholder="Email"
                className="input"
              />

              <input
                name="telephone"
                value={data.userData?.telephone || ""}
                onChange={handleChange}
                placeholder="Phone"
                className="input"
              />

              <select
                name="preferredContactMethod"
                value={data.userData?.preferredContactMethod || ""}
                onChange={handleChange}
                className="input"
              >
                <option value="">Contact Method</option>
                <option>Email</option>
                <option>Phone</option>
                <option>None</option>
              </select>
            </>
          )}

          {/* Footer */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleNext}
              className="bg-blue-500 text-white px-6 py-2 rounded"
            >
              Continue →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}