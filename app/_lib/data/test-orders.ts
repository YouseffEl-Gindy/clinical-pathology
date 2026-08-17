import type { SupabaseClient } from "@supabase/supabase-js";
import type { TablesInsert } from "@/app/_lib/types/database.types";
import { PAGE_SIZE } from "@/app/_lib/constants";

export async function createTestOrders(
  supabase: SupabaseClient,
  orders: TablesInsert<"test_orders">[],
) {
  const { data, error } = await supabase
    .from("test_orders")
    .insert(orders)
    .select();
  if (error) throw error;
  return data;
}

export async function deleteTestOrders(
  supabase: SupabaseClient,
  ids: string[],
) {
  const { error } = await supabase.from("test_orders").delete().in("id", ids);
  if (error) throw error;
}

export async function getTestOrderStatusesForCases(
  supabase: SupabaseClient,
  caseIds: string[],
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
  caseId: string,
) {
  const { data, error } = await supabase
    .from("test_orders")
    .select("*, test_catalog(name, code, price, unit)")
    .eq("case_id", caseId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function markTestOrderSampled(
  supabase: SupabaseClient,
  id: string,
  sampledBy: string,
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

export async function getChemistBoardTestOrdersPaginated(
  supabase: SupabaseClient,
  { testIds, page = 1 }: { testIds?: string[]; page?: number } = {},
) {
  let query = supabase
    .from("test_orders")
    .select(
      "*, test_catalog!inner(name, code, specimen_type, unit), cases!inner(id, patient_id, created_at, patients(first_name, last_name, phone))",
      { count: "exact" },
    )
    .in("status", ["sampled"])
    .order("id", { ascending: true });

  if (testIds && testIds.length > 0) {
    query = query.in("test_id", testIds);
  }

  const from = (page - 1) * PAGE_SIZE;
  const { data, error, count } = await query.range(from, from + PAGE_SIZE - 1);
  if (error) throw error;

  return { orders: data, count: count ?? 0, pageSize: PAGE_SIZE };
}

export async function getChemistHistoryTestOrders(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("test_orders")
    .select(
      "*, test_catalog!inner(name, code, specimen_type, unit), cases!inner(id, patient_id, created_at, patients(first_name, last_name, phone)), processed_by_profile:profiles!test_orders_processed_by_fkey(full_name)",
    )
    .in("status", ["processed"])
    .order("created_at", { ascending: true, referencedTable: "cases" })
    .order("id", { ascending: true, referencedTable: "cases" })
    .order("name", { ascending: true, referencedTable: "test_catalog" })
    .order("id", { ascending: true, referencedTable: "test_catalog" });
  if (error) throw error;
  return data;
}

export async function markTestOrderProcessed(
  supabase: SupabaseClient,
  id: string,
  processedBy: string,
  resultValue: number,
) {
  const { data: order, error: fetchError } = await supabase
    .from("test_orders")
    .select("test_catalog(unit)")
    .eq("id", id)
    .single();
  if (fetchError) throw fetchError;

  const unit = Array.isArray(order.test_catalog)
    ? (order.test_catalog[0]?.unit ?? null)
    : ((order.test_catalog as { unit: string | null } | null)?.unit ?? null);

  const { error } = await supabase
    .from("test_orders")
    .update({
      status: "processed",
      processed_by: processedBy,
      processed_at: new Date().toISOString(),
      result_value: resultValue,
      result_unit: unit,
    })
    .eq("id", id);
  if (error) throw error;
}
