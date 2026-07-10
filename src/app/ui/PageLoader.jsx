export default function PageLoader({ text = "Loading..." }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#0b2d8a]" />

      <p className="mt-4 text-sm font-medium text-gray-500">{text}</p>
    </div>
  );
}
