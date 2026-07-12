"use client";

import { useMemo, useState } from "react";
import { FiLoader, FiX } from "react-icons/fi";

export default function EditAssignmentModal({
  assignment,
  tutors = [],
  onClose,
  onSave,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState({
    tutor_id: assignment.tutor_id || "",
    status: assignment.status || "active",
  });

  const qualifiedTutors = useMemo(() => {
    const subjectName = assignment.subject?.name?.toLowerCase().trim();

    return tutors.filter((tutor) =>
      (tutor.specialties || []).some((specialty) => {
        const normalized = specialty.toLowerCase().trim();

        return (
          normalized === subjectName ||
          normalized.includes(subjectName) ||
          subjectName?.includes(normalized)
        );
      }),
    );
  }, [assignment, tutors]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.tutor_id) return;

    await onSave({
      student_id: assignment.student_id,
      subject_id: assignment.subject_id,
      tutor_id: formData.tutor_id,
      status: formData.status,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-[540px] rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Edit Assignment
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Change the assigned tutor or assignment status.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
          >
            <FiX />
          </button>
        </div>

        <div className="mt-6 rounded-xl bg-blue-50 p-4">
          <p className="font-bold text-[#0b2d8a]">
            {assignment.student?.full_name}
          </p>

          <p className="mt-1 text-sm text-blue-500">
            {assignment.subject?.name}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Assigned Tutor
            </label>

            <select
              value={formData.tutor_id}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  tutor_id: event.target.value,
                }))
              }
              disabled={isSubmitting}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#0b2d8a]"
            >
              <option value="">Select tutor</option>

              {qualifiedTutors.map((tutor) => (
                <option key={tutor.id} value={tutor.id}>
                  {tutor.full_name} — {tutor.timezone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Status
            </label>

            <select
              value={formData.status}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  status: event.target.value,
                }))
              }
              disabled={isSubmitting}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#0b2d8a]"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!formData.tutor_id || isSubmitting}
              className="flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-[#0b2d8a] px-6 py-3 font-bold text-white disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
