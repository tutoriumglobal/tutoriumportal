"use client";

import { useState } from "react";
import { FaPlus, FaSearch, FaGraduationCap } from "react-icons/fa";
import TutorTable from "./TutorTable";
import AddTutorModal from "./AddTutorModal";

const initialTutors = [
  {
    name: "Dr. Rachel Kim",
    email: "r.kim@tutorium.com",
    availability: "Mon–Fri, 3–8 PM",
    rating: "4.9",
    sessions: "142",
    status: "active",
    image: "https://i.pravatar.cc/100?img=47",
    subjects: ["Mathematics", "Physics"],
  },
  {
    name: "James O'Brien",
    email: "j.obrien@tutorium.com",
    availability: "Mon–Wed, Sat",
    rating: "4.8",
    sessions: "98",
    status: "active",
    image: "https://i.pravatar.cc/100?img=12",
    subjects: ["English", "History"],
  },
  {
    name: "Priya Sharma",
    email: "p.sharma@tutorium.com",
    availability: "Tue–Sat, 2–7 PM",
    rating: "4.95",
    sessions: "215",
    status: "active",
    image: "https://i.pravatar.cc/100?img=32",
    subjects: ["Science", "Chemistry"],
  },
  {
    name: "Marcus Thompson",
    email: "m.thompson@tutorium.com",
    availability: "Mon–Fri, 4–9 PM",
    rating: "4.7",
    sessions: "76",
    status: "active",
    image: "https://i.pravatar.cc/100?img=60",
    subjects: ["Mathematics", "Chemistry"],
  },
  {
    name: "Elena Vasquez",
    email: "e.vasquez@tutorium.com",
    availability: "Wed–Sun, 1–6 PM",
    rating: "4.85",
    sessions: "163",
    status: "inactive",
    image: "https://i.pravatar.cc/100?img=5",
    subjects: ["Science", "Physics"],
  },
];

export default function TutorsPage() {
  const [tutors, setTutors] = useState(initialTutors);
  const [showModal, setShowModal] = useState(false);

  function handleAddTutor(tutor) {
    setTutors((prev) => [tutor, ...prev]);
  }

  return (
    <div>
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-950 md:text-4xl">
            Tutors
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            {tutors.length} total ·{" "}
            {tutors.filter((t) => t.status === "active").length} active
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#0b2d8a] px-6 py-3 text-lg font-bold text-white transition hover:bg-[#09246f] md:w-auto"
        >
          <FaPlus />
          Add Tutor
        </button>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-0">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full max-w-[430px] items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or subject..."
              className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 text-gray-500">
            <FaGraduationCap />
            <span>{tutors.length} results</span>
          </div>
        </div>

        <TutorTable tutors={tutors} />
      </section>

      {showModal && (
        <AddTutorModal
          onClose={() => setShowModal(false)}
          onAddTutor={handleAddTutor}
        />
      )}
    </div>
  );
}
