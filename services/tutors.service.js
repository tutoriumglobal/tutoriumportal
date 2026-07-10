export async function getTutors(supabase) {
  const { data, error } = await supabase
    .from("tutors")
    .select(
      `
      *,
      tutor_subjects (
        subject_id,
        subjects (
          id,
          name,
          category
        )
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createTutor(supabase, tutorData, subjectIds = []) {
  const { data: tutor, error: tutorError } = await supabase
    .from("tutors")
    .insert({
      full_name: tutorData.full_name,
      email: tutorData.email,
      phone: tutorData.phone || null,
      availability: tutorData.availability || null,
      qualification: tutorData.qualification || null,
      experience: tutorData.experience || null,
      bio: tutorData.bio || null,
      avatar_url: tutorData.avatar_url || null,
      status: tutorData.status || "active",
    })
    .select()
    .single();

  if (tutorError) {
    throw new Error(tutorError.message);
  }

  if (subjectIds.length > 0) {
    const subjectRows = subjectIds.map((subjectId) => ({
      tutor_id: tutor.id,
      subject_id: subjectId,
    }));

    const { error: subjectsError } = await supabase
      .from("tutor_subjects")
      .insert(subjectRows);

    if (subjectsError) {
      await supabase.from("tutors").delete().eq("id", tutor.id);
      throw new Error(subjectsError.message);
    }
  }

  return tutor;
}
