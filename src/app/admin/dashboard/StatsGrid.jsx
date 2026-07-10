import {
  FaUsers,
  FaGraduationCap,
  FaBookOpen,
  FaCalendarAlt,
} from "react-icons/fa";
import StatCard from "./StatCard";

const stats = [
  {
    title: "Active Students",
    value: "6",
    note: "+2 this month",
    footer: "6 of 7 total",
    progress: "90%",
    color: "#0b2d8a",
    bg: "bg-[#eef2ff]",
    icon: FaUsers,
  },
  {
    title: "Active Tutors",
    value: "4",
    note: "+1 this month",
    footer: "4 of 5 total",
    progress: "78%",
    color: "#059669",
    bg: "bg-emerald-50",
    icon: FaGraduationCap,
  },
  {
    title: "Assignments",
    value: "6",
    note: "+3 this week",
    footer: "6 of 6 total",
    progress: "100%",
    color: "#7c3aed",
    bg: "bg-purple-50",
    icon: FaBookOpen,
  },
  {
    title: "Upcoming Lessons",
    value: "3",
    note: "Next 7 days",
    footer: "3 of 5 total",
    progress: "60%",
    color: "#fdbd01",
    bg: "bg-amber-50",
    icon: FaCalendarAlt,
  },
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {stats.map((item) => (
        <StatCard key={item.title} {...item} />
      ))}
    </div>
  );
}
