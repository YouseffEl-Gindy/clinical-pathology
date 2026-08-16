import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/app/_lib/types/database.types";
import type { SamplerBoardCase, ChemistBoardCase } from "@/app/_lib/types/domain";

export async function createCase(
  supabase: SupabaseClient,
  caseData: TablesInsert<"cases">,
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

export async function updateCase(
  supabase: SupabaseClient,
  id: string,
  updates: TablesUpdate<"cases">,
) {
  const { data, error } = await supabase
    .from("cases")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Tables<"cases">;
}

export async function deleteCase(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from("cases").delete().eq("id", id);
  if (error) throw error;
}

export async function getCasesForPatient(
  supabase: SupabaseClient,
  patientId: string,
) {
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Tables<"cases">[];
}

export async function getSamplerBoardCases(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("cases")
    .select(
      "id, created_at, patients!inner(first_name, last_name, phone), test_orders!inner(id, status, sampled_at, test_catalog!inner(name, code, specimen_type))",
    )
    .in("test_orders.status", ["ordered", "sampled"])
    .order("created_at", { ascending: true })
    .order("id", { ascending: true })
    .order("name", {
      ascending: true,
      referencedTable: "test_orders.test_catalog",
    });

  if (error) throw error;

  return data as unknown as SamplerBoardCase[];
}

export async function getChemistBoardCases(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("cases")
    .select(
      "id, created_at, patients!inner(first_name, last_name, phone), test_orders!inner(id, status, test_catalog!inner(name, code, specimen_type, unit))",
    )
    .in("test_orders.status", ["sampled"])
    .order("created_at", { ascending: true })
    .order("id", { ascending: true })
    .order("name", {
      ascending: true,
      referencedTable: "test_orders.test_catalog",
    });
  if (error) throw error;
  return data as unknown as ChemistBoardCase[];
}

const PAGE_SIZE = 20;

export async function getCases(
  supabase: SupabaseClient,
  { phone, page = 1 }: { phone?: string; page?: number } = {},
) {
  let query = supabase
    .from("cases")
    .select("*, patients!inner(first_name, last_name, phone)", {
      count: "exact",
    })
    .order("created_at", { ascending: false });

  if (phone) {
    query = query.ilike("patients.phone", `%${phone}%`);
  }

  const from = (page - 1) * PAGE_SIZE;
  const { data, error, count } = await query.range(from, from + PAGE_SIZE - 1);
  if (error) throw error;

  return {
    cases: data,
    count: count ?? 0,
    pageSize: PAGE_SIZE,
  };
}
