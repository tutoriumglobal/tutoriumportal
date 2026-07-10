import { FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import LessonItem from "./LessonItem";

const lessons = [
  {
    student: "Emma Johnson",
    tutor: "Dr. Rachel Kim",
    subject: "Mathematics",
    time: "4:00 PM",
    status: "scheduled",
    image: "https://i.pravatar.cc/100?img=47",
    color: "#0b2d8a",
  },
  {
    student: "Liam Chen",
    tutor: "Dr. Rachel Kim",
    subject: "Physics",
    time: "6:00 PM",
    status: "scheduled",
    image: "https://i.pravatar.cc/100?img=12",
    color: "#dc2626",
  },
  {
    student: "Sophia Martinez",
    tutor: "Priya Sharma",
    subject: "Science",
    time: "3:00 PM",
    status: "completed",
    image: "https://i.pravatar.cc/100?img=32",
    color: "#059669",
  },
  {
    student: "Ava Thompson",
    tutor: "James O'Brien",
    subject: "English",
    time: "5:00 PM",
    status: "scheduled",
    image: "https://i.pravatar.cc/100?img=5",
    color: "#7c3aed",
  },
  {
    student: "Oliver Davis",
    tutor: "Dr. Rachel Kim",
    subject: "Mathematics",
    time: "4:00 PM",
    status: "completed",
    image: "https://i.pravatar.cc/100?img=59",
    color: "#0b2d8a",
  },
];

export default function RecentLessons() {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaCalendarAlt className="text-[#0b2d8a]" />
          <h2 className="text-xl font-bold text-gray-950">Recent Lessons</h2>
        </div>

        <button className="flex items-center gap-2 font-semibold text-[#0b2d8a]">
          View All <FaArrowRight />
        </button>
      </div>

      <div className="space-y-7">
        {lessons.map((lesson) => (
          <LessonItem key={`${lesson.student}-${lesson.time}`} {...lesson} />
        ))}
      </div>
    </section>
  );
}
