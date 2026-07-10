export default function EmptyState({
  emoji = "📭",
  title = "Nothing here yet",
  description = "There is currently no data to display.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="text-6xl" aria-hidden="true">
        {emoji}
      </div>

      <h3 className="mt-5 text-xl font-bold text-gray-900">{title}</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-xl bg-[#0b2d8a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#09246f]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
