import AssignmentRow from "./AssignmentRow";

const assignments = [
  {
    student: "Emma Johnson",
    grade: "Grade 9",
    subject: "Mathematics",
    tutor: "Dr. Rachel Kim",
    date: "Feb 1, 2024",
    status: "active",
    studentImage: "https://i.pravatar.cc/100?img=47",
    tutorImage: "https://i.pravatar.cc/100?img=47",
  },
  {
    student: "Emma Johnson",
    grade: "Grade 9",
    subject: "English",
    tutor: "James O'Brien",
    date: "Feb 1, 2024",
    status: "active",
    studentImage: "https://i.pravatar.cc/100?img=47",
    tutorImage: "https://i.pravatar.cc/100?img=12",
  },
  {
    student: "Liam Chen",
    grade: "Grade 11",
    subject: "Physics",
    tutor: "Dr. Rachel Kim",
    date: "Feb 10, 2024",
    status: "active",
    studentImage: "https://i.pravatar.cc/100?img=12",
    tutorImage: "https://i.pravatar.cc/100?img=47",
  },
  {
    student: "Sophia Martinez",
    grade: "Grade 10",
    subject: "Science",
    tutor: "Priya Sharma",
    date: "Feb 15, 2024",
    status: "active",
    studentImage: "https://i.pravatar.cc/100?img=32",
    tutorImage: "https://i.pravatar.cc/100?img=32",
  },
  {
    student: "Ava Thompson",
    grade: "Grade 12",
    subject: "English",
    tutor: "James O'Brien",
    date: "Mar 7, 2024",
    status: "active",
    studentImage: "https://i.pravatar.cc/100?img=5",
    tutorImage: "https://i.pravatar.cc/100?img=12",
  },
  {
    student: "Oliver Davis",
    grade: "Grade 10",
    subject: "Mathematics",
    tutor: "Dr. Rachel Kim",
    date: "Mar 1, 2024",
    status: "active",
    studentImage: "https://i.pravatar.cc/100?img=59",
    tutorImage: "https://i.pravatar.cc/100?img=47",
  },
];

export default function AssignmentTable() {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              {["Student", "Subject", "Tutor", "Start Date", "Status"].map(
                (head) => (
                  <th
                    key={head}
                    className="px-8 py-5 text-xs font-bold uppercase tracking-[0.12em] text-gray-500"
                  >
                    {head}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody>
            {assignments.map((assignment, index) => (
              <AssignmentRow
                key={`${assignment.student}-${assignment.subject}-${index}`}
                assignment={assignment}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {assignments.map((assignment, index) => (
          <AssignmentRow
            key={`${assignment.student}-${assignment.subject}-${index}`}
            assignment={assignment}
            mobile
          />
        ))}
      </div>
    </>
  );
}
