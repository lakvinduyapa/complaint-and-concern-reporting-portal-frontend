import { FaCheck } from "react-icons/fa";

export default function Stepper({ currentStep = 1 }) {
  const steps = [
    "REPORTER",
    "DETAILS",
    "SUBJECTS",
    "EVIDENCE",
    "DECLARATION",
    "DONE",
  ];

  // Guard currentStep
  const safeStep =
    currentStep < 1 ? 1 :
    currentStep > steps.length ? steps.length :
    currentStep;

  return (
    <div className="flex items-center justify-between mb-8 relative">

      {steps.map((label, index) => {
        const step = index + 1;
        const isActive = step === safeStep;
        const isCompleted = step < safeStep;

        return (
          <div
            key={label} // better key
            className="flex-1 flex flex-col items-center relative"
          >

            {/* Line */}
            {index !== 0 && (
              <div
                className={`absolute top-4 left-[-50%] w-full h-[2px] -z-10
                ${isCompleted ? "bg-blue-500" : "bg-gray-300"}`}
              />
            )}

            {/* Circle */}
            <div
              className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold transition
              ${
                isCompleted
                  ? "bg-blue-500 text-white"
                  : isActive
                  ? "bg-blue-500 text-white ring-4 ring-blue-100"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {isCompleted ? <FaCheck size={12} /> : step}
            </div>

            {/* Label */}
            <p
              className={`text-xs mt-2 transition text-center
              ${
                isActive
                  ? "text-blue-600 font-semibold"
                  : isCompleted
                  ? "text-blue-500"
                  : "text-gray-500"
              }`}
            >
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
}