"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiLoader,
  FiSearch,
  FiUsers,
  FiX,
} from "react-icons/fi";

export default function AssignmentModal({
  students = [],
  tutors = [],
  existingAssignments = [],
  onClose,
  onCreate,
  isSubmitting = false,
}) {
  const [step, setStep] = useState(1);
  const [studentSearch, setStudentSearch] = useState("");
  const [tutorSearch, setTutorSearch] = useState("");

  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  const [selectedTutorId, setSelectedTutorId] = useState(null);

  const selectedStudent = useMemo(
    () =>
      students.find(
        (student) => String(student.id) === String(selectedStudentId),
      ) || null,
    [students, selectedStudentId],
  );

  const selectedSubject = useMemo(
    () =>
      selectedStudent?.subjects?.find(
        (subject) => String(subject.id) === String(selectedSubjectId),
      ) || null,
    [selectedStudent, selectedSubjectId],
  );

  const filteredStudents = useMemo(() => {
    const query = studentSearch.trim().toLowerCase();

    if (!query) return students;

    return students.filter((student) => {
      const text = [
        student.full_name,
        student.email,
        student.grade,
        student.curriculum,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(query);
    });
  }, [students, studentSearch]);

  const rankedTutors = useMemo(() => {
    if (!selectedStudent || !selectedSubject) return [];

    return tutors
      .map((tutor) => {
        const match = calculateTutorMatch({
          student: selectedStudent,
          tutor,
          subject: selectedSubject,
        });

        return {
          ...tutor,
          match_score: match.score,
          match_reasons: match.reasons,
          subject_match: match.subjectMatch,
          availability_match: match.availabilityMatch,
        };
      })
      .filter((tutor) => tutor.subject_match)
      .filter((tutor) => {
        const query = tutorSearch.trim().toLowerCase();

        if (!query) return true;

        return [
          tutor.full_name,
          tutor.email,
          tutor.qualification,
          tutor.timezone,
          ...(tutor.specialties || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => b.match_score - a.match_score);
  }, [tutors, selectedStudent, selectedSubject, tutorSearch]);

  useEffect(() => {
    setSelectedTutorId(null);
  }, [selectedStudentId, selectedSubjectId]);

  function subjectAlreadyAssigned(subjectId) {
    return existingAssignments.some(
      (assignment) =>
        String(assignment.student_id) === String(selectedStudentId) &&
        String(assignment.subject_id) === String(subjectId) &&
        assignment.status !== "inactive",
    );
  }

  function selectStudent(studentId) {
    setSelectedStudentId(studentId);
    setSelectedSubjectId(null);
    setSelectedTutorId(null);
  }

  function continueFromStudent() {
    if (!selectedStudentId) return;
    setStep(2);
  }

  function continueFromSubject() {
    if (!selectedSubjectId) return;
    setStep(3);
  }

  async function handleSubmit() {
    if (!selectedStudentId || !selectedSubjectId || !selectedTutorId) {
      return;
    }

    await onCreate({
      student_id: selectedStudentId,
      subject_id: selectedSubjectId,
      tutor_id: selectedTutorId,
      status: "active",
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="assignment-modal-title"
        className="flex h-[92vh] w-full max-w-[760px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:h-[790px]"
      >
        <header className="flex shrink-0 items-start justify-between border-b border-gray-100 px-5 py-5 sm:px-8">
          <div>
            <h2
              id="assignment-modal-title"
              className="text-xl font-bold text-gray-900 sm:text-2xl"
            >
              Create Assignment
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Assign a tutor to a student&apos;s subject.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <FiX className="text-xl" />
          </button>
        </header>

        <AssignmentSteps step={step} />

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-8">
          {step === 1 && (
            <StudentStep
              students={filteredStudents}
              search={studentSearch}
              onSearch={setStudentSearch}
              selectedStudentId={selectedStudentId}
              onSelect={selectStudent}
            />
          )}

          {step === 2 && selectedStudent && (
            <SubjectStep
              student={selectedStudent}
              selectedSubjectId={selectedSubjectId}
              onSelect={setSelectedSubjectId}
              isAssigned={subjectAlreadyAssigned}
            />
          )}

          {step === 3 && selectedStudent && selectedSubject && (
            <TutorStep
              student={selectedStudent}
              subject={selectedSubject}
              tutors={rankedTutors}
              search={tutorSearch}
              onSearch={setTutorSearch}
              selectedTutorId={selectedTutorId}
              onSelect={setSelectedTutorId}
            />
          )}
        </div>

        <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-gray-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-8">
          {step === 1 ? (
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep((current) => current - 1)}
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
            >
              <FiArrowLeft />
              Back
            </button>
          )}

          {step === 1 && (
            <PrimaryButton
              disabled={!selectedStudentId}
              onClick={continueFromStudent}
            >
              Continue
              <FiArrowRight />
            </PrimaryButton>
          )}

          {step === 2 && (
            <PrimaryButton
              disabled={!selectedSubjectId}
              onClick={continueFromSubject}
            >
              Continue
              <FiArrowRight />
            </PrimaryButton>
          )}

          {step === 3 && (
            <PrimaryButton
              disabled={!selectedTutorId || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FiCheck />
                  Create Assignment
                </>
              )}
            </PrimaryButton>
          )}
        </footer>
      </div>
    </div>
  );
}

function AssignmentSteps({ step }) {
  const steps = [
    { number: 1, label: "Select Student" },
    { number: 2, label: "Choose Subject" },
    { number: 3, label: "Assign Tutor" },
  ];

  return (
    <div className="shrink-0 border-b border-gray-100 px-4 py-5 sm:px-8">
      <div className="mx-auto flex max-w-[600px] items-start justify-between">
        {steps.map((item, index) => {
          const completed = step > item.number;
          const active = step === item.number;

          return (
            <div
              key={item.number}
              className="flex flex-1 items-start last:flex-none"
            >
              <div className="flex min-w-[92px] flex-col items-center text-center sm:min-w-[120px]">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-base font-bold ${
                    completed
                      ? "bg-green-500 text-white"
                      : active
                        ? "bg-[#0b2d8a] text-white"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {completed ? <FiCheck /> : item.number}
                </div>

                <span
                  className={`mt-2 text-xs font-semibold sm:text-sm ${
                    completed
                      ? "text-green-600"
                      : active
                        ? "text-[#0b2d8a]"
                        : "text-gray-400"
                  }`}
                >
                  {item.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`mt-[21px] h-[2px] flex-1 ${
                    completed ? "bg-green-400" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StudentStep({
  students,
  search,
  onSearch,
  selectedStudentId,
  onSelect,
}) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-gray-800">
        Select a student to assign
      </h3>

      <SearchInput
        value={search}
        onChange={onSearch}
        placeholder="Search students by name, grade, or email..."
      />

      <div className="mt-4 space-y-3">
        {students.length ? (
          students.map((student) => {
            const selected = String(selectedStudentId) === String(student.id);

            return (
              <button
                key={student.id}
                type="button"
                onClick={() => onSelect(student.id)}
                className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                  selected
                    ? "border-[#0b2d8a] bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <InitialsAvatar name={student.full_name} />

                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-gray-900">
                    {student.full_name}
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    {student.grade || "No grade"} ·{" "}
                    {student.subjects?.length || 0} registered{" "}
                    {(student.subjects?.length || 0) === 1
                      ? "subject"
                      : "subjects"}
                  </p>
                </div>

                {selected && <SelectedIcon />}
              </button>
            );
          })
        ) : (
          <SimpleEmpty
            emoji="🔍"
            title="No students found"
            text="Try searching with another name, grade, or email."
          />
        )}
      </div>
    </div>
  );
}

function SubjectStep({ student, selectedSubjectId, onSelect, isAssigned }) {
  return (
    <div>
      <SelectedStudentSummary student={student} />

      <h3 className="mb-4 mt-6 text-lg font-bold text-gray-800">
        Select a subject to create an assignment for
      </h3>

      <div className="space-y-3">
        {student.subjects?.length ? (
          student.subjects.map((subject) => {
            const assigned = isAssigned(subject.id);
            const selected = String(selectedSubjectId) === String(subject.id);

            return (
              <button
                key={subject.id}
                type="button"
                disabled={assigned}
                onClick={() => onSelect(subject.id)}
                className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                  assigned
                    ? "cursor-not-allowed border-gray-100 bg-gray-50 opacity-55"
                    : selected
                      ? "border-[#0b2d8a] bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-xl"
                  style={{
                    color: subject.color || "#0B2D8A",
                    backgroundColor: hexToRgba(subject.color || "#0B2D8A", 0.1),
                  }}
                >
                  📖
                </div>

                <div className="flex-1">
                  <p
                    className={`font-bold ${
                      assigned ? "text-gray-400" : "text-gray-900"
                    }`}
                  >
                    {subject.name}
                  </p>

                  {assigned && (
                    <p className="mt-1 text-sm text-gray-400">
                      Already assigned
                    </p>
                  )}
                </div>

                {selected && !assigned && <SelectedIcon />}
              </button>
            );
          })
        ) : (
          <SimpleEmpty
            emoji="📚"
            title="No registered subjects"
            text="This student does not currently have any active subjects."
          />
        )}
      </div>
    </div>
  );
}

function TutorStep({
  student,
  subject,
  tutors,
  search,
  onSearch,
  selectedTutorId,
  onSelect,
}) {
  const bestTutor = tutors[0];

  return (
    <div>
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span
            className="rounded-full px-3 py-1 font-semibold"
            style={{
              color: subject.color || "#0B2D8A",
              backgroundColor: hexToRgba(subject.color || "#0B2D8A", 0.12),
            }}
          >
            {subject.name}
          </span>

          <span className="text-blue-500">for</span>

          <span className="font-bold text-[#0b2d8a]">{student.full_name}</span>
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Student timezone: {student.timezone || "Not provided"}
        </p>
      </div>

      <h3 className="mb-4 mt-6 text-lg font-bold text-gray-800">
        Assign a qualified tutor
      </h3>

      <SearchInput
        value={search}
        onChange={onSearch}
        placeholder="Search tutors manually..."
      />

      <div className="mt-4 space-y-3">
        {tutors.length ? (
          tutors.map((tutor) => {
            const selected = String(selectedTutorId) === String(tutor.id);

            const isBest =
              bestTutor &&
              String(bestTutor.id) === String(tutor.id) &&
              tutor.availability_match;

            return (
              <button
                key={tutor.id}
                type="button"
                onClick={() => onSelect(tutor.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  selected
                    ? "border-[#0b2d8a] bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="flex items-start gap-4">
                  <InitialsAvatar name={tutor.full_name} />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-gray-900">
                        {tutor.full_name}
                      </p>

                      {isBest && (
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                          Best match
                        </span>
                      )}

                      {!tutor.availability_match && (
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          Manual match
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-gray-400">
                      {formatDays(tutor.available_days)}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      {formatTimeRange(
                        tutor.available_start_time,
                        tutor.available_end_time,
                      )}{" "}
                      · {tutor.timezone || "No timezone"}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {tutor.match_reasons.map((reason) => (
                        <span
                          key={reason}
                          className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm font-bold text-[#0b2d8a]">
                      {tutor.match_score}%
                    </span>

                    {selected && <SelectedIcon />}
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <SimpleEmpty
            emoji="👨‍🏫"
            title="No qualified tutors found"
            text={`No active tutor currently lists ${subject.name} as a specialty.`}
          />
        )}
      </div>
    </div>
  );
}

function SelectedStudentSummary({ student }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
      <InitialsAvatar name={student.full_name} />

      <div>
        <p className="font-bold text-[#0b2d8a]">{student.full_name}</p>

        <p className="mt-1 text-sm text-blue-500">
          {student.subjects?.length || 0} registered subjects
        </p>
      </div>
    </div>
  );
}

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
      <FiSearch className="shrink-0 text-gray-400" />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
      />
    </div>
  );
}

function PrimaryButton({ children, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-bold text-white transition sm:w-auto ${
        disabled
          ? "cursor-not-allowed bg-[#0b2d8a]/50"
          : "bg-[#0b2d8a] hover:bg-[#09246f]"
      }`}
    >
      {children}
    </button>
  );
}

function InitialsAvatar({ name }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0b2d8a]/10 text-sm font-bold text-[#0b2d8a]">
      {getInitials(name) || "TU"}
    </div>
  );
}

function SelectedIcon() {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[#0b2d8a] text-[#0b2d8a]">
      <FiCheck />
    </span>
  );
}

function SimpleEmpty({ emoji, title, text }) {
  return (
    <div className="py-12 text-center">
      <div className="text-5xl">{emoji}</div>
      <h4 className="mt-4 font-bold text-gray-900">{title}</h4>
      <p className="mt-2 text-sm text-gray-500">{text}</p>
    </div>
  );
}

function calculateTutorMatch({ student, tutor, subject }) {
  let score = 0;
  const reasons = [];

  const normalizedSubject = normalizeText(subject.name);

  const specialtyMatches = (tutor.specialties || []).some((specialty) => {
    const normalizedSpecialty = normalizeText(specialty);

    return (
      normalizedSpecialty === normalizedSubject ||
      normalizedSpecialty.includes(normalizedSubject) ||
      normalizedSubject.includes(normalizedSpecialty)
    );
  });

  if (specialtyMatches) {
    score += 55;
    reasons.push("Subject specialist");
  }

  const commonDays = (student.preferred_days || []).filter((day) =>
    (tutor.available_days || []).includes(day),
  );

  if (commonDays.length) {
    score += Math.min(20, commonDays.length * 5);
    reasons.push(`${commonDays.length} matching day(s)`);
  }

  const timeOverlap = hasTimezoneAwareOverlap({
    student,
    tutor,
    commonDays,
  });

  if (timeOverlap) {
    score += 20;
    reasons.push("Time overlap");
  }

  if (
    student.timezone &&
    tutor.timezone &&
    student.timezone === tutor.timezone
  ) {
    score += 5;
    reasons.push("Same timezone");
  }

  return {
    score: Math.min(score, 100),
    reasons,
    subjectMatch: specialtyMatches,
    availabilityMatch: commonDays.length > 0 && timeOverlap,
  };
}

function hasTimezoneAwareOverlap({ student, tutor, commonDays }) {
  if (
    !commonDays.length ||
    !student.preferred_start_time ||
    !student.preferred_end_time ||
    !tutor.available_start_time ||
    !tutor.available_end_time
  ) {
    return false;
  }

  try {
    const day = commonDays[0];

    const studentStart = weeklyTimeToUtcMinutes({
      day,
      time: student.preferred_start_time,
      timezone: student.timezone,
    });

    const studentEnd = weeklyTimeToUtcMinutes({
      day,
      time: student.preferred_end_time,
      timezone: student.timezone,
    });

    const tutorStart = weeklyTimeToUtcMinutes({
      day,
      time: tutor.available_start_time,
      timezone: tutor.timezone,
    });

    const tutorEnd = weeklyTimeToUtcMinutes({
      day,
      time: tutor.available_end_time,
      timezone: tutor.timezone,
    });

    return Math.max(studentStart, tutorStart) < Math.min(studentEnd, tutorEnd);
  } catch {
    return (
      student.preferred_start_time < tutor.available_end_time &&
      tutor.available_start_time < student.preferred_end_time
    );
  }
}

function weeklyTimeToUtcMinutes({ day, time, timezone }) {
  const dayNumbers = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const [hour, minute] = time.split(":").map(Number);
  const targetDay = dayNumbers[day];

  const now = new Date();
  const currentDay = now.getUTCDay();

  let daysAhead = targetDay - currentDay;
  if (daysAhead < 0) daysAhead += 7;

  const approximateDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + daysAhead,
      hour,
      minute,
    ),
  );

  const timezoneOffset = getTimezoneOffsetMinutes(approximateDate, timezone);

  return targetDay * 1440 + hour * 60 + minute - timezoneOffset;
}

function getTimezoneOffsetMinutes(date, timezone) {
  if (!timezone) return 0;

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  const representedAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );

  return (representedAsUtc - date.getTime()) / 60000;
}

function normalizeText(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
}

function formatDays(days = []) {
  return days.length ? days.join(", ") : "No days provided";
}

function formatTimeRange(start, end) {
  if (!start || !end) return "No time provided";
  return `${start}–${end}`;
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function hexToRgba(hex, opacity) {
  const safeHex =
    typeof hex === "string" && /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : "#0B2D8A";

  const normalized = safeHex.replace("#", "");

  const red = parseInt(normalized.slice(0, 2), 16);
  const green = parseInt(normalized.slice(2, 4), 16);
  const blue = parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}
