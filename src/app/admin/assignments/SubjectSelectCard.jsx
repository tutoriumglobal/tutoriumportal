import { FaBookOpen, FaCheckCircle } from "react-icons/fa";

export default function SubjectSelectCard({ subject, selected, onClick }) {
  const disabled = subject.assigned;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl border p-5 text-left transition ${
        disabled
          ? "border-gray-100 bg-white opacity-40 cursor-not-allowed"
          : selected
            ? "border-[#0b2d8a] bg-blue-50"
            : "border-gray-100 bg-white hover:border-[#0b2d8a]/40"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#0b2d8a]">
          <FaBookOpen />
        </div>

        <div>
          <p className="text-lg font-bold text-gray-900">{subject.name}</p>
          {disabled && (
            <p className="text-sm font-semibold text-gray-400">
              Already assigned
            </p>
          )}
        </div>
      </div>

      {selected && <FaCheckCircle className="text-xl text-[#0b2d8a]" />}
    </button>
  );
}
