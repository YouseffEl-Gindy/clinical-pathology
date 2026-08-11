"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/app/_lib/supabase/server";
import { getMyRole, getMyProfile } from "@/app/_lib/data/profiles";
import { createCase, updateCase, deleteCase } from "@/app/_lib/data/cases";
import { getTestsByIds } from "@/app/_lib/data/test-catalog";
import {
  createTestOrders,
  deleteTestOrders,
  getTestOrdersForCase,
} from "@/app/_lib/data/test-orders";

export async function addCase(formData: FormData) {
  const supabase = await createClient();
  const role = await getMyRole(supabase);

  const patient_id = formData.get("patient_id") as string;

  if (!patient_id) {
    redirect(
      "/receptionist/cases/new?error=" +
        encodeURIComponent("Select a patient before creating a case")
    );
  }

  if (role !== "receptionist" && role !== "pathologist") {
    redirect(
      `/receptionist/cases/new?patientId=${patient_id}&error=Not authorized`
    );
  }

  const is_pregnant = formData.get("is_pregnant") === "on";
  const smoker = formData.get("smoker") === "on";
  const athletic = formData.get("athletic") === "on";
  const alcoholic = formData.get("alcoholic") === "on";
  const has_diet_plan = formData.get("has_diet_plan") === "on";
  const has_prior_contract = formData.get("has_prior_contract") === "on";

  const came_from = (formData.get("came_from") as string)?.trim() || null;
  const fasting_since =
    (formData.get("fasting_since") as string)?.trim() || null;
  const drugs_used = (formData.get("drugs_used") as string)?.trim() || null;
  const doctor_advice =
    (formData.get("doctor_advice") as string)?.trim() || null;
  const referring_doctor =
    (formData.get("referring_doctor") as string)?.trim() || null;

  const payment_status = (formData.get("payment_status") as string) || null;
  const payment_method = (formData.get("payment_method") as string) || null;

  const testIds = formData.getAll("test_ids") as string[];
  if (testIds.length === 0) {
    redirect(
      `/receptionist/cases/new?patientId=${patient_id}&error=` +
        encodeURIComponent("Select at least one test")
    );
  }

  let caseRecord;
  try {
    const profile = await getMyProfile(supabase);

    caseRecord = await createCase(supabase, {
      patient_id,
      is_pregnant,
      smoker,
      athletic,
      alcoholic,
      has_diet_plan,
      has_prior_contract,
      came_from,
      fasting_since,
      drugs_used,
      doctor_advice,
      referring_doctor,
      payment_status,
      payment_method,
      created_by: profile.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create case";
    redirect(
      `/receptionist/cases/new?patientId=${patient_id}&error=` +
        encodeURIComponent(message)
    );
  }

  try {
    const tests = await getTestsByIds(supabase, testIds);
    await createTestOrders(
      supabase,
      tests.map((test) => ({
        case_id: caseRecord.id,
        test_id: test.id,
        status: "ordered",
        price_snapshot: test.price,
      }))
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to order tests";
    redirect(
      `/receptionist/cases/${caseRecord.id}?error=` + encodeURIComponent(message)
    );
  }

  revalidatePath("/receptionist/cases/new");
  redirect(`/receptionist/cases/${caseRecord.id}`);
}

export async function editCase(formData: FormData) {
  const supabase = await createClient();
  const role = await getMyRole(supabase);

  const id = formData.get("id") as string;

  if (role !== "receptionist" && role !== "pathologist") {
    redirect(`/receptionist/cases/${id}/edit?error=Not authorized`);
  }

  const currentOrders = await getTestOrdersForCase(supabase, id);
  if (currentOrders.some((order) => order.status !== "ordered")) {
    redirect(
      `/receptionist/cases/${id}?error=` +
        encodeURIComponent(
          "This case can no longer be edited because testing has started"
        )
    );
  }

  const is_pregnant = formData.get("is_pregnant") === "on";
  const smoker = formData.get("smoker") === "on";
  const athletic = formData.get("athletic") === "on";
  const alcoholic = formData.get("alcoholic") === "on";
  const has_diet_plan = formData.get("has_diet_plan") === "on";
  const has_prior_contract = formData.get("has_prior_contract") === "on";

  const came_from = (formData.get("came_from") as string)?.trim() || null;
  const fasting_since =
    (formData.get("fasting_since") as string)?.trim() || null;
  const drugs_used = (formData.get("drugs_used") as string)?.trim() || null;
  const doctor_advice =
    (formData.get("doctor_advice") as string)?.trim() || null;
  const referring_doctor =
    (formData.get("referring_doctor") as string)?.trim() || null;

  const payment_status = (formData.get("payment_status") as string) || null;
  const payment_method = (formData.get("payment_method") as string) || null;

  const selectedTestIds = formData.getAll("test_ids") as string[];
  if (selectedTestIds.length === 0) {
    redirect(
      `/receptionist/cases/${id}/edit?error=` +
        encodeURIComponent("Select at least one test")
    );
  }

  try {
    await updateCase(supabase, id, {
      is_pregnant,
      smoker,
      athletic,
      alcoholic,
      has_diet_plan,
      has_prior_contract,
      came_from,
      fasting_since,
      drugs_used,
      doctor_advice,
      referring_doctor,
      payment_status,
      payment_method,
    });

    const currentTestIds = currentOrders.map((order) => order.test_id);
    const testIdsToAdd = selectedTestIds.filter(
      (testId) => !currentTestIds.includes(testId)
    );
    const orderIdsToRemove = currentOrders
      .filter((order) => !selectedTestIds.includes(order.test_id))
      .map((order) => order.id);

    if (testIdsToAdd.length > 0) {
      const tests = await getTestsByIds(supabase, testIdsToAdd);
      await createTestOrders(
        supabase,
        tests.map((test) => ({
          case_id: id,
          test_id: test.id,
          status: "ordered",
          price_snapshot: test.price,
        }))
      );
    }

    if (orderIdsToRemove.length > 0) {
      await deleteTestOrders(supabase, orderIdsToRemove);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update case";
    redirect(
      `/receptionist/cases/${id}/edit?error=` + encodeURIComponent(message)
    );
  }

  revalidatePath(`/receptionist/cases/${id}`);
  redirect(`/receptionist/cases/${id}`);
}

export async function deleteCaseAction(formData: FormData) {
  const supabase = await createClient();
  const role = await getMyRole(supabase);

  const id = formData.get("id") as string;

  if (role !== "receptionist" && role !== "pathologist") {
    redirect(`/receptionist/cases/${id}?error=Not authorized`);
  }

  const currentOrders = await getTestOrdersForCase(supabase, id);
  if (currentOrders.some((order) => order.status !== "ordered")) {
    redirect(
      `/receptionist/cases/${id}?error=` +
        encodeURIComponent(
          "This case can no longer be deleted because testing has started"
        )
    );
  }

  try {
    if (currentOrders.length > 0) {
      await deleteTestOrders(
        supabase,
        currentOrders.map((order) => order.id)
      );
    }
    await deleteCase(supabase, id);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete case";
    redirect(`/receptionist/cases/${id}?error=` + encodeURIComponent(message));
  }

  revalidatePath("/receptionist/cases");
  redirect("/receptionist/cases");
}
