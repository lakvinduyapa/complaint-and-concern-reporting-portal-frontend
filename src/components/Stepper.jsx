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

  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((label, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={index} className="flex-1 flex flex-col items-center relative">
            
            {/* Line */}
            {index !== 0 && (
              <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-300 -z-10"></div>
            )}

            {/* Circle */}
            <div
              className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold
              ${
                isCompleted
                  ? "bg-blue-500 text-white"
                  : isActive
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {isCompleted ? <FaCheck size={12} /> : step}
            </div>

            {/* Label */}
            <p
              className={`text-xs mt-2 ${
                isActive ? "text-blue-600 font-semibold" : "text-gray-500"
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