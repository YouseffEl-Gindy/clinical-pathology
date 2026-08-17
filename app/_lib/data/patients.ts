import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/app/_lib/types/database.types";
import { PAGE_SIZE } from "@/app/_lib/constants";

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

export async function updatePatient(
  supabase: SupabaseClient,
  id: string,
  updates: TablesUpdate<"patients">
) {
  const { data, error } = await supabase
    .from("patients")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Tables<"patients">;
}

export async function deletePatient(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from("patients").delete().eq("id", id);
  if (error) throw error;
}

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
