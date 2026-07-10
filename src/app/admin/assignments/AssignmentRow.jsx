import SubjectBadge from "./SubjectBadge";

function StatusBadge({ status }) {
  return (
    <span className="rounded-full bg-green-50 px-4 py-1 text-sm font-bold text-green-700">
      {status}
    </span>
  );
}

export default function AssignmentRow({ assignment, mobile = false }) {
  if (mobile) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={assignment.studentImage}
              alt={assignment.student}
              className="h-12 w-12 rounded-full object-cover"
            />

            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {assignment.student}
              </h3>
              <p className="text-sm font-semibold text-gray-400">
                {assignment.grade}
              </p>
            </div>
          </div>

          <StatusBadge status={assignment.status} />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <SubjectBadge subject={assignment.subject} />
          <span className="text-gray-300">→</span>
          <span className="text-base font-medium text-gray-600">
            {assignment.tutor}
          </span>
        </div>
      </div>
    );
  }

  return (
    <tr className="border-b border-gray-50 last:border-b-0">
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
          <img
            src={assignment.studentImage}
            alt={assignment.student}
            className="h-11 w-11 rounded-full object-cover"
          />
          <div>
            <p className="text-lg font-bold text-gray-900">
              {assignment.student}
            </p>
            <p className="text-sm font-semibold text-gray-400">
              {assignment.grade}
            </p>
          </div>
        </div>
      </td>

      <td className="px-8 py-6">
        <SubjectBadge subject={assignment.subject} />
      </td>

      <td className="px-8 py-6">
        <div className="flex items-center gap-3">
          <img
            src={assignment.tutorImage}
            alt={assignment.tutor}
            className="h-9 w-9 rounded-full object-cover"
          />
          <span className="text-base font-medium text-gray-700">
            {assignment.tutor}
          </span>
        </div>
      </td>

      <td className="px-8 py-6 text-base font-medium text-gray-600">
        {assignment.date}
      </td>

      <td className="px-8 py-6">
        <StatusBadge status={assignment.status} />
      </td>
    </tr>
  );
}
