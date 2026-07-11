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
  specialties = [],
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
    available_days: tutor.available_days || [],
    available_start_time: tutor.available_start_time || "",
    available_end_time: tutor.available_end_time || "",
    qualification: tutor.qualification || "",
    experience: tutor.experience || "",
    bio: tutor.bio || "",
    status: tutor.status || "pending",
  });

  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState(
    tutor.specialties?.map((specialty) => specialty.id) || [],
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
    selectedSpecialtyIds.length > 0 &&
    !isSubmitting;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) return;

    await onSave({
      ...tutor,
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
      status: formData.status,
      specialty_ids: selectedSpecialtyIds,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[92vh] w-full max-w-[650px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
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
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500"
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
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                      selected
                        ? "border-[#0b2d8a] bg-[#0b2d8a] text-white"
                        : "border-gray-200 text-gray-600"
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
            />

            <Input
              name="available_end_time"
              type="time"
              label="Available End Time *"
              value={formData.available_end_time}
              onChange={handleChange}
            />
          </div>

          <Input
            name="qualification"
            label="Qualification *"
            value={formData.qualification}
            onChange={handleChange}
          />

          <Input
            name="experience"
            label="Teaching Experience"
            value={formData.experience}
            onChange={handleChange}
          />

          <textarea
            name="bio"
            rows={3}
            value={formData.bio}
            onChange={handleChange}
            placeholder="Short tutor biography"
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0b2d8a]"
          />

          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              Specialties *
            </label>

            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty) => {
                const selected = selectedSpecialtyIds.includes(specialty.id);

                return (
                  <button
                    key={specialty.id}
                    type="button"
                    onClick={() => toggleSpecialty(specialty.id)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                      selected
                        ? "border-[#0b2d8a] bg-[#0b2d8a] text-white"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    {specialty.name}
                  </button>
                );
              })}
            </div>
          </div>

          <SelectField
            name="status"
            label="Tutor Status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </SelectField>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className={`flex min-w-[150px] items-center justify-center gap-2 rounded-xl px-6 py-3 font-bold text-white ${
                canSubmit
                  ? "bg-[#0b2d8a]"
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

function Input({ name, label, type = "text", ...props }) {
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
        {...props}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0b2d8a]"
      />
    </div>
  );
}

function SelectField({ name, label, children, ...props }) {
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
        {...props}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0b2d8a]"
      >
        {children}
      </select>
    </div>
  );
}
