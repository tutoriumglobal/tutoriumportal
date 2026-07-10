export default function ModalFooter({
  step,
  canContinue,
  onClose,
  onBack,
  onNext,
  onCreate,
}) {
  return (
    <div className="mt-8 flex justify-end gap-4">
      {step === 1 ? (
        <button
          onClick={onClose}
          className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      ) : (
        <button
          onClick={onBack}
          className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
      )}

      {step < 3 ? (
        <button
          onClick={onNext}
          disabled={!canContinue}
          className={`rounded-xl px-6 py-3 font-bold text-white ${
            canContinue
              ? "bg-[#0b2d8a] hover:bg-[#09246f]"
              : "bg-[#0b2d8a]/50 cursor-not-allowed"
          }`}
        >
          Continue →
        </button>
      ) : (
        <button
          onClick={onCreate}
          disabled={!canContinue}
          className={`rounded-xl px-6 py-3 font-bold text-white ${
            canContinue
              ? "bg-[#0b2d8a] hover:bg-[#09246f]"
              : "bg-[#0b2d8a]/50 cursor-not-allowed"
          }`}
        >
          Create Assignment
        </button>
      )}
    </div>
  );
}
