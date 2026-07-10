import { supabase } from "./supabase";

/**
 * Get all subjects
 */
export async function getSubjects() {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

/**
 * Get only active subjects
 */
export async function getActiveSubjects() {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("status", "active")
    .order("name", { ascending: true });

  if (error) throw error;

  return data ?? [];
}

/**
 * Create subject
 */
export async function createSubject(subject) {
  const { data, error } = await supabase
    .from("subjects")
    .insert({
      name: subject.name,
      category: subject.category || null,
      color: subject.color,
      status: subject.status || "active",
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Update subject
 */
export async function updateSubject(id, subject) {
  const { data, error } = await supabase
    .from("subjects")
    .update({
      name: subject.name,
      category: subject.category || null,
      color: subject.color,
      status: subject.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Delete subject
 */
export async function deleteSubject(id) {
  const { error } = await supabase.from("subjects").delete().eq("id", id);

  if (error) throw error;

  return true;
}
