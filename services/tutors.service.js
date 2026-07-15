import { supabase } from "./supabase";

function normalizeTutor(tutor) {
  if (!tutor) return null;

  return {
    ...tutor,

    full_name: `${tutor.first_name || ""} ${tutor.last_name || ""}`.trim(),

    specialties: Array.isArray(tutor.specialties) ? tutor.specialties : [],

    available_days: Array.isArray(tutor.available_days)
      ? tutor.available_days
      : [],
  };
}

/**
 * Get all tutors.
 */
export async function getTutors() {
  const { data, error } = await supabase
    .from("tutors")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map(normalizeTutor);
}

/**
 * Get a single tutor.
 */
export async function getTutorById(tutorId) {
  if (!tutorId) {
    throw new Error("Tutor ID is required.");
  }

  const { data, error } = await supabase
    .from("tutors")
    .select("*")
    .eq("id", tutorId)
    .single();

  if (error) {
    throw error;
  }

  return normalizeTutor(data);
}

/**
 * Create a tutor.
 */
export async function createTutor(tutorData) {
  const payload = {
    first_name: tutorData.first_name.trim(),
    last_name: tutorData.last_name.trim(),
    email: tutorData.email.trim().toLowerCase(),
    phone: tutorData.phone?.trim() || null,

    timezone: tutorData.timezone,

    available_days: tutorData.available_days || [],
    available_start_time: tutorData.available_start_time,
    available_end_time: tutorData.available_end_time,

    qualification: tutorData.qualification.trim(),
    experience: tutorData.experience?.trim() || null,
    bio: tutorData.bio?.trim() || null,

    specialties: tutorData.specialties || [],

    avatar_url: tutorData.avatar_url || null,

    // New tutors must be manually approved.
    status: "pending",
  };

  const { data, error } = await supabase
    .from("tutors")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return normalizeTutor(data);
}

/**
 * Update a tutor.
 */
export async function updateTutor(tutorId, tutorData) {
  if (!tutorId) {
    throw new Error("Tutor ID is required.");
  }

  const response = await fetch(`/api/tutors/${tutorId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      first_name: tutorData.first_name,
      last_name: tutorData.last_name,
      email: tutorData.email,
      phone: tutorData.phone,
      timezone: tutorData.timezone,
      available_days: tutorData.available_days,
      available_start_time: tutorData.available_start_time,
      available_end_time: tutorData.available_end_time,
      qualification: tutorData.qualification,
      experience: tutorData.experience,
      bio: tutorData.bio,
      specialties: tutorData.specialties,
      avatar_url: tutorData.avatar_url,
      status: tutorData.status,
    }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Unable to update tutor.");
  }

  return {
    tutor: result.tutor,
    emailSent: result.email_sent === true,
    warning: result.warning || null,
  };
}

/**
 * Delete a tutor.
 */
export async function deleteTutor(tutorId) {
  if (!tutorId) {
    throw new Error("Tutor ID is required.");
  }

  const { error } = await supabase.from("tutors").delete().eq("id", tutorId);

  if (error) {
    throw error;
  }

  return true;
}
