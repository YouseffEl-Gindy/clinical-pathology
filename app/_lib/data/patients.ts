import type { SupabaseClient } from "@supabase/supabase-js";
import type { Tables, TablesInsert } from "@/app/_lib/types/database.types";

export async function createPatient(
  supabase: SupabaseClient,
  patient: TablesInsert<"patients">
) {
  const { data, error } = await supabase
    .from("patients")
    .insert(patient)
    .select()
    .single();
  if (error) throw error;
  return data as Tables<"patients">;
}

export async function getPatientById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Tables<"patients">;
}

const PAGE_SIZE = 20;

export async function getPatients(
  supabase: SupabaseClient,
  { phone, page = 1 }: { phone?: string; page?: number } = {}
) {
  let query = supabase
    .from("patients")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (phone) {
    query = query.ilike("phone", `%${phone}%`);
  }

  const from = (page - 1) * PAGE_SIZE;
  const { data, error, count } = await query.range(from, from + PAGE_SIZE - 1);
  if (error) throw error;

  return {
    patients: data as Tables<"patients">[],
    count: count ?? 0,
    pageSize: PAGE_SIZE,
  };
}
