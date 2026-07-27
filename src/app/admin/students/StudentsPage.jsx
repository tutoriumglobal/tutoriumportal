"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2, FiUsers } from "react-icons/fi";
import { toast } from "sonner";

import AddStudentModal from "./AddStudentModal";
import EditStudentModal from "./EditStudentModal";
import DeleteStudentModal from "./DeleteStudentModal";

import EmptyState from "../../ui/EmptyState";
import ErrorState from "../../ui/ErrorState";
import LoadingSkeleton from "../../ui/LoadingSkeleton";

import { getActiveSubjects } from "../../../../services/subjects.service";

import {
  createStudent,
  deleteStudent,
  getStudents,
  updateStudent,
} from "../../../../services/students.service";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [creatingStudent, setCreatingStudent] = useState(false);
  const [updatingStudent, setUpdatingStudent] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState(false);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error("Unable to load students:", error);

      const message =
        error?.message || "Unable to load students. Please try again.";

      setPageError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSubjects = useCallback(async () => {
    setSubjectsLoading(true);

    try {
      const data = await getActiveSubjects();
      setSubjects(data);
    } catch (error) {
      console.error("Unable to load subjects:", error);
      toast.error(error?.message || "Unable to load subjects.");
    } finally {
      setSubjectsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
    loadSubjects();
  }, [loadStudents, loadSubjects]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return students;
    }

    return students.filter((student) => {
      const searchableText = [
        student.first_name,
        student.last_name,
        student.full_name,
        student.email,
        student.grade,
        student.curriculum,
        student.timezone,
        ...(student.subjects || []).map((subject) => subject.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [search, students]);

  const activeStudents = students.filter(
    (student) => student.status === "active",
  ).length;

  async function handleAddStudent(formData) {
    setCreatingStudent(true);

    try {
      const createdStudent = await createStudent(formData);

      setStudents((current) => [createdStudent, ...current]);
      setShowAddModal(false);

      toast.success("Student added successfully.");
    } catch (error) {
      console.error("Unable to add student:", error);
      toast.error(error?.message || "Unable to add student.");
    } finally {
      setCreatingStudent(false);
    }
  }

  async function handleUpdateStudent(formData) {
    if (!studentToEdit) return;

    setUpdatingStudent(true);

    try {
      const updatedStudent = await updateStudent(studentToEdit.id, formData);

      setStudents((current) =>
        current.map((student) =>
          student.id === updatedStudent.id ? updatedStudent : student,
        ),
      );

      setStudentToEdit(null);
      toast.success("Student updated successfully.");
    } catch (error) {
      console.error("Unable to update student:", error);
      toast.error(error?.message || "Unable to update student.");
    } finally {
      setUpdatingStudent(false);
    }
  }

  async function handleDeleteStudent() {
    if (!studentToDelete) return;

    setDeletingStudent(true);

    try {
      await deleteStudent(studentToDelete.id);

      setStudents((current) =>
        current.filter((student) => student.id !== studentToDelete.id),
      );

      setStudentToDelete(null);
      toast.success("Student deleted successfully.");
    } catch (error) {
      console.error("Unable to delete student:", error);

      if (error?.code === "23503") {
        toast.error(
          "This student cannot be deleted because related records still exist.",
        );
      } else {
        toast.error(error?.message || "Unable to delete student.");
      }
    } finally {
      setDeletingStudent(false);
    }
  }

  if (loading) {
    return (
      <div>
        <StudentsHeader
          total={0}
          active={0}
          onAdd={() => setShowAddModal(true)}
        />

        <LoadingSkeleton rows={5} />
      </div>
    );
  }

  if (pageError) {
    return (
      <div>
        <StudentsHeader
          total={0}
          active={0}
          onAdd={() => setShowAddModal(true)}
        />

        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <ErrorState
            title="Unable to load students"
            message={pageError}
            onRetry={loadStudents}
          />
        </section>
      </div>
    );
  }

  return (
    <div>
      <StudentsHeader
        total={students.length}
        active={activeStudents}
        onAdd={() => setShowAddModal(true)}
      />

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full max-w-[460px] items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3">
            <FiSearch className="shrink-0 text-xl text-gray-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, grade, curriculum..."
              className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 text-gray-500">
            <FiUsers />

            <span>
              {filteredStudents.length}{" "}
              {filteredStudents.length === 1 ? "result" : "results"}
            </span>
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          search.trim() ? (
            <EmptyState
              emoji="🔍"
              title="No matching students"
              description="No students match your search. Try another name, grade, curriculum, or subject."
              actionLabel="Clear Search"
              onAction={() => setSearch("")}
            />
          ) : (
            <EmptyState
              emoji="🎓"
              title="No students yet"
              description="Add your first student to begin assigning subjects and tutors."
              actionLabel="Add Student"
              onAction={() => setShowAddModal(true)}
            />
          )
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <TableHeading>Student</TableHeading>
                    <TableHeading>Grade</TableHeading>
                    <TableHeading>Curriculum</TableHeading>
                    <TableHeading>Subjects</TableHeading>
                    <TableHeading>Status</TableHeading>
                    <TableHeading>Actions</TableHeading>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student) => (
                    <StudentDesktopRow
                      key={student.id}
                      student={student}
                      onEdit={() => setStudentToEdit(student)}
                      onDelete={() => setStudentToDelete(student)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 p-4 md:hidden">
              {filteredStudents.map((student) => (
                <StudentMobileCard
                  key={student.id}
                  student={student}
                  onEdit={() => setStudentToEdit(student)}
                  onDelete={() => setStudentToDelete(student)}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {showAddModal && (
        <AddStudentModal
          subjects={subjects}
          subjectsLoading={subjectsLoading}
          isSubmitting={creatingStudent}
          onClose={() => {
            if (!creatingStudent) {
              setShowAddModal(false);
            }
          }}
          onAddStudent={handleAddStudent}
        />
      )}

      {studentToEdit && (
        <EditStudentModal
          student={studentToEdit}
          subjects={subjects}
          subjectsLoading={subjectsLoading}
          isSubmitting={updatingStudent}
          onClose={() => {
            if (!updatingStudent) {
              setStudentToEdit(null);
            }
          }}
          onSave={handleUpdateStudent}
        />
      )}

      {studentToDelete && (
        <DeleteStudentModal
          student={studentToDelete}
          isDeleting={deletingStudent}
          onClose={() => {
            if (!deletingStudent) {
              setStudentToDelete(null);
            }
          }}
          onDelete={handleDeleteStudent}
        />
      )}
    </div>
  );
}

function StudentsHeader({ total, active, onAdd }) {
  return (
    <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-950 md:text-4xl">
          Students
        </h1>

        <p className="mt-2 text-lg text-gray-500">
          {total} enrolled · {active} active
        </p>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#0b2d8a] px-6 py-3 text-lg font-bold text-white transition hover:bg-[#09246f] md:w-auto"
      >
        <FiPlus className="text-xl" />
        Add Student
      </button>
    </div>
  );
}

function TableHeading({ children }) {
  return (
    <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
      {children}
    </th>
  );
}

function StudentDesktopRow({ student, onEdit, onDelete }) {
  return (
    <tr className="border-b border-gray-100 last:border-b-0">
      <td className="px-8 py-6">
        <StudentIdentity student={student} />
      </td>

      <td className="px-8 py-6 text-gray-600">{student.grade || "—"}</td>

      <td className="px-8 py-6 text-gray-600">{student.curriculum || "—"}</td>

      <td className="px-8 py-6">
        <div className="flex max-w-[320px] flex-wrap gap-2">
          {student.subjects?.length ? (
            student.subjects.map((subject) => (
              <SubjectBadge key={subject.id} subject={subject} />
            ))
          ) : (
            <span className="text-sm text-gray-400">No subjects</span>
          )}
        </div>
      </td>

      <td className="px-8 py-6">
        <StatusBadge status={student.status} />
      </td>

      <td className="px-8 py-6">
        <StudentActions
          studentName={student.full_name}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
}

function StudentMobileCard({ student, onEdit, onDelete }) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <StudentIdentity student={student} />
        <StatusBadge status={student.status} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {student.subjects?.length ? (
          student.subjects.map((subject) => (
            <SubjectBadge key={subject.id} subject={subject} />
          ))
        ) : (
          <span className="text-sm text-gray-400">No subjects</span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 text-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Grade
          </p>

          <p className="mt-1 text-gray-600">{student.grade || "—"}</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Curriculum
          </p>

          <p className="mt-1 text-gray-600">{student.curriculum || "—"}</p>
        </div>
      </div>

      <div className="mt-5 flex justify-end border-t border-gray-100 pt-4">
        <StudentActions
          studentName={student.full_name}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </article>
  );
}

function StudentActions({ studentName, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit ${studentName}`}
        title="Edit student"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-[#0b2d8a] hover:bg-[#0b2d8a]/10 hover:text-[#0b2d8a]"
      >
        <FiEdit2 />
      </button>

      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${studentName}`}
        title="Delete student"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-red-500 transition hover:border-red-400 hover:bg-red-50 hover:text-red-600"
      >
        <FiTrash2 />
      </button>
    </div>
  );
}

function StudentIdentity({ student }) {
  const initials = getInitials(student.full_name);

  return (
    <div className="flex min-w-0 items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0b2d8a]/10 text-sm font-bold text-[#0b2d8a]">
        {initials || "ST"}
      </div>

      <div className="min-w-0">
        <p className="truncate text-base font-bold text-gray-900">
          {student.full_name}
        </p>

        <p className="truncate text-sm text-gray-400">{student.email}</p>
      </div>
    </div>
  );
}

function SubjectBadge({ subject }) {
  const color = subject.color || "#0B2D8A";

  return (
    <span
      className="rounded-full px-3 py-1 text-xs font-semibold"
      style={{
        color,
        backgroundColor: hexToRgba(color, 0.1),
      }}
    >
      {subject.name}
    </span>
  );
}

function StatusBadge({ status = "pending" }) {
  const styles = {
    pending: "bg-amber-50 text-amber-700",
    active: "bg-green-50 text-green-700",
    inactive: "bg-gray-100 text-gray-500",
  };

  return (
    <span
      className={`inline-flex rounded-full px-4 py-1 text-xs font-semibold capitalize ${
        styles[status] || styles.pending
      }`}
    >
      {status}
    </span>
  );
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
