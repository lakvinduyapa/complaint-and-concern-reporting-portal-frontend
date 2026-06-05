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
    <div className="w-full mb-10 rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-4 py-5 md:px-6 shadow-sm overflow-x-auto">
      <div className="flex items-center justify-between gap-4 mb-6 min-w-[600px] md:min-w-full">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Application Progress
          </p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">
            Step {currentStep} of {steps.length}
          </h3>
        </div>

        <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          Secure complaint submission flow
        </div>
      </div>

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
                <div className="absolute top-4 md:top-5 left-1/2 w-full h-1 rounded-full bg-slate-200 z-0 overflow-hidden">
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
                    ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/15"
                    : "bg-white border-slate-300 text-slate-400"
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
                    ? isActive
                      ? "text-slate-900"
                      : "text-green-700"
                    : "text-slate-400"
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