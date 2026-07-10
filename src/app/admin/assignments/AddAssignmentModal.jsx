"use client";

import { useState } from "react";
import { FaTimes } from "react-icons/fa";

import AssignmentStepper from "./AssignmentStepper";
import StepOneStudent from "./StepOneStudent";
import StepTwoSubject from "./StepTwoSubject";
import StepThreeTutor from "./StepThreeTutor";
import ModalFooter from "./ModalFooter";

import { students, tutors } from "./assignmentsData";

export default function AddAssignmentModal({ onClose, onCreateAssignment }) {
  const [step, setStep] = useState(1);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);

  const canContinue =
    (step === 1 && selectedStudent) ||
    (step === 2 && selectedSubject) ||
    (step === 3 && selectedTutor);

  function handleNext() {
    if (!canContinue) return;
    setStep((prev) => prev + 1);
  }

  function handleBack() {
    setStep((prev) => prev - 1);
  }

  function handleCreate() {
    if (!selectedStudent || !selectedSubject || !selectedTutor) return;

    onCreateAssignment({
      id: Date.now(),
      student: selectedStudent.name,
      grade: selectedStudent.grade,
      studentImage: selectedStudent.image,
      subject: selectedSubject.name,
      tutor: selectedTutor.name,
      tutorImage: selectedTutor.image,
      date: "Today",
      status: "active",
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative flex w-full max-w-[760px] max-h-[85vh] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-100 px-8 py-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Create Assignment
            </h2>

            <p className="mt-1 text-gray-500">
              Assign a tutor to a student's subject.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Stepper */}

        <div className="border-b border-gray-100 px-8 py-5">
          <AssignmentStepper step={step} />
        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {step === 1 && (
            <StepOneStudent
              students={students}
              selectedStudent={selectedStudent}
              onSelect={setSelectedStudent}
            />
          )}

          {step === 2 && (
            <StepTwoSubject
              student={selectedStudent}
              selectedSubject={selectedSubject}
              onSelect={setSelectedSubject}
            />
          )}

          {step === 3 && (
            <StepThreeTutor
              student={selectedStudent}
              subject={selectedSubject}
              tutors={tutors}
              selectedTutor={selectedTutor}
              onSelect={setSelectedTutor}
            />
          )}
        </div>

        {/* Footer */}

        <div className="border-t border-gray-100 px-8 py-6">
          <ModalFooter
            step={step}
            canContinue={canContinue}
            onClose={onClose}
            onBack={handleBack}
            onNext={handleNext}
            onCreate={handleCreate}
          />
        </div>
      </div>
    </div>
  );
}
