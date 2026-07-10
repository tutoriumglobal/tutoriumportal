import StatsGrid from "./StatsGrid";
import QuickActions from "./QuickActions";
import RecentLessons from "./RecentLessons";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-950">
            Dashboard
          </h1>
          <p className="mt-2 text-base md:text-lg text-gray-500">
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>

        <p className="text-sm md:text-base font-semibold text-gray-400">
          Wednesday, July 8
        </p>
      </div>

      <StatsGrid />

      <QuickActions />

      <RecentLessons />
    </div>
  );
}
