import { FaCheckCircle } from "react-icons/fa";

const steps = [
  { number: 1, label: "Select Student" },
  { number: 2, label: "Choose Subject" },
  { number: 3, label: "Assign Tutor" },
];

export default function AssignmentStepper({ step }) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((item, index) => {
        const completed = step > item.number;
        const active = step === item.number;

        return (
          <div key={item.number} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold ${
                  completed
                    ? "bg-green-500 text-white"
                    : active
                      ? "bg-[#0b2d8a] text-white"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {completed ? <FaCheckCircle /> : item.number}
              </div>

              <p
                className={`mt-2 text-sm font-bold ${
                  completed
                    ? "text-green-600"
                    : active
                      ? "text-[#0b2d8a]"
                      : "text-gray-400"
                }`}
              >
                {item.label}
              </p>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`mx-8 h-[2px] flex-1 ${
                  step > item.number ? "bg-green-400" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
