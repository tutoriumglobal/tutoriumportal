import { supabase } from "./supabase";

function getStartOfMonth() {
  const date = new Date();

  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1),
  ).toISOString();
}

function getStartOfWeek() {
  const date = new Date();
  const day = date.getUTCDay();

  const daysSinceMonday = day === 0 ? 6 : day - 1;

  date.setUTCDate(date.getUTCDate() - daysSinceMonday);
  date.setUTCHours(0, 0, 0, 0);

  return date.toISOString();
}

export async function getDashboardStats() {
  const startOfMonth = getStartOfMonth();
  const startOfWeek = getStartOfWeek();

  const [studentsResult, tutorsResult, assignmentsResult, subjectsResult] =
    await Promise.all([
      supabase.from("students").select("id, status, created_at"),

      supabase.from("tutors").select("id, status, created_at"),

      supabase.from("assignments").select("id, status, created_at"),

      supabase.from("subjects").select("id, status, created_at"),
    ]);

  if (studentsResult.error) {
    throw studentsResult.error;
  }

  if (tutorsResult.error) {
    throw tutorsResult.error;
  }

  if (assignmentsResult.error) {
    throw assignmentsResult.error;
  }

  if (subjectsResult.error) {
    throw subjectsResult.error;
  }

  const students = studentsResult.data ?? [];
  const tutors = tutorsResult.data ?? [];
  const assignments = assignmentsResult.data ?? [];
  const subjects = subjectsResult.data ?? [];

  const activeStudents = students.filter(
    (student) => student.status === "active",
  ).length;

  const activeTutors = tutors.filter(
    (tutor) => tutor.status === "active",
  ).length;

  const activeAssignments = assignments.filter(
    (assignment) => assignment.status === "active",
  ).length;

  const activeSubjects = subjects.filter(
    (subject) => subject.status === "active",
  ).length;

  const studentsThisMonth = students.filter(
    (student) =>
      student.created_at &&
      new Date(student.created_at) >= new Date(startOfMonth),
  ).length;

  const tutorsThisMonth = tutors.filter(
    (tutor) =>
      tutor.created_at && new Date(tutor.created_at) >= new Date(startOfMonth),
  ).length;

  const assignmentsThisWeek = assignments.filter(
    (assignment) =>
      assignment.created_at &&
      new Date(assignment.created_at) >= new Date(startOfWeek),
  ).length;

  const subjectsThisMonth = subjects.filter(
    (subject) =>
      subject.created_at &&
      new Date(subject.created_at) >= new Date(startOfMonth),
  ).length;

  return {
    students: {
      active: activeStudents,
      total: students.length,
      recent: studentsThisMonth,
    },

    tutors: {
      active: activeTutors,
      total: tutors.length,
      recent: tutorsThisMonth,
    },

    assignments: {
      active: activeAssignments,
      total: assignments.length,
      recent: assignmentsThisWeek,
    },

    subjects: {
      active: activeSubjects,
      total: subjects.length,
      recent: subjectsThisMonth,
    },
  };
}
