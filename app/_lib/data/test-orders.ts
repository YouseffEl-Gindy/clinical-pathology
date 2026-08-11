import type { SupabaseClient } from "@supabase/supabase-js";
import type { TablesInsert } from "@/app/_lib/types/database.types";

export async function createTestOrders(
  supabase: SupabaseClient,
  orders: TablesInsert<"test_orders">[]
) {
  const { data, error } = await supabase
    .from("test_orders")
    .insert(orders)
    .select();
  if (error) throw error;
  return data;
}

export async function deleteTestOrders(supabase: SupabaseClient, ids: string[]) {
  const { error } = await supabase.from("test_orders").delete().in("id", ids);
  if (error) throw error;
}

export async function getTestOrdersForCase(
  supabase: SupabaseClient,
  caseId: string
) {
  const { data, error } = await supabase
    .from("test_orders")
    .select("*, test_catalog(name, code, price, unit)")
    .eq("case_id", caseId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}
