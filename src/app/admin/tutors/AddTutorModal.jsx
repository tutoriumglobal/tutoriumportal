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

export default function AddTutorModal({
  onClose,
  onAddTutor,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    timezone: "",
    available_days: [],
    available_start_time: "",
    available_end_time: "",
    qualification: "",
    experience: "",
    bio: "",
  });

  const [specialtyInput, setSpecialtyInput] = useState("");
  const [specialties, setSpecialties] = useState([]);

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

  function addSpecialty() {
    const value = specialtyInput.trim();

    if (!value) return;

    const alreadyExists = specialties.some(
      (specialty) => specialty.toLowerCase() === value.toLowerCase(),
    );

    if (alreadyExists) {
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

  function toggleAvailabilityDay(day) {
    setFormData((current) => ({
      ...current,
      available_days: current.available_days.includes(day)
        ? current.available_days.filter((item) => item !== day)
        : [...current.available_days, day],
    }));
  }

  function toggleSpecialty(specialtyId) {
    setSelectedSpecialtyIds((current) =>
      current.includes(specialtyId)
        ? current.filter((id) => id !== specialtyId)
        : [...current, specialtyId],
    );
  }

  const validTimeRange =
    formData.available_start_time &&
    formData.available_end_time &&
    formData.available_start_time < formData.available_end_time;

  const canSubmit =
    formData.first_name.trim() &&
    formData.last_name.trim() &&
    formData.email.trim() &&
    formData.timezone &&
    formData.available_days.length > 0 &&
    validTimeRange &&
    formData.qualification.trim() &&
    specialties.length > 0 &&
    !isSubmitting;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) return;

    await onAddTutor({
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim() || null,
      timezone: formData.timezone,
      available_days: formData.available_days,
      available_start_time: formData.available_start_time,
      available_end_time: formData.available_end_time,
      qualification: formData.qualification.trim(),
      experience: formData.experience.trim() || null,
      bio: formData.bio.trim() || null,
      specialties,
      avatar_url: null,
      status: "pending",
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
      <div className="max-h-[92vh] w-full max-w-[650px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Add New Tutor
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add tutor details, specialties, and teaching availability.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100"
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
            />

            <Input
              name="last_name"
              label="Last Name *"
              value={formData.last_name}
              onChange={handleChange}
              disabled={isSubmitting}
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
            />

            <Input
              name="phone"
              type="tel"
              label="Phone (Optional)"
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
                    onClick={() => toggleAvailabilityDay(day)}
                    disabled={isSubmitting}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      selected
                        ? "border-[#0b2d8a] bg-[#0b2d8a] text-white"
                        : "border-gray-200 text-gray-600 hover:border-[#0b2d8a]"
                    }`}
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
            />

            <Input
              name="available_end_time"
              type="time"
              label="Available End Time *"
              value={formData.available_end_time}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          {formData.available_start_time &&
            formData.available_end_time &&
            !validTimeRange && (
              <p className="text-sm font-medium text-red-500">
                End time must be later than the start time.
              </p>
            )}

          <Input
            name="qualification"
            label="Qualification *"
            placeholder="e.g. B.Sc. Mathematics"
            value={formData.qualification}
            onChange={handleChange}
            disabled={isSubmitting}
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
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Short Bio
            </label>

            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Briefly describe the tutor's teaching background."
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#0b2d8a] focus:ring-2 focus:ring-[#0b2d8a]/20"
            />
          </div>

          <div>
            <label
              htmlFor="specialty-input"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Specialties *
            </label>

            <div className="flex gap-2">
              <input
                id="specialty-input"
                type="text"
                value={specialtyInput}
                onChange={(event) => setSpecialtyInput(event.target.value)}
                onKeyDown={handleSpecialtyKeyDown}
                disabled={isSubmitting}
                placeholder="e.g. Mathematics"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#0b2d8a] focus:ring-2 focus:ring-[#0b2d8a]/20"
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
                      className="text-[#0b2d8a]/60 transition hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className={`flex min-w-[145px] items-center justify-center gap-2 rounded-xl px-6 py-3 font-bold text-white ${
                canSubmit
                  ? "bg-[#0b2d8a] hover:bg-[#09246f]"
                  : "cursor-not-allowed bg-[#0b2d8a]/50"
              }`}
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Tutor"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({ name, label, type = "text", ...props }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        {...props}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#0b2d8a] focus:ring-2 focus:ring-[#0b2d8a]/20"
      />
    </div>
  );
}

function SelectField({ name, label, children, ...props }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        {...props}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#0b2d8a] focus:ring-2 focus:ring-[#0b2d8a]/20"
      >
        {children}
      </select>
    </div>
  );
}
