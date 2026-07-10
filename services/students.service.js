import { supabase } from "./supabase";

const STUDENT_SELECT = `
  *,
  student_subjects (
    subject_id,
    subjects (
      id,
      name,
      color,
      status
    )
  )
`;

function normalizeStudent(student) {
  return {
    ...student,
    full_name: `${student.first_name || ""} ${student.last_name || ""}`.trim(),

    subjects:
      student.student_subjects?.map((item) => item.subjects).filter(Boolean) ||
      [],
  };
}

/**
 * Fetch every student with their selected subjects.
 */
export async function getStudents() {
  const { data, error } = await supabase
    .from("students")
    .select(STUDENT_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map(normalizeStudent);
}

/**
 * Create a student and attach selected subjects.
 */
export async function createStudent(studentData) {
  const {
    subject_ids = [],
    full_name,
    subjects,
    student_subjects,
    ...studentPayload
  } = studentData;

  const { data: createdStudent, error: studentError } = await supabase
    .from("students")
    .insert({
      first_name: studentPayload.first_name.trim(),
      last_name: studentPayload.last_name.trim(),
      email: studentPayload.email.trim().toLowerCase(),
      phone: studentPayload.phone || null,
      grade: studentPayload.grade.trim(),
      curriculum: studentPayload.curriculum,
      timezone: studentPayload.timezone,
      preferred_days: studentPayload.preferred_days,
      preferred_start_time: studentPayload.preferred_start_time,
      preferred_end_time: studentPayload.preferred_end_time,
      avatar_url: studentPayload.avatar_url || null,
      status: "pending",
    })
    .select()
    .single();

  if (studentError) {
    throw studentError;
  }

  if (subject_ids.length > 0) {
    const subjectRows = subject_ids.map((subjectId) => ({
      student_id: createdStudent.id,
      subject_id: subjectId,
    }));

    const { error: subjectError } = await supabase
      .from("student_subjects")
      .insert(subjectRows);

    if (subjectError) {
      // Best-effort rollback if attaching subjects fails.
      await supabase.from("students").delete().eq("id", createdStudent.id);

      throw subjectError;
    }
  }

  return getStudentById(createdStudent.id);
}

/**
 * Fetch a single student.
 */
export async function getStudentById(studentId) {
  const { data, error } = await supabase
    .from("students")
    .select(STUDENT_SELECT)
    .eq("id", studentId)
    .single();

  if (error) {
    throw error;
  }

  return normalizeStudent(data);
}

/**
 * Update student information and replace selected subjects.
 */
export async function updateStudent(studentId, studentData) {
  if (!studentId) {
    throw new Error("Student ID is required.");
  }

  const {
    subject_ids = [],
    full_name,
    subjects,
    student_subjects,
    id,
    created_at,
    updated_at,
    auth_user_id,
    ...studentPayload
  } = studentData;

  const { error: updateError } = await supabase
    .from("students")
    .update({
      first_name: studentPayload.first_name.trim(),
      last_name: studentPayload.last_name.trim(),
      email: studentPayload.email.trim().toLowerCase(),
      phone: studentPayload.phone || null,
      grade: studentPayload.grade.trim(),
      curriculum: studentPayload.curriculum,
      timezone: studentPayload.timezone,
      preferred_days: studentPayload.preferred_days,
      preferred_start_time: studentPayload.preferred_start_time,
      preferred_end_time: studentPayload.preferred_end_time,
      avatar_url: studentPayload.avatar_url || null,
      status: studentPayload.status || "pending",
      updated_at: new Date().toISOString(),
    })
    .eq("id", studentId);

  if (updateError) {
    throw updateError;
  }

  const { error: deleteSubjectsError } = await supabase
    .from("student_subjects")
    .delete()
    .eq("student_id", studentId);

  if (deleteSubjectsError) {
    throw deleteSubjectsError;
  }

  if (subject_ids.length > 0) {
    const newSubjectRows = subject_ids.map((subjectId) => ({
      student_id: studentId,
      subject_id: subjectId,
    }));

    const { error: insertSubjectsError } = await supabase
      .from("student_subjects")
      .insert(newSubjectRows);

    if (insertSubjectsError) {
      throw insertSubjectsError;
    }
  }

  return getStudentById(studentId);
}

/**
 * Delete a student.
 *
 * student_subjects should use ON DELETE CASCADE.
 */
export async function deleteStudent(studentId) {
  if (!studentId) {
    throw new Error("Student ID is required.");
  }

  const { error } = await supabase
    .from("students")
    .delete()
    .eq("id", studentId);

  if (error) {
    throw error;
  }

  return true;
}
