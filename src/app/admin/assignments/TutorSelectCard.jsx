import { FaCheckCircle, FaUsers } from "react-icons/fa";

export default function TutorSelectCard({ tutor, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
        selected
          ? "border-[#0b2d8a] bg-blue-50"
          : "border-gray-100 bg-white hover:border-[#0b2d8a]/40"
      }`}
    >
      <div className="flex items-center gap-4">
        <img
          src={tutor.image}
          alt={tutor.name}
          className="h-12 w-12 rounded-full object-cover"
        />

        <div>
          <p className="text-lg font-bold text-gray-900">{tutor.name}</p>
          <p className="text-gray-400">{tutor.availability}</p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 text-gray-400">
          <FaUsers />
          {tutor.sessions}
        </div>

        {selected && <FaCheckCircle className="text-xl text-[#0b2d8a]" />}
      </div>
    </button>
  );
}
