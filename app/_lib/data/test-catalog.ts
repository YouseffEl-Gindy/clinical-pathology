import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/app/_lib/types/database.types";

export async function getTestCatalog(
  supabase: SupabaseClient,
  opts?: { activeOnly?: boolean }
) {
  let query = supabase
    .from("test_catalog")
    .select("*")
    .order("name", { ascending: true });

  if (opts?.activeOnly) {
    query = query.eq("active", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Tables<"test_catalog">[];
}

export async function getTestsByIds(supabase: SupabaseClient, ids: string[]) {
  const { data, error } = await supabase
    .from("test_catalog")
    .select("*")
    .in("id", ids);
  if (error) throw error;
  return data as Tables<"test_catalog">[];
}

export async function getTestById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("test_catalog")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Tables<"test_catalog">;
}

export async function createTest(
  supabase: SupabaseClient,
  test: TablesInsert<"test_catalog">
) {
  const { data, error } = await supabase
    .from("test_catalog")
    .insert(test)
    .select()
    .single();
  if (error) throw error;
  return data as Tables<"test_catalog">;
}

export async function updateTest(
  supabase: SupabaseClient,
  id: string,
  updates: TablesUpdate<"test_catalog">
) {
  const { data, error } = await supabase
    .from("test_catalog")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Tables<"test_catalog">;
}

export async function deleteTest(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from("test_catalog").delete().eq("id", id);
  if (error) throw error;
}
