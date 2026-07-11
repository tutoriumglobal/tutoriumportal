"use client";

import { useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2, FiUsers } from "react-icons/fi";
import { toast } from "sonner";

import AddTutorModal from "./AddTutorModal";
import EditTutorModal from "./EditTutorModal";
import DeleteTutorModal from "./DeleteTutorModal";

import EmptyState from "../../ui/EmptyState";

const availableSpecialties = [
  { id: 1, name: "Mathematics", color: "#0B2D8A" },
  { id: 2, name: "English", color: "#7C3AED" },
  { id: 3, name: "Science", color: "#059669" },
  { id: 4, name: "Physics", color: "#E52525" },
  { id: 5, name: "Chemistry", color: "#0891B2" },
  { id: 6, name: "French", color: "#BE185D" },
];

export default function TutorsPage() {
  const [tutors, setTutors] = useState([]);
  const [search, setSearch] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [tutorToEdit, setTutorToEdit] = useState(null);
  const [tutorToDelete, setTutorToDelete] = useState(null);

  const [creatingTutor, setCreatingTutor] = useState(false);
  const [updatingTutor, setUpdatingTutor] = useState(false);
  const [deletingTutor, setDeletingTutor] = useState(false);

  const filteredTutors = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return tutors;
    }

    return tutors.filter((tutor) => {
      const searchableText = [
        tutor.first_name,
        tutor.last_name,
        tutor.full_name,
        tutor.email,
        tutor.phone,
        tutor.timezone,
        tutor.qualification,
        tutor.experience,
        tutor.status,
        ...(tutor.specialties || []).map((specialty) => specialty.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [search, tutors]);

  const activeTutors = tutors.filter(
    (tutor) => tutor.status === "active",
  ).length;

  async function handleAddTutor(formData) {
    setCreatingTutor(true);

    try {
      const selectedSpecialties = availableSpecialties.filter((specialty) =>
        formData.specialty_ids.includes(specialty.id),
      );

      const newTutor = {
        id: Date.now(),
        first_name: formData.first_name,
        last_name: formData.last_name,
        full_name: `${formData.first_name} ${formData.last_name}`,
        email: formData.email,
        phone: formData.phone,
        timezone: formData.timezone,
        available_days: formData.available_days,
        available_start_time: formData.available_start_time,
        available_end_time: formData.available_end_time,
        qualification: formData.qualification,
        experience: formData.experience,
        bio: formData.bio,
        status: formData.status || "pending",
        avatar_url: null,
        specialties: selectedSpecialties,
      };

      setTutors((current) => [newTutor, ...current]);
      setShowAddModal(false);

      toast.success("Tutor added successfully.");
    } catch (error) {
      console.error("Unable to add tutor:", error);
      toast.error(error?.message || "Unable to add tutor.");
    } finally {
      setCreatingTutor(false);
    }
  }

  async function handleUpdateTutor(formData) {
    if (!tutorToEdit) return;

    setUpdatingTutor(true);

    try {
      const selectedSpecialties = availableSpecialties.filter((specialty) =>
        formData.specialty_ids.includes(specialty.id),
      );

      const updatedTutor = {
        ...tutorToEdit,
        ...formData,
        full_name: `${formData.first_name} ${formData.last_name}`,
        specialties: selectedSpecialties,
      };

      setTutors((current) =>
        current.map((tutor) =>
          tutor.id === updatedTutor.id ? updatedTutor : tutor,
        ),
      );

      setTutorToEdit(null);
      toast.success("Tutor updated successfully.");
    } catch (error) {
      console.error("Unable to update tutor:", error);
      toast.error(error?.message || "Unable to update tutor.");
    } finally {
      setUpdatingTutor(false);
    }
  }

  async function handleDeleteTutor() {
    if (!tutorToDelete) return;

    setDeletingTutor(true);

    try {
      setTutors((current) =>
        current.filter((tutor) => tutor.id !== tutorToDelete.id),
      );

      setTutorToDelete(null);
      toast.success("Tutor deleted successfully.");
    } catch (error) {
      console.error("Unable to delete tutor:", error);
      toast.error(error?.message || "Unable to delete tutor.");
    } finally {
      setDeletingTutor(false);
    }
  }

  return (
    <div>
      <TutorsHeader
        total={tutors.length}
        active={activeTutors}
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
              placeholder="Search by name, specialty, timezone..."
              className="w-full bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 text-gray-500">
            <FiUsers />

            <span>
              {filteredTutors.length}{" "}
              {filteredTutors.length === 1 ? "result" : "results"}
            </span>
          </div>
        </div>

        {filteredTutors.length === 0 ? (
          search.trim() ? (
            <EmptyState
              emoji="🔍"
              title="No matching tutors"
              description="No tutors match your search. Try another name, specialty, or timezone."
              actionLabel="Clear Search"
              onAction={() => setSearch("")}
            />
          ) : (
            <EmptyState
              emoji="👨‍🏫"
              title="No tutors yet"
              description="Add your first tutor to begin matching learners with qualified tutors."
              actionLabel="Add Tutor"
              onAction={() => setShowAddModal(true)}
            />
          )
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <TableHeading>Tutor</TableHeading>
                    <TableHeading>Specialties</TableHeading>
                    <TableHeading>Availability</TableHeading>
                    <TableHeading>Timezone</TableHeading>
                    <TableHeading>Status</TableHeading>
                    <TableHeading>Actions</TableHeading>
                  </tr>
                </thead>

                <tbody>
                  {filteredTutors.map((tutor) => (
                    <TutorDesktopRow
                      key={tutor.id}
                      tutor={tutor}
                      onEdit={() => setTutorToEdit(tutor)}
                      onDelete={() => setTutorToDelete(tutor)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 p-4 md:hidden">
              {filteredTutors.map((tutor) => (
                <TutorMobileCard
                  key={tutor.id}
                  tutor={tutor}
                  onEdit={() => setTutorToEdit(tutor)}
                  onDelete={() => setTutorToDelete(tutor)}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {showAddModal && (
        <AddTutorModal
          specialties={availableSpecialties}
          isSubmitting={creatingTutor}
          onClose={() => {
            if (!creatingTutor) {
              setShowAddModal(false);
            }
          }}
          onAddTutor={handleAddTutor}
        />
      )}

      {tutorToEdit && (
        <EditTutorModal
          tutor={tutorToEdit}
          specialties={availableSpecialties}
          isSubmitting={updatingTutor}
          onClose={() => {
            if (!updatingTutor) {
              setTutorToEdit(null);
            }
          }}
          onSave={handleUpdateTutor}
        />
      )}

      {tutorToDelete && (
        <DeleteTutorModal
          tutor={tutorToDelete}
          isDeleting={deletingTutor}
          onClose={() => {
            if (!deletingTutor) {
              setTutorToDelete(null);
            }
          }}
          onDelete={handleDeleteTutor}
        />
      )}
    </div>
  );
}

function TutorsHeader({ total, active, onAdd }) {
  return (
    <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-950 md:text-4xl">Tutors</h1>

        <p className="mt-2 text-lg text-gray-500">
          {total} total · {active} active
        </p>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#0b2d8a] px-6 py-3 text-lg font-bold text-white transition hover:bg-[#09246f] md:w-auto"
      >
        <FiPlus className="text-xl" />
        Add Tutor
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

function TutorDesktopRow({ tutor, onEdit, onDelete }) {
  return (
    <tr className="border-b border-gray-100 last:border-b-0">
      <td className="px-8 py-6">
        <TutorIdentity tutor={tutor} />
      </td>

      <td className="px-8 py-6">
        <SpecialtyList specialties={tutor.specialties} />
      </td>

      <td className="px-8 py-6 text-sm text-gray-600">
        <p>{formatDays(tutor.available_days)}</p>

        <p className="mt-1 text-gray-400">
          {formatTimeRange(
            tutor.available_start_time,
            tutor.available_end_time,
          )}
        </p>
      </td>

      <td className="px-8 py-6 text-gray-600">{tutor.timezone || "—"}</td>

      <td className="px-8 py-6">
        <StatusBadge status={tutor.status} />
      </td>

      <td className="px-8 py-6">
        <TutorActions
          tutorName={tutor.full_name}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
}

function TutorMobileCard({ tutor, onEdit, onDelete }) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <TutorIdentity tutor={tutor} />
        <StatusBadge status={tutor.status} />
      </div>

      <div className="mt-4">
        <SpecialtyList specialties={tutor.specialties} />
      </div>

      <div className="mt-4 grid gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Availability
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {formatDays(tutor.available_days)}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {formatTimeRange(
              tutor.available_start_time,
              tutor.available_end_time,
            )}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Timezone
          </p>

          <p className="mt-1 text-sm text-gray-600">{tutor.timezone || "—"}</p>
        </div>
      </div>

      <div className="mt-5 flex justify-end border-t border-gray-100 pt-4">
        <TutorActions
          tutorName={tutor.full_name}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </article>
  );
}

function TutorActions({ tutorName, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit ${tutorName}`}
        title="Edit tutor"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-[#0b2d8a] hover:bg-[#0b2d8a]/10 hover:text-[#0b2d8a]"
      >
        <FiEdit2 />
      </button>

      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${tutorName}`}
        title="Delete tutor"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-red-500 transition hover:border-red-400 hover:bg-red-50 hover:text-red-600"
      >
        <FiTrash2 />
      </button>
    </div>
  );
}

function TutorIdentity({ tutor }) {
  return (
    <div className="flex min-w-0 items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0b2d8a]/10 text-sm font-bold text-[#0b2d8a]">
        {getInitials(tutor.full_name) || "TU"}
      </div>

      <div className="min-w-0">
        <p className="truncate text-base font-bold text-gray-900">
          {tutor.full_name}
        </p>

        <p className="truncate text-sm text-gray-400">{tutor.email}</p>
      </div>
    </div>
  );
}

function SpecialtyList({ specialties = [] }) {
  if (!specialties.length) {
    return <span className="text-sm text-gray-400">No specialties</span>;
  }

  return (
    <div className="flex max-w-[300px] flex-wrap gap-2">
      {specialties.map((specialty) => (
        <span
          key={specialty.id}
          className="rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            color: specialty.color || "#0B2D8A",
            backgroundColor: hexToRgba(specialty.color || "#0B2D8A", 0.1),
          }}
        >
          {specialty.name}
        </span>
      ))}
    </div>
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

function formatDays(days = []) {
  return days.length ? days.join(", ") : "No availability";
}

function formatTimeRange(startTime, endTime) {
  if (!startTime || !endTime) {
    return "No time provided";
  }

  return `${startTime} – ${endTime}`;
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
