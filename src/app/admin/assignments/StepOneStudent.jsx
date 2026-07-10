import StudentSelectCard from "./StudentSelectCard";

export default function StepOneStudent({
  students,
  selectedStudent,
  onSelect,
}) {
  return (
    <div>
      <h3 className="mb-5 text-xl font-semibold text-gray-700">
        Select a student to assign:
      </h3>

      <div className="max-h-[340px] space-y-3 overflow-y-auto pr-2">
        {students.map((student) => (
          <StudentSelectCard
            key={student.id}
            student={student}
            selected={selectedStudent?.id === student.id}
            onClick={() => onSelect(student)}
          />
        ))}
      </div>
    </div>
  );
}
