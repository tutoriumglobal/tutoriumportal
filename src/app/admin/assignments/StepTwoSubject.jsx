import SubjectSelectCard from "./SubjectSelectCard";

export default function StepTwoSubject({ student, selectedSubject, onSelect }) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <img
          src={student.image}
          alt={student.name}
          className="h-12 w-12 rounded-full object-cover"
        />

        <div>
          <p className="text-lg font-bold text-[#0b2d8a]">{student.name}</p>
          <p className="font-semibold text-blue-400">
            {student.subjects.length} registered subjects
          </p>
        </div>
      </div>

      <h3 className="mb-5 text-xl font-semibold text-gray-700">
        Select a subject to create an assignment for:
      </h3>

      <div className="space-y-3">
        {student.subjects.map((subject) => (
          <SubjectSelectCard
            key={subject.name}
            subject={subject}
            selected={selectedSubject?.name === subject.name}
            onClick={() => !subject.assigned && onSelect(subject)}
          />
        ))}
      </div>
    </div>
  );
}
