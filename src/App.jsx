import { useState } from "react";
import ReporterStep from "./pages/ReporterStep";
import ComplaintStep from "./pages/ComplaintStep";

function App() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    submission_type: "Named",
    reporter_category: "",
    complaint_category: "",
    occurrence: "",
    incident_date: "",
    location: "",
    description: "",
    awareness: "",
    reported_before: "",
  });

  // 👉 Next Step
  const next = () => setStep((prev) => prev + 1);

  // 👉 Previous Step
  const prev = () => setStep((prev) => prev - 1);

  return (
    <div>
      
      {/* STEP 1 */}
      {step === 1 && (
        <ReporterStep
          data={formData}
          setData={setFormData}
          next={next}
        />
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <ComplaintStep
          data={formData}
          setData={setFormData}
          nextStep={next}
          prevStep={prev}
        />
      )}

      {/* FUTURE STEPS */}
      {step > 2 && (
        <div className="text-center mt-10 text-xl">
          🚧 Next steps (Subjects, Evidence, Declaration) coming soon...
        </div>
      )}

    </div>
  );
}

export default App;