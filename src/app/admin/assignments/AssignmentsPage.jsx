"use client";

import { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import AddAssignmentModal from "./AddAssignmentModal";
import SubjectBadge from "./SubjectBadge";
import { initialAssignments } from "./assignmentsData";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [showModal, setShowModal] = useState(false);

  function handleCreateAssignment(newAssignment) {
    setAssignments((prev) => [newAssignment, ...prev]);
  }

  return (
    <div>
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-950 md:text-4xl">
            Assignments
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            {assignments.length} active assignments
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#0b2d8a] px-6 py-3 text-lg font-bold text-white transition hover:bg-[#09246f] md:w-auto"
        >
          <FaPlus />
          New Assignment
        </button>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-0">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full max-w-[430px] items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3">
            <FaSearch className="text-gray-400" />
            <input
              placeholder="Search assignments..."
              className="w-full bg-transparent text-base text-gray-700 outline-none"
            />
          </div>

          <p className="text-gray-500">{assignments.length} assignments</p>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                {["Student", "Subject", "Tutor", "Start Date", "Status"].map(
                  (head) => (
                    <th
                      key={head}
                      className="px-8 py-5 text-xs font-bold uppercase tracking-[0.12em] text-gray-500"
                    >
                      {head}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              {assignments.map((item) => (
                <tr key={item.id} className="border-b border-gray-50">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.studentImage}
                        alt={item.student}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-lg font-bold">{item.student}</p>
                        <p className="text-sm text-gray-400">{item.grade}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <SubjectBadge subject={item.subject} />
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.tutorImage}
                        alt={item.tutor}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <span>{item.tutor}</span>
                    </div>
                  </td>

                  <td className="px-8 py-6 text-gray-600">{item.date}</td>

                  <td className="px-8 py-6">
                    <span className="rounded-full bg-green-50 px-4 py-1 text-sm font-bold text-green-700">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 md:hidden">
          {assignments.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-gray-100 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={item.studentImage}
                    alt={item.student}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{item.student}</h3>
                    <p className="text-sm text-gray-400">{item.grade}</p>
                  </div>
                </div>

                <span className="rounded-full bg-green-50 px-4 py-1 text-sm font-bold text-green-700">
                  active
                </span>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <SubjectBadge subject={item.subject} />
                <span className="text-gray-300">→</span>
                <span className="text-gray-600">{item.tutor}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showModal && (
        <AddAssignmentModal
          onClose={() => setShowModal(false)}
          onCreateAssignment={handleCreateAssignment}
        />
      )}
    </div>
  );
}
