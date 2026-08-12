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

export async function getTestOrderStatusesForCases(
  supabase: SupabaseClient,
  caseIds: string[]
) {
  const { data, error } = await supabase
    .from("test_orders")
    .select("case_id, status")
    .in("case_id", caseIds);
  if (error) throw error;
  return data;
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

export async function getSamplerBoardTestOrders(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("test_orders")
    .select(
      "*, test_catalog(name, code, specimen_type), cases(id, patient_id, created_at, patients(first_name, last_name, phone))"
    )
    .in("status", ["ordered", "sampled"])
    .order("created_at", { ascending: true, referencedTable: "cases" })
    .order("name", { ascending: true, referencedTable: "test_catalog" });
  if (error) throw error;
  return data;
}

export async function markTestOrderSampled(
  supabase: SupabaseClient,
  id: string,
  sampledBy: string
) {
  const { error } = await supabase
    .from("test_orders")
    .update({
      status: "sampled",
      sampled_by: sampledBy,
      sampled_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw error;
}
