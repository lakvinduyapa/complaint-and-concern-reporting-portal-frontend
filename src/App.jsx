import { useState } from "react";
import ReporterStep from "./pages/ReporterStep";

function App() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    submission_type: "Named",
    reporter_category: "",
    complaint_category: "",
    incident_date: "",
    location: "",
    description: "",
  });

  const next = () => setStep((prev) => prev + 1);

  return (
    <div className="p-10">
      {step === 1 && (
        <ReporterStep
          data={formData}
          setData={setFormData}
          next={next}
        />
      )}

      {step > 1 && (
        <div className="text-center mt-10 text-xl">
          Next steps not created yet
        </div>
      )}
    </div>
  );
}

export default App;