"use client";

import { useState } from "react";
import { FiLoader, FiX } from "react-icons/fi";
import SubjectColorPicker from "./SubjectColorPicker";

export default function EditSubjectModal({
  subject,
  onClose,
  onSave,
  isSubmitting = false,
}) {
  const [name, setName] = useState(subject.name || "");
  const [category, setCategory] = useState(subject.category || "");
  const [selectedColor, setSelectedColor] = useState(
    subject.color || "#0B2D8A",
  );
  const [status, setStatus] = useState(subject.status || "active");

  const canSubmit = name.trim().length >= 2 && !isSubmitting;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) return;

    await onSave({
      name: name.trim(),
      category: category.trim() || null,
      color: selectedColor,
      status,
    });
  }

  return (
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-subject-title"
        className="w-full max-w-[500px] rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-7 flex items-center justify-between">
          <h2
            id="edit-subject-title"
            className="text-2xl font-bold text-gray-900"
          >
            Edit Subject
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="edit-subject-name"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Subject Name *
            </label>

            <input
              id="edit-subject-name"
              type="text"
              value={name}
              disabled={isSubmitting}
              onChange={(event) => setName(event.target.value)}
              autoFocus
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-700 outline-none transition focus:border-[#0b2d8a] focus:ring-2 focus:ring-[#0b2d8a]/20 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label
              htmlFor="edit-subject-category"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Category
            </label>

            <input
              id="edit-subject-category"
              type="text"
              value={category}
              disabled={isSubmitting}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="e.g. Academic"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-700 outline-none transition focus:border-[#0b2d8a] focus:ring-2 focus:ring-[#0b2d8a]/20 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label
              htmlFor="edit-subject-status"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Status
            </label>

            <select
              id="edit-subject-status"
              value={status}
              disabled={isSubmitting}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-[#0b2d8a] focus:ring-2 focus:ring-[#0b2d8a]/20 disabled:bg-gray-50"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <SubjectColorPicker
            selectedColor={selectedColor}
            onChange={setSelectedColor}
            disabled={isSubmitting}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className={`flex min-w-[150px] items-center justify-center gap-2 rounded-xl px-6 py-3 font-bold text-white transition ${
                canSubmit
                  ? "bg-[#0b2d8a] hover:bg-[#09246f]"
                  : "cursor-not-allowed bg-[#0b2d8a]/50"
              }`}
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
