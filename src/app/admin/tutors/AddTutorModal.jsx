"use client";

import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const subjects = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Physics",
  "Chemistry",
];

export default function AddTutorModal({ onClose, onAddTutor }) {
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  function toggleSubject(subject) {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((item) => item !== subject)
        : [...prev, subject],
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    onAddTutor({
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      availability: form.get("availability"),
      subjects: selectedSubjects,
      rating: "0.0",
      sessions: "0",
      status: "active",
      image: "https://i.pravatar.cc/100?img=11",
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-[500px] rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Add New Tutor</h2>

          <button
            onClick={onClose}
            className="text-gray-500 transition hover:text-gray-900"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              name="name"
              label="Full Name *"
              placeholder="e.g. Dr. Rachel Kim"
              required
            />

            <Input
              name="email"
              label="Email *"
              placeholder="tutor@tutorium.com"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input name="phone" label="Phone" placeholder="+1 (555) 000-0000" />

            <Input
              name="availability"
              label="Availability"
              placeholder="e.g. Mon–Fri, 4–8 PM"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              Specialties{" "}
              <span className="font-normal text-gray-400">
                (select one or more)
              </span>
            </label>

            <div className="flex flex-wrap gap-3">
              {subjects.map((subject) => {
                const active = selectedSubjects.includes(subject);

                return (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "border-[#0b2d8a] bg-[#0b2d8a] text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-[#0b2d8a]"
                    }`}
                  >
                    {subject}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-[#0b2d8a] px-6 py-3 font-bold text-white hover:bg-[#09246f]"
            >
              Add Tutor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-700 outline-none transition focus:border-[#0b2d8a] focus:ring-2 focus:ring-[#0b2d8a]/20"
      />
    </div>
  );
}
