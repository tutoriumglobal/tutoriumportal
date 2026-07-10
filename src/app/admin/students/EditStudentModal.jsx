"use client";

import { useMemo, useState } from "react";
import { FiLoader, FiX } from "react-icons/fi";

const curriculumOptions = [
  "British",
  "American",
  "Canadian",
  "Nigerian",
  "Australian",
  "International Baccalaureate",
  "Other",
];

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const fallbackTimezones = [
  "Africa/Lagos",
  "Africa/Accra",
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "Asia/Dubai",
  "Asia/Riyadh",
  "Asia/Istanbul",
  "Australia/Sydney",
  "Pacific/Auckland",
];

export default function EditStudentModal({
  student,
  subjects = [],
  subjectsLoading = false,
  onClose,
  onSave,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState({
    first_name: student.first_name || "",
    last_name: student.last_name || "",
    grade: student.grade || "",
    curriculum: student.curriculum || "",
    email: student.email || "",
    phone: student.phone || "",
    timezone: student.timezone || "",
    preferred_days: student.preferred_days || [],
    preferred_start_time: student.preferred_start_time || "",
    preferred_end_time: student.preferred_end_time || "",
    status: student.status || "pending",
  });

  const [selectedSubjectIds, setSelectedSubjectIds] = useState(
    student.subjects?.map((subject) => subject.id) || [],
  );

  const timezoneOptions = useMemo(() => {
    try {
      if (typeof Intl.supportedValuesOf === "function") {
        return Intl.supportedValuesOf("timeZone");
      }
    } catch {
      return fallbackTimezones;
    }

    return fallbackTimezones;
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function togglePreferredDay(day) {
    setFormData((current) => {
      const selected = current.preferred_days.includes(day);

      return {
        ...current,
        preferred_days: selected
          ? current.preferred_days.filter((item) => item !== day)
          : [...current.preferred_days, day],
      };
    });
  }

  function toggleSubject(subjectId) {
    setSelectedSubjectIds((current) =>
      current.includes(subjectId)
        ? current.filter((id) => id !== subjectId)
        : [...current, subjectId],
    );
  }

  const hasValidTimeRange =
    formData.preferred_start_time &&
    formData.preferred_end_time &&
    formData.preferred_start_time < formData.preferred_end_time;

  const canSubmit =
    formData.first_name.trim() &&
    formData.last_name.trim() &&
    formData.grade.trim() &&
    formData.curriculum &&
    formData.email.trim() &&
    formData.timezone &&
    formData.preferred_days.length > 0 &&
    hasValidTimeRange &&
    selectedSubjectIds.length > 0 &&
    !isSubmitting;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) return;

    await onSave({
      ...student,
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      full_name: `${formData.first_name.trim()} ${formData.last_name.trim()}`,
      grade: formData.grade.trim(),
      curriculum: formData.curriculum,
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim() || null,
      timezone: formData.timezone,
      preferred_days: formData.preferred_days,
      preferred_start_time: formData.preferred_start_time,
      preferred_end_time: formData.preferred_end_time,
      status: formData.status,
      subject_ids: selectedSubjectIds,
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
        aria-labelledby="edit-student-title"
        className="max-h-[92vh] w-full max-w-[650px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id="edit-student-title"
              className="text-xl font-bold text-gray-900 sm:text-2xl"
            >
              Edit Student
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update the learner’s information, subjects, availability, and
              status.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="edit_first_name"
              name="first_name"
              label="First Name *"
              value={formData.first_name}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />

            <Input
              id="edit_last_name"
              name="last_name"
              label="Last Name *"
              value={formData.last_name}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="edit_grade"
              name="grade"
              label="Grade / Year Level *"
              value={formData.grade}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />

            <SelectField
              id="edit_curriculum"
              name="curriculum"
              label="Curriculum *"
              value={formData.curriculum}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            >
              <option value="">Select curriculum</option>

              {curriculumOptions.map((curriculum) => (
                <option key={curriculum} value={curriculum}>
                  {curriculum}
                </option>
              ))}
            </SelectField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="edit_email"
              name="email"
              type="email"
              label="Email *"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />

            <Input
              id="edit_phone"
              name="phone"
              type="tel"
              label="Phone (Optional)"
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <SelectField
            id="edit_timezone"
            name="timezone"
            label="Timezone *"
            value={formData.timezone}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          >
            <option value="">Select timezone</option>

            {timezoneOptions.map((timezone) => (
              <option key={timezone} value={timezone}>
                {timezone}
              </option>
            ))}
          </SelectField>

          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              Preferred Days *
            </label>

            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => {
                const selected = formData.preferred_days.includes(day);

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => togglePreferredDay(day)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      selected
                        ? "border-[#0b2d8a] bg-[#0b2d8a] text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-[#0b2d8a] hover:text-[#0b2d8a]"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="edit_preferred_start_time"
              name="preferred_start_time"
              type="time"
              label="Preferred Start Time *"
              value={formData.preferred_start_time}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />

            <Input
              id="edit_preferred_end_time"
              name="preferred_end_time"
              type="time"
              label="Preferred End Time *"
              value={formData.preferred_end_time}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>

          {formData.preferred_start_time &&
            formData.preferred_end_time &&
            !hasValidTimeRange && (
              <p className="text-sm font-medium text-red-500">
                Preferred end time must be later than the start time.
              </p>
            )}

          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              Subjects Needed *
            </label>

            {subjectsLoading ? (
              <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
                Loading subjects...
              </p>
            ) : subjects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => {
                  const selected = selectedSubjectIds.includes(subject.id);

                  return (
                    <button
                      key={subject.id}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => toggleSubject(subject.id)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        selected
                          ? "border-[#0b2d8a] bg-[#0b2d8a] text-white"
                          : "border-gray-200 bg-white text-gray-600 hover:border-[#0b2d8a] hover:text-[#0b2d8a]"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      {subject.name}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
                No active subjects are available.
              </p>
            )}
          </div>

          <SelectField
            id="edit_status"
            name="status"
            label="Student Status"
            value={formData.status}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </SelectField>

          <p className="text-xs text-gray-500">
            Set the learner to active after payment has been confirmed.
          </p>

          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className={`flex w-full min-w-[150px] items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold text-white transition sm:w-auto ${
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

function Input({ id, label, type = "text", required = false, ...props }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        required={required}
        {...props}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#0b2d8a] focus:ring-2 focus:ring-[#0b2d8a]/20 disabled:bg-gray-50"
      />
    </div>
  );
}

function SelectField({ id, label, required = false, children, ...props }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>

      <select
        id={id}
        required={required}
        {...props}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#0b2d8a] focus:ring-2 focus:ring-[#0b2d8a]/20 disabled:bg-gray-50"
      >
        {children}
      </select>
    </div>
  );
}
