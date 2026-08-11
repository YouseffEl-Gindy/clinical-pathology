import type { SupabaseClient } from "@supabase/supabase-js";
import type { Tables } from "@/app/_lib/types/database.types";

export async function getMyRole(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("get_my_role");
  if (error) throw error;
  return data as string | null;
}

export async function getMyProfile(supabase: SupabaseClient) {
  const { data: auth } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, full_name")
    .eq("auth_user_id", auth.user?.id)
    .single();
  if (error) throw error;
  return data as Pick<Tables<"profiles">, "id" | "role" | "full_name">;
}
