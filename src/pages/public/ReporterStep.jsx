import { useNavigate } from "react-router-dom";

import Stepper from "../../components/forms/Stepper";
import { useComplaint } from "../../hooks/useComplaint";
import { useState } from "react";

const ReporterStep = () => {

  const navigate = useNavigate();
  const { complaintData, setComplaintData } = useComplaint();
  const { reporter } = complaintData;
  const [error, setError] = useState("");

  const submissionType = reporter.submissionType;

  const updateReporter = (field, value) => {

    setComplaintData((prev) => ({
      ...prev,
      reporter: {
        ...prev.reporter,
        [field]: value
      }
    }));

  };

  const setType = (type) => {

    if (type === "anonymous") {
      setComplaintData((prev) => ({
        ...prev,
        reporter: {
          ...prev.reporter,
          submissionType: type,
          fullName: "",
          employeeId: "",
          department: "",
          designation: "",
          email: "",
          phone: "",
          preferredContactMethod: "none"
        }
      }));
    } else {
      setComplaintData((prev) => ({
        ...prev,
        reporter: {
          ...prev.reporter,
          submissionType: type
        }
      }));
    }

  };

  const handleContinue = () => {
    setError("");

    if (!reporter.reporterCategory) {
      setError("Please select a reporter category.");
      return;
    }

    if (submissionType === "named") {
      if (!reporter.fullName || !reporter.fullName.trim()) {
        setError("Full name is required.");
        return;
      }
      if (!reporter.email || !reporter.email.trim()) {
        setError("Email address is required.");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(reporter.email)) {
        setError("Please enter a valid email address.");
        return;
      }
      if (reporter.phone && reporter.phone.trim()) {
        const digitsOnly = reporter.phone.replace(/\D/g, "");
        if (digitsOnly.length !== 10) {
          setError("Phone number must be exactly 10 digits.");
          return;
        }
      }
      if (!reporter.preferredContactMethod) {
        setError("Please select a preferred contact method.");
        return;
      }
    }

    navigate("/report/complaint-details");
  };

  return (

    <div className="ui-card-strong p-6 md:p-10">

      {/* Stepper */}
      <Stepper currentStep={1} />



      {/* Header */}
      <div className="mb-8">

        <h2 className="ui-section-title">

          Reporter Information

        </h2>

        <p className="ui-subtitle mt-2">

          Your information will be handled securely and confidentially.

        </p>

      </div>



      {/* Submission Type */}
      <div className="mb-8">

        <label className="block text-sm font-semibold text-gray-700 mb-4">

          Submission Type

        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Named */}
          <button
            type="button"
            onClick={() => setType("named")}
            className={`border-2 rounded-xl p-5 text-left transition-all duration-300 bg-transparent

            ${
              submissionType === "named"
                ? "border-[#4CB744] bg-[#F3FFF2] ring-2 ring-[#4CB744]/20 shadow-sm"
                : "border-slate-200 hover:border-[#4CB744]"
            }
            `}
          >

            <h3 className="font-bold text-slate-900 mb-2">

              Named Reporting

            </h3>

            <p className="text-sm text-slate-500">

              Provide your contact details for possible follow-up.

            </p>

          </button>



          {/* Anonymous */}
          <button
            type="button"
            onClick={() => setType("anonymous")}
            className={`border-2 rounded-xl p-5 text-left transition-all duration-300 bg-transparent

            ${
              submissionType === "anonymous"
                ? "border-[#4CB744] bg-[#F3FFF2] ring-2 ring-[#4CB744]/20 shadow-sm"
                : "border-slate-200 hover:border-[#4CB744]"
            }
            `}
          >

            <h3 className="font-bold text-slate-900 mb-2">

              Anonymous Reporting

            </h3>

            <p className="text-sm text-slate-500">

              Submit without revealing your identity.

            </p>

          </button>

        </div>

      </div>



      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Reporter Category */}
        <div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Reporter Category

          </label>

          <select
            value={reporter.reporterCategory}
            onChange={(e) => updateReporter("reporterCategory", e.target.value)}
            className="ui-select"
          >

            <option value="">Select Category</option>
            <option value="SLT Employee">SLT Employee</option>
            <option value="Mobitel Employee">Mobitel Employee</option>
            <option value="SLTS Employee">SLTS Employee</option>
            <option value="Vendor">Vendor</option>
            <option value="Supplier">Supplier</option>
            <option value="Contractor">Contractor</option>
            <option value="Customer">Customer</option>
            <option value="Shareholder">Shareholder</option>
            <option value="Investor">Investor</option>
            <option value="General Public">General Public</option>
            <option value="Other">Other</option>

          </select>

        </div>



        {/* Full Name */}
        {submissionType !== "anonymous" && (

          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">

              Full Name

            </label>

            <input
              type="text"
              value={reporter.fullName}
              onChange={(e) => updateReporter("fullName", e.target.value)}
              placeholder="Enter your full name"
              className="ui-input"
            />

          </div>

        )}



        {/* Employee ID */}
        {submissionType !== "anonymous" && (

          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">

              Employee ID

            </label>

            <input
              type="text"
              value={reporter.employeeId}
              onChange={(e) => updateReporter("employeeId", e.target.value)}
              placeholder="Enter your employee ID"
              className="ui-input"
            />

          </div>

        )}



        {/* Department */}
        {submissionType !== "anonymous" && (

          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">

              Department

            </label>

            <input
              type="text"
              value={reporter.department}
              onChange={(e) => updateReporter("department", e.target.value)}
              placeholder="Enter your department"
              className="ui-input"
            />

          </div>

        )}



        {/* Designation */}
        {submissionType !== "anonymous" && (

          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">

              Designation

            </label>

            <input
              type="text"
              value={reporter.designation}
              onChange={(e) => updateReporter("designation", e.target.value)}
              placeholder="Enter your designation"
              className="ui-input"
            />

          </div>

        )}



        {/* Email */}
        {submissionType !== "anonymous" && (

          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">

              Email Address

            </label>

            <input
              type="email"
              value={reporter.email}
              onChange={(e) => updateReporter("email", e.target.value)}
              placeholder="Enter your email"
              className="ui-input"
            />

          </div>

        )}



        {/* Phone */}
        {submissionType !== "anonymous" && (

          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">

              Phone Number

            </label>

            <input
              type="tel"
              value={reporter.phone}
              onChange={(e) => updateReporter("phone", e.target.value)}
              placeholder="Enter 10-digit phone number (e.g., 5551234567)"
              className="ui-input"
            />

          </div>

        )}



        {/* Preferred Contact */}
        {submissionType !== "anonymous" && (

          <div className="md:col-span-2">

            <label className="block text-sm font-semibold text-slate-700 mb-4">

              Preferred Contact Method

            </label>

            <div className="flex flex-wrap items-center gap-8">

              <label className="flex items-center gap-2 text-slate-700">

                <input
                  type="radio"
                  name="preferredContactMethod"
                  value="email"
                  checked={reporter.preferredContactMethod === "email"}
                  onChange={(e) => updateReporter("preferredContactMethod", e.target.value)}
                  className="accent-green-600"
                />

                Email

              </label>

              <label className="flex items-center gap-2 text-slate-700">

                <input
                  type="radio"
                  name="preferredContactMethod"
                  value="phone"
                  checked={reporter.preferredContactMethod === "phone"}
                  onChange={(e) => updateReporter("preferredContactMethod", e.target.value)}
                  className="accent-green-600"
                />

                Phone

              </label>

              <label className="flex items-center gap-2 text-slate-700">

                <input
                  type="radio"
                  name="preferredContactMethod"
                  value="none"
                  checked={reporter.preferredContactMethod === "none"}
                  onChange={(e) => updateReporter("preferredContactMethod", e.target.value)}
                  className="accent-green-600"
                />

                No Contact Preferred

              </label>

            </div>

          </div>

        )}

      </div>



      {/* Confidential Notice */}
      <div className="mt-8 bg-[#F3FFF2] border border-[#4CB744]/30 rounded-xl p-4">

        <p className="text-sm text-[#2E7D32]">

          All submissions are treated with strict confidentiality by the
          Internal Affairs Unit (IAU).

        </p>

      </div>

      {/* Error Message */}
      {error && (

        <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4">

          <p className="text-sm text-red-700 leading-relaxed">

            {error}

          </p>

        </div>

      )}



      {/* Buttons */}
      <div className="mt-10 flex justify-end">

        <button
          onClick={handleContinue}
          className="bg-[#3e9638] hover:bg-[#31802c] text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
        >

          Next

        </button>

      </div>

    </div>

  );

};

export default ReporterStep;