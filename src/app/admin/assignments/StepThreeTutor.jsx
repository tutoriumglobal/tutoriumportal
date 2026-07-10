import { FaSearch } from "react-icons/fa";
import TutorSelectCard from "./TutorSelectCard";
import SubjectBadge from "./SubjectBadge";

export default function StepThreeTutor({
  student,
  subject,
  tutors,
  selectedTutor,
  onSelect,
}) {
  const availableTutors = tutors.filter((tutor) =>
    tutor.subjects.includes(subject.name),
  );

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-center gap-3">
          <SubjectBadge subject={subject.name} />
          <span className="text-blue-500">for</span>
          <span className="font-bold text-[#0b2d8a]">{student.name}</span>
        </div>
      </div>

      <h3 className="mb-5 text-xl font-semibold text-gray-700">
        Assign a qualified tutor:
      </h3>

      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3">
        <FaSearch className="text-gray-400" />
        <input
          placeholder="Search tutors..."
          className="w-full bg-transparent outline-none"
        />
      </div>

      <div className="space-y-3">
        {availableTutors.map((tutor) => (
          <TutorSelectCard
            key={tutor.id}
            tutor={tutor}
            selected={selectedTutor?.id === tutor.id}
            onClick={() => onSelect(tutor)}
          />
        ))}
      </div>
    </div>
  );
}
