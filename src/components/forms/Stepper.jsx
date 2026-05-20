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

    <div className="w-full mb-10">

      <div className="flex items-center justify-between">

        {steps.map((step, index) => {

          const stepNumber = index + 1;

          const isActive = currentStep === stepNumber;

          const isCompleted = currentStep > stepNumber;

          return (

            <div
              key={step}
              className="flex-1 flex flex-col items-center relative"
            >

              {/* Line */}
              {index !== steps.length - 1 && (

                <div className="absolute top-5 left-1/2 w-full h-1 bg-gray-300 z-0">

                  <div
                    className={`h-1 transition-all duration-300 ${
                      isCompleted
                        ? "bg-green-500 w-full"
                        : "bg-gray-300 w-0"
                    }`}
                  />

                </div>

              )}



              {/* Circle */}
              <div
                className={`z-10 w-10 h-10 flex items-center justify-center rounded-full border-4 text-sm font-bold transition-all duration-300

                ${
                  isCompleted
                    ? "bg-gray-300 border-gray-400 text-gray-600"
                    : isActive
                    ? "bg-white border-gray-500 text-gray-700"
                    : "bg-white border-gray-300 text-gray-400"
                }
                `}
              >

                {isCompleted ? <FaCheck /> : stepNumber}

              </div>



              {/* Label */}
              <p
                className={`mt-3 text-xs md:text-sm font-medium text-center

                ${
                  isActive
                    ? "text-gray-700"
                    : isCompleted
                    ? "text-gray-600"
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