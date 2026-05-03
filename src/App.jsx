import { useState } from "react";
import ReporterStep from "./pages/ReporterStep";
import ComplaintStep from "./pages/ComplaintStep";
import SubjectStep from "./pages/SubjectStep";
import EvidenceStep from "./pages/EvidenceStep";
import DeclarationStep from "./pages/DeclarationStep";

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

  // Next Step
  const next = () => setStep((prev) => prev + 1);

  // Previous Step
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

      {/* STEP 3 */}
      {step === 3 && (
        <SubjectStep
          data={formData}
          setData={setFormData}
          nextStep={next}
          prevStep={prev}
        />
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <EvidenceStep
          data={formData}
          setData={setFormData}
          nextStep={next}
          prevStep={prev}
        />
      )}

      {/* STEP 5 */}
      {step === 5 && (
        <DeclarationStep
          data={formData}
          setData={setFormData}
          nextStep={next}
          prevStep={prev}
        />
      )}

    </div>
  );
}

export default App;