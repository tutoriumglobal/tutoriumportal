export async function getAssignments(supabase) {
  const { data, error } = await supabase
    .from("assignments")
    .select(
      `
      *,
      students (
        id,
        full_name,
        grade,
        avatar_url
      ),
      tutors (
        id,
        full_name,
        avatar_url
      ),
      subjects (
        id,
        name
      )
    `,
    )
    .order("assigned_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createAssignment(
  supabase,
  { studentId, tutorId, subjectId },
) {
  const { data, error } = await supabase
    .from("assignments")
    .insert({
      student_id: studentId,
      tutor_id: tutorId,
      subject_id: subjectId,
      status: "active",
    })
    .select(
      `
      *,
      students (*),
      tutors (*),
      subjects (*)
    `,
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getQualifiedTutors(supabase, subjectId) {
  const { data, error } = await supabase
    .from("tutor_subjects")
    .select(
      `
      tutor_id,
      tutors (*)
    `,
    )
    .eq("subject_id", subjectId);

  if (error) {
    throw new Error(error.message);
  }

  return data.map((row) => row.tutors);
}
