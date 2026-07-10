const badgeStyles = {
  Mathematics: "bg-[#eef2ff] text-[#0b2d8a]",
  English: "bg-purple-50 text-purple-600",
  Physics: "bg-red-50 text-red-600",
  Chemistry: "bg-cyan-50 text-cyan-600",
  Science: "bg-emerald-50 text-emerald-600",
  History: "bg-orange-50 text-orange-600",
};

export default function SubjectBadge({ subject }) {
  return (
    <span
      className={`rounded-full px-4 py-1 text-sm font-bold ${
        badgeStyles[subject] || "bg-gray-100 text-gray-600"
      }`}
    >
      {subject}
    </span>
  );
}
