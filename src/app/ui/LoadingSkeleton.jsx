export default function LoadingSkeleton({ rows = 5 }) {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">
        <div className="h-12 w-full max-w-[430px] rounded-xl bg-gray-200" />
        <div className="h-5 w-24 rounded bg-gray-200" />
      </div>

      <div className="hidden md:block">
        <div className="grid grid-cols-6 gap-5 border-b border-gray-100 px-8 py-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-4 rounded bg-gray-200" />
          ))}
        </div>

        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-6 items-center gap-5 border-b border-gray-100 px-8 py-6 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 shrink-0 rounded-full bg-gray-200" />

              <div className="w-full space-y-2">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-200" />
              </div>
            </div>

            {Array.from({ length: 5 }).map((__, itemIndex) => (
              <div key={itemIndex} className="h-4 rounded bg-gray-200" />
            ))}
          </div>
        ))}
      </div>

      <div className="space-y-4 p-4 md:hidden">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 shrink-0 rounded-full bg-gray-200" />

              <div className="flex-1 space-y-3">
                <div className="h-4 w-2/3 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-200" />
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <div className="h-7 w-24 rounded-full bg-gray-200" />
              <div className="h-7 w-20 rounded-full bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
