export default function ErrorState({
  title = "Unable to load data",
  message = "Something went wrong. Please try again.",
  onRetry,
}) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="text-6xl" aria-hidden="true">
        😕
      </div>

      <h3 className="mt-5 text-xl font-bold text-gray-900">{title}</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-xl bg-[#0b2d8a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#09246f]"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
