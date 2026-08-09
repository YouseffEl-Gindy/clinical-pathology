import type { SupabaseClient } from "@supabase/supabase-js";

export async function getMyRole(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("get_my_role");
  if (error) throw error;
  return data as string | null;
}
