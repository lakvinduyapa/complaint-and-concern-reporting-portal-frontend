import { FaLock } from "react-icons/fa";
import Stepper from "../components/Stepper";

export default function ComplaintStep({ nextStep, prevStep, data, setData }) {

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      complaintData: {
        ...prev.complaintData,
        [name]: value,
      },
    }));
  };

  const handleNext = () => {
    const c = data.complaintData || {};

    // Required validation
    if (
      !c.complaintCategory ||
      !c.description ||
      !c.incidentDate ||
      !c.location ||
      !c.frequency ||
      !c.awarenessMethod ||
      !c.reportedPreviously
    ) {
      alert("Please fill all required fields");
      return;
    }

    // Description length
    if (c.description.length < 50) {
      alert("Description must be at least 50 characters");
      return;
    }

    // Conditional validation
    if (c.reportedPreviously === "Yes" && !c.previousReportDetails) {
      alert("Please provide previous report details");
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
          Complaint Details
        </h2>

        <Stepper currentStep={2} />

        <div className="bg-white rounded-2xl shadow-md p-8">

          {/* CATEGORY */}
          <select
            name="complaintCategory"
            value={data.complaintData?.complaintCategory || ""}
            onChange={handleChange}
            className="border rounded-lg p-2 mb-4"
          >
            <option value="">Select a category</option>

            <option value="Bribery">Bribery</option>
            <option value="Corruption">Corruption</option>
            <option value="Fraud">Fraud</option>
            <option value="Financial Misconduct">Financial Misconduct</option>
            <option value="Abuse of Authority">Abuse of Authority</option>
            <option value="Misappropriation">Misappropriation</option>
            <option value="Conflict of Interest">Conflict of Interest</option>
            <option value="Procurement Irregularity">Procurement Irregularity</option>
            <option value="Falsification of Records">Falsification of Records</option>
            <option value="Harassment">Harassment</option>
            <option value="Workplace Misconduct">Workplace Misconduct</option>
            <option value="Breach of Confidentiality">Breach of Confidentiality</option>
            <option value="Non-compliance">Non-compliance</option>
            <option value="Other Malpractice">Other Malpractice</option>
          </select>

          {/* INCIDENT DATE */}
          <input
            type="date"
            name="incidentDate"
            value={data.complaintData?.incidentDate || ""}
            onChange={handleChange}
            className="border rounded-lg p-2 mb-4 w-full"
          />

          {/* LOCATION */}
          <input
            type="text"
            name="location"
            placeholder="Enter location"
            value={data.complaintData?.location || ""}
            onChange={handleChange}
            className="border rounded-lg p-2 mb-4 w-full"
          />

          {/* FREQUENCY */}
          <select
            name="frequency"
            value={data.complaintData?.frequency || ""}
            onChange={handleChange}
            className="border rounded-lg p-2 mb-4"
          >
            <option value="">Select frequency</option>
            <option value="One-time incident">One-time incident</option>
            <option value="Repeated - periodic">Repeated - periodic</option>
            <option value="Ongoing / continuous">Ongoing / continuous</option>
            <option value="Unknown">Unknown</option>
          </select>

          {/* AWARENESS METHOD */}
          <select
            name="awarenessMethod"
            value={data.complaintData?.awarenessMethod || ""}
            onChange={handleChange}
            className="border rounded-lg p-2 mb-4"
          >
            <option value="">How did you know?</option>
            <option value="Direct witness">Direct witness</option>
            <option value="Informed by another party">Informed by another party</option>
            <option value="Discovered through documents or records">
              Discovered through documents or records
            </option>
            <option value="Other">Other</option>
          </select>

          {/* DESCRIPTION */}
          <textarea
            name="description"
            value={data.complaintData?.description || ""}
            onChange={handleChange}
            rows="5"
            placeholder="Provide details (min 50 characters)..."
            className="w-full border rounded-lg p-3 mb-4"
          />

          {/* REPORTED BEFORE */}
          <p className="text-sm mt-4">
            Has this matter been reported previously?
          </p>

          <div className="flex gap-4 mt-2 text-sm">
            {["Yes", "No"].map((item) => (
              <label key={item}>
                <input
                  type="radio"
                  name="reportedPreviously"
                  value={item}
                  checked={data.complaintData?.reportedPreviously === item}
                  onChange={handleChange}
                /> {item}
              </label>
            ))}
          </div>

          {/* CONDITIONAL */}
          {data.complaintData?.reportedPreviously === "Yes" && (
            <textarea
              name="previousReportDetails"
              value={data.complaintData?.previousReportDetails || ""}
              onChange={handleChange}
              placeholder="Provide details of previous report..."
              className="w-full border rounded-lg p-3 mt-4"
            />
          )}

          {/* BUTTONS */}
          <div className="flex justify-between mt-6">
            <button onClick={prevStep} className="border px-4 py-2 rounded-lg">
              ← Previous
            </button>

            <button
              onClick={handleNext}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg"
            >
              Continue →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}