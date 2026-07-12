import { supabase } from "./supabase";

const ASSIGNMENT_SELECT = `
  id,
  student_id,
  subject_id,
  tutor_id,
  status,
  created_at,
  updated_at,
  students (
    id,
    first_name,
    last_name,
    email,
    grade,
    curriculum,
    timezone,
    preferred_days,
    preferred_start_time,
    preferred_end_time,
    status
  ),
  subjects (
    id,
    name,
    color,
    status
  ),
  tutors (
    id,
    first_name,
    last_name,
    email,
    timezone,
    available_days,
    available_start_time,
    available_end_time,
    specialties,
    qualification,
    status
  )
`;

function normalizeAssignment(assignment) {
  if (!assignment) return null;

  const student = assignment.students
    ? {
        ...assignment.students,
        full_name: `${assignment.students.first_name || ""} ${
          assignment.students.last_name || ""
        }`.trim(),
      }
    : null;

  const tutor = assignment.tutors
    ? {
        ...assignment.tutors,
        full_name: `${assignment.tutors.first_name || ""} ${
          assignment.tutors.last_name || ""
        }`.trim(),
        specialties: Array.isArray(assignment.tutors.specialties)
          ? assignment.tutors.specialties
          : [],
        available_days: Array.isArray(assignment.tutors.available_days)
          ? assignment.tutors.available_days
          : [],
      }
    : null;

  return {
    ...assignment,
    student,
    tutor,
    subject: assignment.subjects || null,
  };
}

export async function getAssignments() {
  const { data, error } = await supabase
    .from("assignments")
    .select(ASSIGNMENT_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(normalizeAssignment);
}

export async function getAssignmentById(assignmentId) {
  const { data, error } = await supabase
    .from("assignments")
    .select(ASSIGNMENT_SELECT)
    .eq("id", assignmentId)
    .single();

  if (error) throw error;

  return normalizeAssignment(data);
}

export async function getAssignmentFormData() {
  const [
    studentsResult,
    studentSubjectsResult,
    tutorsResult,
    assignmentsResult,
  ] = await Promise.all([
    supabase
      .from("students")
      .select(
        `
        id,
        first_name,
        last_name,
        email,
        grade,
        curriculum,
        timezone,
        preferred_days,
        preferred_start_time,
        preferred_end_time,
        status
      `,
      )
      .in("status", ["active", "pending"])
      .order("first_name"),

    supabase.from("student_subjects").select(`
        student_id,
        subject_id,
        subjects (
          id,
          name,
          color,
          status
        )
      `),

    supabase
      .from("tutors")
      .select(
        `
        id,
        first_name,
        last_name,
        email,
        phone,
        timezone,
        available_days,
        available_start_time,
        available_end_time,
        specialties,
        qualification,
        experience,
        status
      `,
      )
      .eq("status", "active")
      .order("first_name"),

    supabase
      .from("assignments")
      .select("id, student_id, subject_id, tutor_id, status"),
  ]);

  if (studentsResult.error) throw studentsResult.error;
  if (studentSubjectsResult.error) {
    throw studentSubjectsResult.error;
  }
  if (tutorsResult.error) throw tutorsResult.error;
  if (assignmentsResult.error) throw assignmentsResult.error;

  const students = (studentsResult.data || []).map((student) => ({
    ...student,
    full_name: `${student.first_name || ""} ${student.last_name || ""}`.trim(),
    preferred_days: Array.isArray(student.preferred_days)
      ? student.preferred_days
      : [],
    subjects: [],
  }));

  const studentMap = new Map(
    students.map((student) => [String(student.id), student]),
  );

  for (const link of studentSubjectsResult.data || []) {
    const student = studentMap.get(String(link.student_id));

    if (student && link.subjects && link.subjects.status === "active") {
      student.subjects.push(link.subjects);
    }
  }

  const tutors = (tutorsResult.data || []).map((tutor) => ({
    ...tutor,
    full_name: `${tutor.first_name || ""} ${tutor.last_name || ""}`.trim(),
    specialties: Array.isArray(tutor.specialties) ? tutor.specialties : [],
    available_days: Array.isArray(tutor.available_days)
      ? tutor.available_days
      : [],
  }));

  return {
    students,
    tutors,
    existingAssignments: assignmentsResult.data || [],
  };
}

export async function createAssignment(payload) {
  const { data, error } = await supabase
    .from("assignments")
    .insert({
      student_id: payload.student_id,
      subject_id: payload.subject_id,
      tutor_id: payload.tutor_id,
      status: payload.status || "active",
    })
    .select("id")
    .single();

  if (error) throw error;

  return getAssignmentById(data.id);
}

export async function updateAssignment(assignmentId, payload) {
  const { data, error } = await supabase
    .from("assignments")
    .update({
      student_id: payload.student_id,
      subject_id: payload.subject_id,
      tutor_id: payload.tutor_id,
      status: payload.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", assignmentId)
    .select("id")
    .single();

  if (error) throw error;

  return getAssignmentById(data.id);
}

export async function deleteAssignment(assignmentId) {
  const { error } = await supabase
    .from("assignments")
    .delete()
    .eq("id", assignmentId);

  if (error) throw error;

  return true;
}
