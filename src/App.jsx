import { useState } from "react";

import ReporterStep from "./pages/ReporterStep";
import ComplaintStep from "./pages/ComplaintStep";
import SubjectStep from "./pages/SubjectStep";
import EvidenceStep from "./pages/EvidenceStep";
import DeclarationStep from "./pages/DeclarationStep";
import ConfirmationStep from "./pages/ConfirmationStep";

function App() {
  const [step, setStep] = useState(1);

  // FIXED STRUCTURE
  const [formData, setFormData] = useState({
    userData: {
      submissionType: "Anonymous",
      reporterCategory: "",
    },
    complaintData: {},
    subjectData: {},
    evidenceData: {},
  });

  const [crn, setCrn] = useState("");

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div>

      {step === 1 && (
        <ReporterStep data={formData} setData={setFormData} next={nextStep} />
      )}

      {step === 2 && (
        <ComplaintStep data={formData} setData={setFormData} nextStep={nextStep} prevStep={prevStep} />
      )}

      {step === 3 && (
        <SubjectStep data={formData} setData={setFormData} nextStep={nextStep} prevStep={prevStep} />
      )}

      {step === 4 && (
        <EvidenceStep data={formData} setData={setFormData} nextStep={nextStep} prevStep={prevStep} />
      )}

      {step === 5 && (
        <DeclarationStep
          data={formData}
          nextStep={nextStep}
          prevStep={prevStep}
          setCrn={setCrn}
        />
      )}

      {step === 6 && (
        <ConfirmationStep crn={crn} data={formData} />
      )}

    </div>
  );
}

export default App;