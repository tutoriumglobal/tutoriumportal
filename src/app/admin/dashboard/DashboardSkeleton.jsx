export default function DashboardSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex items-start justify-between gap-5">
            <div className="flex-1">
              <div className="h-5 w-44 rounded bg-gray-200" />

              <div className="mt-6 h-12 w-20 rounded bg-gray-200" />

              <div className="mt-5 h-5 w-32 rounded bg-gray-200" />
            </div>

            <div className="h-16 w-16 shrink-0 rounded-2xl bg-gray-200 sm:h-20 sm:w-20" />
          </div>

          <div className="mt-10">
            <div className="h-3 w-full rounded-full bg-gray-200" />

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="h-5 w-28 rounded bg-gray-200" />
              <div className="h-5 w-12 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
