export default function StatCard({
  title,
  value,
  note,
  footer,
  progress,
  color,
  bg,
  icon: Icon,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-7 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm md:text-base font-semibold uppercase tracking-[0.12em] text-gray-500">
            {title}
          </p>
          <h2 className="mt-3 text-4xl font-bold text-gray-950">{value}</h2>
          <p className="mt-2 text-sm md:text-base text-gray-400">{note}</p>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${bg}`}
        >
          <Icon className="text-2xl" style={{ color }} />
        </div>
      </div>

      <div className="mt-6 h-2 rounded-full bg-gray-100">
        <div
          className="h-2 rounded-full"
          style={{ width: progress, backgroundColor: color }}
        />
      </div>

      <p className="mt-2 text-sm md:text-base text-gray-400">{footer}</p>
    </div>
  );
}
