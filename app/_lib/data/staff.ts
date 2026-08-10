import type { SupabaseClient } from "@supabase/supabase-js";
import type { Tables } from "@/app/_lib/types/database.types";

export async function getStaff(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Tables<"profiles">[];
}
