"use client";

import { FiAlertTriangle, FiLoader, FiX } from "react-icons/fi";

export default function DeleteStudentModal({
  student,
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
        aria-labelledby="delete-student-title"
        className="w-full max-w-[430px] rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
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
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <h2
          id="delete-student-title"
          className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl"
        >
          Delete Student
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Are you sure you want to delete{" "}
          <strong className="font-semibold text-gray-900">
            {student.full_name}
          </strong>
          ? This action cannot be undone.
        </p>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="flex w-full min-w-[155px] items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isDeleting ? (
              <>
                <FiLoader className="animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Student"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
