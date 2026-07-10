import {
  FaPlus,
  FaClipboardList,
  FaBookOpen,
  FaCalendarAlt,
} from "react-icons/fa";

const actions = [
  { label: "Add Student", icon: FaPlus, active: true },
  { label: "Log Lesson", icon: FaClipboardList },
  { label: "New Assignment", icon: FaBookOpen },
  { label: "Schedule Lesson", icon: FaCalendarAlt },
];

export default function QuickActions() {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <span className="text-[#0b2d8a]">↗</span>
        <h2 className="text-xl font-bold text-gray-950">Quick Actions</h2>
      </div>

      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.label}
              className={`flex w-full items-center gap-4 rounded-2xl border px-6 py-4 text-left text-lg font-semibold transition ${
                action.active
                  ? "border-[#0b2d8a] bg-[#0b2d8a] text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-[#0b2d8a]/30"
              }`}
            >
              <Icon
                className={action.active ? "text-white" : "text-[#0b2d8a]"}
              />
              {action.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
