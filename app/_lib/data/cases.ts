import type { SupabaseClient } from "@supabase/supabase-js";
import type { Tables, TablesInsert } from "@/app/_lib/types/database.types";

export async function createCase(
  supabase: SupabaseClient,
  caseData: TablesInsert<"cases">
) {
  const { data, error } = await supabase
    .from("cases")
    .insert(caseData)
    .select()
    .single();
  if (error) throw error;
  return data as Tables<"cases">;
}

export async function getCaseById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Tables<"cases">;
}
