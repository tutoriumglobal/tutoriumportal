"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FiBookOpen, FiPlus, FiSearch } from "react-icons/fi";
import { toast } from "sonner";

import SubjectGrid from "./SubjectGrid";
import AddSubjectModal from "./AddSubjectModal";
import EditSubjectModal from "./EditSubjectModal";
import DeleteSubjectModal from "./DeleteSubjectModal";

import ErrorState from "../../ui/ErrorState";
import LoadingSkeleton from "../../ui/LoadingSkeleton";

import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
} from "../../../../services/subjects.service";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState(null);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadSubjects = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error("Unable to load subjects:", error);

      const message =
        error?.message || "Unable to load subjects. Please try again.";

      setPageError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const filteredSubjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return subjects;
    }

    return subjects.filter((subject) => {
      const name = subject.name?.toLowerCase() || "";
      const category = subject.category?.toLowerCase() || "";
      const status = subject.status?.toLowerCase() || "";

      return (
        name.includes(query) ||
        category.includes(query) ||
        status.includes(query)
      );
    });
  }, [search, subjects]);

  async function handleAddSubject(formData) {
    setCreating(true);

    try {
      const createdSubject = await createSubject(formData);

      setSubjects((current) => [createdSubject, ...current]);
      setShowAddModal(false);

      toast.success("Subject added successfully.");
    } catch (error) {
      console.error("Unable to create subject:", error);

      if (error?.code === "23505") {
        toast.error("A subject with this name already exists.");
      } else {
        toast.error(error?.message || "Unable to add subject.");
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleEditSubject(formData) {
    if (!subjectToEdit) return;

    setUpdating(true);

    try {
      const updatedSubject = await updateSubject(subjectToEdit.id, formData);

      setSubjects((current) =>
        current.map((subject) =>
          subject.id === updatedSubject.id ? updatedSubject : subject,
        ),
      );

      setSubjectToEdit(null);
      toast.success("Subject updated successfully.");
    } catch (error) {
      console.error("Unable to update subject:", error);

      if (error?.code === "23505") {
        toast.error("A subject with this name already exists.");
      } else {
        toast.error(error?.message || "Unable to update subject.");
      }
    } finally {
      setUpdating(false);
    }
  }

  async function handleDeleteSubject() {
    if (!subjectToDelete) return;

    setDeleting(true);

    try {
      await deleteSubject(subjectToDelete.id);

      setSubjects((current) =>
        current.filter((subject) => subject.id !== subjectToDelete.id),
      );

      setSubjectToDelete(null);
      toast.success("Subject deleted successfully.");
    } catch (error) {
      console.error("Unable to delete subject:", error);

      if (error?.code === "23503") {
        toast.error(
          "This subject cannot be deleted because it is assigned to a student or tutor.",
        );
      } else {
        toast.error(error?.message || "Unable to delete subject.");
      }
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div>
        <SubjectPageHeader total={0} onAdd={() => setShowAddModal(true)} />

        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  if (pageError) {
    return (
      <div>
        <SubjectPageHeader total={0} onAdd={() => setShowAddModal(true)} />

        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <ErrorState
            title="Unable to load subjects"
            message={pageError}
            onRetry={loadSubjects}
          />
        </section>
      </div>
    );
  }

  return (
    <div>
      <SubjectPageHeader
        total={subjects.length}
        onAdd={() => setShowAddModal(true)}
      />

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full max-w-[430px] items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3">
            <FiSearch className="shrink-0 text-xl text-gray-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search subjects..."
              className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 text-gray-500">
            <FiBookOpen />
            <span>{filteredSubjects.length} results</span>
          </div>
        </div>

        <SubjectGrid
          subjects={filteredSubjects}
          hasSearch={Boolean(search.trim())}
          onEdit={setSubjectToEdit}
          onDelete={setSubjectToDelete}
          onAdd={() => setShowAddModal(true)}
          onClearSearch={() => setSearch("")}
        />
      </section>

      {showAddModal && (
        <AddSubjectModal
          isSubmitting={creating}
          onClose={() => {
            if (!creating) {
              setShowAddModal(false);
            }
          }}
          onAddSubject={handleAddSubject}
        />
      )}

      {subjectToEdit && (
        <EditSubjectModal
          subject={subjectToEdit}
          isSubmitting={updating}
          onClose={() => {
            if (!updating) {
              setSubjectToEdit(null);
            }
          }}
          onSave={handleEditSubject}
        />
      )}

      {subjectToDelete && (
        <DeleteSubjectModal
          subject={subjectToDelete}
          isDeleting={deleting}
          onClose={() => {
            if (!deleting) {
              setSubjectToDelete(null);
            }
          }}
          onDelete={handleDeleteSubject}
        />
      )}
    </div>
  );
}

function SubjectPageHeader({ total, onAdd }) {
  return (
    <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-950 md:text-4xl">
          Subjects
        </h1>

        <p className="mt-2 text-lg text-gray-500">
          {total} {total === 1 ? "subject" : "subjects"} · Manage all available
          subjects
        </p>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#0b2d8a] px-6 py-3 text-lg font-bold text-white transition hover:bg-[#09246f] md:w-auto"
      >
        <FiPlus className="text-xl" />
        Add Subject
      </button>
    </div>
  );
}
