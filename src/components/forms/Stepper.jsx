import { FaCheck } from "react-icons/fa";

const Stepper = ({ currentStep }) => {
  const steps = [
    "Reporter",
    "Complaint",
    "Subjects",
    "Evidence",
    "Declaration",
    "Confirmation"
  ];

  return (
    <div className="w-full mb-10 overflow-x-auto">
      <div className="flex items-start justify-between min-w-[600px] md:min-w-full">

        {steps.map((step, index) => {
          const stepNumber = index + 1;

          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;

          return (
            <div
              key={step}
              className="flex-1 flex flex-col items-center relative"
            >
              {/* LINE */}
              {index !== steps.length - 1 && (
                <div className="absolute top-4 md:top-5 left-1/2 w-full h-1 bg-gray-200 z-0">
                  <div
                    className={`h-1 transition-all duration-300 ${
                      currentStep > stepNumber
                        ? "w-full bg-green-500"
                        : "w-0"
                    }`}
                  />
                </div>
              )}

              {/* CIRCLE */}
              <div
                className={`z-10 flex items-center justify-center rounded-full border-2 font-bold transition-all duration-300
                w-8 h-8 text-xs
                md:w-10 md:h-10 md:text-sm
                ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isActive
                    ? "bg-green-100 border-green-600 text-green-700"
                    : "bg-white border-gray-300 text-gray-400"
                }
              `}
              >
                {isCompleted ? <FaCheck /> : stepNumber}
              </div>

              {/* LABEL */}
              <p
                className={`mt-2 md:mt-3 text-[10px] md:text-sm font-medium text-center transition-colors
                max-w-[70px] md:max-w-none
                ${
                  isCompleted || isActive
                    ? "text-green-600"
                    : "text-gray-400"
                }
              `}
              >
                {step}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;