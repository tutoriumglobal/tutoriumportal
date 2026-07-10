import { FiAlertTriangle, FiLoader, FiX } from "react-icons/fi";

export default function DeleteSubjectModal({
  subject,
  onClose,
  onDelete,
  isDeleting = false,
}) {
  return (
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-subject-title"
        className="w-full max-w-[430px] rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
            <FiAlertTriangle className="text-2xl" />
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Close modal"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <h2
          id="delete-subject-title"
          className="mt-5 text-2xl font-bold text-gray-900"
        >
          Delete Subject
        </h2>

        <p className="mt-3 leading-7 text-gray-500">
          Are you sure you want to delete{" "}
          <strong className="font-semibold text-gray-900">
            {subject.name}
          </strong>
          ? This action cannot be undone.
        </p>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-red-500 px-6 py-3 font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <FiLoader className="animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Subject"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
