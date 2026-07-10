import StudentRow from "./StudentRow";

export default function StudentTable({ students }) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[950px]">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              {[
                "Student",
                "Grade",
                "Parent",
                "Subjects",
                "Status",
                "Actions",
              ].map((head) => (
                <th
                  key={head}
                  className="px-8 py-5 text-xs font-bold uppercase tracking-[0.12em] text-gray-500"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {students.map((student, index) => (
              <StudentRow key={`${student.email}-${index}`} student={student} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {students.map((student, index) => (
          <StudentRow
            key={`${student.email}-${index}`}
            student={student}
            mobile
          />
        ))}
      </div>
    </>
  );
}
