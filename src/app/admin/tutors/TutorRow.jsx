import { FaEye, FaClock, FaStar } from "react-icons/fa";
import SubjectBadge from "./SubjectBadge";

export default function TutorRow({ tutor, mobile = false }) {
  if (mobile) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={tutor.image}
              alt={tutor.name}
              className="h-14 w-14 rounded-full object-cover"
            />

            <div>
              <h3 className="text-lg font-bold text-gray-900">{tutor.name}</h3>
              <div className="mt-1 flex items-center gap-2">
                <FaStar className="text-[#fdbd01]" />
                <span className="font-bold">{tutor.rating}</span>
                <span className="text-gray-300">·</span>
                <span className="text-gray-400">{tutor.sessions} sessions</span>
              </div>
            </div>
          </div>

          <StatusBadge status={tutor.status} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {tutor.subjects.map((subject) => (
            <SubjectBadge key={subject} subject={subject} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <tr className="border-b border-gray-50 last:border-b-0">
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
          <img
            src={tutor.image}
            alt={tutor.name}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <p className="text-lg font-bold text-gray-900">{tutor.name}</p>
            <p className="text-sm font-semibold text-gray-400">{tutor.email}</p>
          </div>
        </div>
      </td>

      <td className="px-8 py-6">
        <div className="flex flex-wrap gap-2">
          {tutor.subjects.map((subject) => (
            <SubjectBadge key={subject} subject={subject} />
          ))}
        </div>
      </td>

      <td className="px-8 py-6">
        <div className="flex items-center gap-3 text-base font-medium text-gray-600">
          <FaClock className="text-gray-400" />
          {tutor.availability}
        </div>
      </td>

      <td className="px-8 py-6">
        <div className="flex items-center gap-2 font-bold text-gray-900">
          <FaStar className="text-[#fdbd01]" />
          {tutor.rating}
        </div>
      </td>

      <td className="px-8 py-6 text-base font-medium text-gray-600">
        {tutor.sessions}
      </td>

      <td className="px-8 py-6">
        <StatusBadge status={tutor.status} />
      </td>

      <td className="px-8 py-6">
        <button className="flex items-center gap-2 font-semibold text-gray-600 transition hover:text-[#0b2d8a]">
          <FaEye />
          View
        </button>
      </td>
    </tr>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-4 py-1 text-sm font-bold ${
        status === "active"
          ? "bg-green-50 text-green-700"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      {status}
    </span>
  );
}
