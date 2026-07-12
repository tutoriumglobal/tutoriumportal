"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { FiEdit2, FiPlus, FiSearch, FiTrash2, FiUsers } from "react-icons/fi";

import { toast } from "sonner";

import AssignmentModal from "./AssignmentModal";
import EditAssignmentModal from "./EditAssignmentModal";
import DeleteAssignmentModal from "./DeleteAssignmentModal";

import EmptyState from "../../ui/EmptyState";
import ErrorState from "../../ui/ErrorState";
import LoadingSkeleton from "../../ui/LoadingSkeleton";

import {
  createAssignment,
  deleteAssignment,
  getAssignmentFormData,
  getAssignments,
  updateAssignment,
} from "../../../../services/assignments.service";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [existingAssignments, setExistingAssignments] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [assignmentToEdit, setAssignmentToEdit] = useState(null);

  const [assignmentToDelete, setAssignmentToDelete] = useState(null);

  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadPage = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const [assignmentData, formData] = await Promise.all([
        getAssignments(),
        getAssignmentFormData(),
      ]);

      setAssignments(assignmentData);
      setStudents(formData.students);
      setTutors(formData.tutors);
      setExistingAssignments(formData.existingAssignments);
    } catch (error) {
      console.error("Unable to load assignments:", error);

      const message = error?.message || "Unable to load assignments.";

      setPageError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const filteredAssignments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return assignments;

    return assignments.filter((assignment) =>
      [
        assignment.student?.full_name,
        assignment.student?.email,
        assignment.student?.grade,
        assignment.subject?.name,
        assignment.tutor?.full_name,
        assignment.tutor?.email,
        assignment.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [assignments, search]);

  const activeAssignments = assignments.filter(
    (assignment) => assignment.status === "active",
  ).length;

  async function handleCreate(payload) {
    setCreating(true);

    try {
      const created = await createAssignment(payload);

      setAssignments((current) => [created, ...current]);

      setExistingAssignments((current) => [
        {
          id: created.id,
          student_id: created.student_id,
          subject_id: created.subject_id,
          tutor_id: created.tutor_id,
          status: created.status,
        },
        ...current,
      ]);

      setShowCreateModal(false);
      toast.success("Assignment created successfully.");
    } catch (error) {
      console.error("Unable to create assignment:", error);

      if (error?.code === "23505") {
        toast.error("This subject is already assigned for this student.");
      } else {
        toast.error(error?.message || "Unable to create assignment.");
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdate(payload) {
    if (!assignmentToEdit) return;

    setUpdating(true);

    try {
      const updated = await updateAssignment(assignmentToEdit.id, payload);

      setAssignments((current) =>
        current.map((assignment) =>
          assignment.id === updated.id ? updated : assignment,
        ),
      );

      setExistingAssignments((current) =>
        current.map((assignment) =>
          assignment.id === updated.id
            ? {
                id: updated.id,
                student_id: updated.student_id,
                subject_id: updated.subject_id,
                tutor_id: updated.tutor_id,
                status: updated.status,
              }
            : assignment,
        ),
      );

      setAssignmentToEdit(null);
      toast.success("Assignment updated successfully.");
    } catch (error) {
      console.error("Unable to update assignment:", error);
      toast.error(error?.message || "Unable to update assignment.");
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!assignmentToDelete) return;

    setDeleting(true);

    try {
      await deleteAssignment(assignmentToDelete.id);

      setAssignments((current) =>
        current.filter((assignment) => assignment.id !== assignmentToDelete.id),
      );

      setExistingAssignments((current) =>
        current.filter((assignment) => assignment.id !== assignmentToDelete.id),
      );

      setAssignmentToDelete(null);
      toast.success("Assignment deleted successfully.");
    } catch (error) {
      console.error("Unable to delete assignment:", error);
      toast.error(error?.message || "Unable to delete assignment.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div>
        <AssignmentsHeader
          total={0}
          active={0}
          onAdd={() => setShowCreateModal(true)}
        />

        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  if (pageError) {
    return (
      <div>
        <AssignmentsHeader
          total={0}
          active={0}
          onAdd={() => setShowCreateModal(true)}
        />

        <ErrorState
          title="Unable to load assignments"
          message={pageError}
          onRetry={loadPage}
        />
      </div>
    );
  }

  return (
    <div>
      <AssignmentsHeader
        total={assignments.length}
        active={activeAssignments}
        onAdd={() => setShowCreateModal(true)}
      />

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full max-w-[480px] items-center gap-3 rounded-2xl border border-gray-200 px-5 py-3">
            <FiSearch className="text-xl text-gray-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student, subject, tutor..."
              className="w-full bg-transparent outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 text-gray-500">
            <FiUsers />

            <span>
              {filteredAssignments.length}{" "}
              {filteredAssignments.length === 1 ? "result" : "results"}
            </span>
          </div>
        </div>

        {filteredAssignments.length === 0 ? (
          search.trim() ? (
            <EmptyState
              emoji="🔍"
              title="No matching assignments"
              description="Try searching by student, subject, tutor, or status."
              actionLabel="Clear Search"
              onAction={() => setSearch("")}
            />
          ) : (
            <EmptyState
              emoji="📋"
              title="No assignments yet"
              description="Create your first assignment to match a student subject with a qualified tutor."
              actionLabel="Create Assignment"
              onAction={() => setShowCreateModal(true)}
            />
          )
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <Heading>Student</Heading>
                    <Heading>Subject</Heading>
                    <Heading>Tutor</Heading>
                    <Heading>Timezone</Heading>
                    <Heading>Status</Heading>
                    <Heading>Actions</Heading>
                  </tr>
                </thead>

                <tbody>
                  {filteredAssignments.map((assignment) => (
                    <AssignmentRow
                      key={assignment.id}
                      assignment={assignment}
                      onEdit={() => setAssignmentToEdit(assignment)}
                      onDelete={() => setAssignmentToDelete(assignment)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 p-4 md:hidden">
              {filteredAssignments.map((assignment) => (
                <AssignmentMobileCard
                  key={assignment.id}
                  assignment={assignment}
                  onEdit={() => setAssignmentToEdit(assignment)}
                  onDelete={() => setAssignmentToDelete(assignment)}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {showCreateModal && (
        <AssignmentModal
          students={students}
          tutors={tutors}
          existingAssignments={existingAssignments}
          isSubmitting={creating}
          onClose={() => {
            if (!creating) {
              setShowCreateModal(false);
            }
          }}
          onCreate={handleCreate}
        />
      )}

      {assignmentToEdit && (
        <EditAssignmentModal
          assignment={assignmentToEdit}
          tutors={tutors}
          isSubmitting={updating}
          onClose={() => {
            if (!updating) {
              setAssignmentToEdit(null);
            }
          }}
          onSave={handleUpdate}
        />
      )}

      {assignmentToDelete && (
        <DeleteAssignmentModal
          assignment={assignmentToDelete}
          isDeleting={deleting}
          onClose={() => {
            if (!deleting) {
              setAssignmentToDelete(null);
            }
          }}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

function AssignmentsHeader({ total, active, onAdd }) {
  return (
    <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-950 md:text-4xl">
          Assignments
        </h1>

        <p className="mt-2 text-lg text-gray-500">
          {total} total · {active} active
        </p>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#0b2d8a] px-6 py-3 text-lg font-bold text-white hover:bg-[#09246f] md:w-auto"
      >
        <FiPlus />
        New Assignment
      </button>
    </div>
  );
}

function Heading({ children }) {
  return (
    <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
      {children}
    </th>
  );
}

function AssignmentRow({ assignment, onEdit, onDelete }) {
  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="px-8 py-6">
        <Identity
          name={assignment.student?.full_name}
          subtext={assignment.student?.email}
        />
      </td>

      <td className="px-8 py-6">
        <SubjectBadge subject={assignment.subject} />
      </td>

      <td className="px-8 py-6">
        <Identity
          name={assignment.tutor?.full_name}
          subtext={assignment.tutor?.qualification}
        />
      </td>

      <td className="px-8 py-6 text-sm text-gray-600">
        <p>{assignment.student?.timezone || "—"}</p>
        <p className="mt-1 text-xs text-gray-400">
          Tutor: {assignment.tutor?.timezone || "—"}
        </p>
      </td>

      <td className="px-8 py-6">
        <StatusBadge status={assignment.status} />
      </td>

      <td className="px-8 py-6">
        <Actions onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  );
}

function AssignmentMobileCard({ assignment, onEdit, onDelete }) {
  return (
    <article className="rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-3">
        <Identity
          name={assignment.student?.full_name}
          subtext={assignment.student?.email}
        />

        <StatusBadge status={assignment.status} />
      </div>

      <div className="mt-4">
        <SubjectBadge subject={assignment.subject} />
      </div>

      <div className="mt-4 border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold uppercase text-gray-400">
          Assigned Tutor
        </p>

        <div className="mt-2">
          <Identity
            name={assignment.tutor?.full_name}
            subtext={assignment.tutor?.timezone}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
        <Actions onEdit={onEdit} onDelete={onDelete} />
      </div>
    </article>
  );
}

function Identity({ name, subtext }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0b2d8a]/10 text-sm font-bold text-[#0b2d8a]">
        {getInitials(name) || "NA"}
      </div>

      <div className="min-w-0">
        <p className="truncate font-bold text-gray-900">
          {name || "Not available"}
        </p>

        <p className="truncate text-sm text-gray-400">{subtext || "—"}</p>
      </div>
    </div>
  );
}

function SubjectBadge({ subject }) {
  if (!subject) return <span>—</span>;

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

function StatusBadge({ status = "active" }) {
  const styles = {
    active: "bg-green-50 text-green-700",
    pending: "bg-amber-50 text-amber-700",
    inactive: "bg-gray-100 text-gray-500",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        styles[status] || styles.pending
      }`}
    >
      {status}
    </span>
  );
}

function Actions({ onEdit, onDelete }) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onEdit}
        aria-label="Edit assignment"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#0b2d8a] hover:text-[#0b2d8a]"
      >
        <FiEdit2 />
      </button>

      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete assignment"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-red-500 hover:border-red-400 hover:bg-red-50"
      >
        <FiTrash2 />
      </button>
    </div>
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

  const value = safeHex.replace("#", "");

  return `rgba(${parseInt(value.slice(0, 2), 16)}, ${parseInt(
    value.slice(2, 4),
    16,
  )}, ${parseInt(value.slice(4, 6), 16)}, ${opacity})`;
}
