"use client";

import { useMemo, useState } from "react";
import { FiLoader, FiX } from "react-icons/fi";

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

export default function EditTutorModal({
  tutor,
  onClose,
  onSave,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState({
    first_name: tutor.first_name || "",
    last_name: tutor.last_name || "",
    email: tutor.email || "",
    phone: tutor.phone || "",
    timezone: tutor.timezone || "",
    available_days: Array.isArray(tutor.available_days)
      ? tutor.available_days
      : [],
    available_start_time: tutor.available_start_time || "",
    available_end_time: tutor.available_end_time || "",
    qualification: tutor.qualification || "",
    experience: tutor.experience || "",
    bio: tutor.bio || "",
    status: tutor.status || "pending",
  });

  const [specialtyInput, setSpecialtyInput] = useState("");

  const [specialties, setSpecialties] = useState(() =>
    Array.isArray(tutor.specialties)
      ? tutor.specialties
          .map((specialty) =>
            typeof specialty === "string" ? specialty : specialty?.name || "",
          )
          .filter(Boolean)
      : [],
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

  function toggleAvailabilityDay(day) {
    setFormData((current) => ({
      ...current,
      available_days: current.available_days.includes(day)
        ? current.available_days.filter((item) => item !== day)
        : [...current.available_days, day],
    }));
  }

  function addSpecialty() {
    const value = specialtyInput.trim();

    if (!value) return;

    const exists = specialties.some(
      (specialty) => specialty.toLowerCase() === value.toLowerCase(),
    );

    if (exists) {
      setSpecialtyInput("");
      return;
    }

    setSpecialties((current) => [...current, value]);
    setSpecialtyInput("");
  }

  function removeSpecialty(specialtyToRemove) {
    setSpecialties((current) =>
      current.filter((specialty) => specialty !== specialtyToRemove),
    );
  }

  function handleSpecialtyKeyDown(event) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addSpecialty();
    }
  }

  const validTimeRange =
    Boolean(formData.available_start_time) &&
    Boolean(formData.available_end_time) &&
    formData.available_start_time < formData.available_end_time;

  const canSubmit =
    Boolean(formData.first_name.trim()) &&
    Boolean(formData.last_name.trim()) &&
    Boolean(formData.email.trim()) &&
    Boolean(formData.timezone) &&
    formData.available_days.length > 0 &&
    validTimeRange &&
    Boolean(formData.qualification.trim()) &&
    specialties.length > 0 &&
    !isSubmitting;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) return;

    await onSave({
      ...tutor,
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      full_name: `${formData.first_name.trim()} ${formData.last_name.trim()}`,
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim() || null,
      timezone: formData.timezone,
      available_days: formData.available_days,
      available_start_time: formData.available_start_time,
      available_end_time: formData.available_end_time,
      qualification: formData.qualification.trim(),
      experience: formData.experience.trim() || null,
      bio: formData.bio.trim() || null,
      status: formData.status,
      specialties,
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
        aria-labelledby="edit-tutor-title"
        className="max-h-[92vh] w-full max-w-[650px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id="edit-tutor-title"
              className="text-xl font-bold text-gray-900 sm:text-2xl"
            >
              Edit Tutor
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update tutor details, specialties, availability, and status.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              name="first_name"
              label="First Name *"
              value={formData.first_name}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />

            <Input
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
              name="email"
              type="email"
              label="Email *"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />

            <Input
              name="phone"
              type="tel"
              label="Phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <SelectField
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
              Available Days *
            </label>

            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => {
                const selected = formData.available_days.includes(day);

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => toggleAvailabilityDay(day)}
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
              name="available_start_time"
              type="time"
              label="Available Start Time *"
              value={formData.available_start_time}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />

            <Input
              name="available_end_time"
              type="time"
              label="Available End Time *"
              value={formData.available_end_time}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>

          {formData.available_start_time &&
            formData.available_end_time &&
            !validTimeRange && (
              <p className="text-sm font-medium text-red-500">
                Available end time must be later than the start time.
              </p>
            )}

          <Input
            name="qualification"
            label="Qualification *"
            value={formData.qualification}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />

          <Input
            name="experience"
            label="Teaching Experience"
            placeholder="e.g. 5 years"
            value={formData.experience}
            onChange={handleChange}
            disabled={isSubmitting}
          />

          <div>
            <label
              htmlFor="edit-bio"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Short Bio
            </label>

            <textarea
              id="edit-bio"
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Short tutor biography"
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#0b2d8a] focus:ring-2 focus:ring-[#0b2d8a]/20 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label
              htmlFor="edit-specialty-input"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Specialties *
            </label>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="edit-specialty-input"
                type="text"
                value={specialtyInput}
                onChange={(event) => setSpecialtyInput(event.target.value)}
                onKeyDown={handleSpecialtyKeyDown}
                disabled={isSubmitting}
                placeholder="e.g. Mathematics"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#0b2d8a] focus:ring-2 focus:ring-[#0b2d8a]/20 disabled:bg-gray-50"
              />

              <button
                type="button"
                onClick={addSpecialty}
                disabled={!specialtyInput.trim() || isSubmitting}
                className="rounded-xl bg-[#0b2d8a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#09246f] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add
              </button>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Press Enter or comma to add a specialty.
            </p>

            {specialties.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0b2d8a]/10 px-3 py-1.5 text-sm font-semibold text-[#0b2d8a]"
                  >
                    {specialty}

                    <button
                      type="button"
                      onClick={() => removeSpecialty(specialty)}
                      disabled={isSubmitting}
                      aria-label={`Remove ${specialty}`}
                      className="text-[#0b2d8a]/60 transition hover:text-red-500 disabled:opacity-50"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <SelectField
            name="status"
            label="Tutor Status"
            value={formData.status}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </SelectField>

          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className={`flex w-full min-w-[150px] items-center justify-center gap-2 rounded-xl px-6 py-3 font-bold text-white transition sm:w-auto ${
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

function Input({ name, label, type = "text", required = false, ...props }) {
  return (
    <div>
      <label
        htmlFor={`edit-${name}`}
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>

      <input
        id={`edit-${name}`}
        name={name}
        type={type}
        required={required}
        {...props}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#0b2d8a] focus:ring-2 focus:ring-[#0b2d8a]/20 disabled:bg-gray-50"
      />
    </div>
  );
}

function SelectField({ name, label, required = false, children, ...props }) {
  return (
    <div>
      <label
        htmlFor={`edit-${name}`}
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>

      <select
        id={`edit-${name}`}
        name={name}
        required={required}
        {...props}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#0b2d8a] focus:ring-2 focus:ring-[#0b2d8a]/20 disabled:bg-gray-50"
      >
        {children}
      </select>
    </div>
  );
}
