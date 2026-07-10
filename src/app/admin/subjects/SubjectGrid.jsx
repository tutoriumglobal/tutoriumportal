import EmptyState from "../../ui/EmptyState";
import SubjectCard from "./SubjectCard";

export default function SubjectGrid({
  subjects,
  hasSearch,
  onEdit,
  onDelete,
  onAdd,
  onClearSearch,
}) {
  if (!subjects.length) {
    if (hasSearch) {
      return (
        <EmptyState
          emoji="🔍"
          title="No matching subjects"
          description="No subjects match your search. Try another subject name."
          actionLabel="Clear Search"
          onAction={onClearSearch}
        />
      );
    }

    return (
      <EmptyState
        emoji="📚"
        title="No subjects yet"
        description="Add your first subject to begin assigning learners and tutors."
        actionLabel="Add Subject"
        onAction={onAdd}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {subjects.map((subject) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          onEdit={() => onEdit(subject)}
          onDelete={() => onDelete(subject)}
        />
      ))}
    </div>
  );
}
