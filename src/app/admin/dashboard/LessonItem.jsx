import { FaClock } from "react-icons/fa";

export default function LessonItem({
  student,
  tutor,
  subject,
  time,
  status,
  image,
  color,
}) {
  const completed = status === "completed";

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-4">
        <img
          src={image}
          alt={student}
          className="h-11 w-11 rounded-full object-cover"
        />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-gray-950">{student}</h3>
            <span className="text-gray-300">·</span>
            <p className="text-base text-gray-500">{tutor}</p>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <p className="text-base text-gray-400">{subject}</p>
          </div>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            completed
              ? "bg-green-50 text-green-700"
              : "bg-blue-50 text-[#0b2d8a]"
          }`}
        >
          {status}
        </span>

        <div className="mt-2 flex items-center justify-end gap-2 text-sm text-gray-400">
          <FaClock />
          {time}
        </div>
      </div>
    </div>
  );
}
