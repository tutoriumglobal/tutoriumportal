import { FaEye } from "react-icons/fa";
import SubjectBadge from "./SubjectBadge";

export default function StudentRow({ student }) {
  return (
    <tr className="border-b border-gray-50 last:border-b-0">
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
          <img
            src={student.image}
            alt={student.name}
            className="h-12 w-12 rounded-full object-cover"
          />

          <div>
            <p className="text-lg font-bold text-gray-900">{student.name}</p>
            <p className="text-sm font-semibold text-gray-400">
              {student.email}
            </p>
          </div>
        </div>
      </td>

      <td className="px-8 py-6 text-base font-medium text-gray-600">
        {student.grade}
      </td>

      <td className="px-8 py-6 text-base font-medium text-gray-600">
        {student.parent}
      </td>

      <td className="px-8 py-6">
        <div className="flex flex-wrap gap-2">
          {student.subjects.map((subject) => (
            <SubjectBadge key={subject} subject={subject} />
          ))}
        </div>
      </td>

      <td className="px-8 py-6">
        <span
          className={`rounded-full px-4 py-1 text-sm font-bold ${
            student.status === "active"
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {student.status}
        </span>
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
