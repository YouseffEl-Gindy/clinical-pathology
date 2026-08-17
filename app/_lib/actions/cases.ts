"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getMyProfile } from "@/app/_lib/data/profiles";
import { createCase, updateCase, deleteCase } from "@/app/_lib/data/cases";
import { getTestsByIds } from "@/app/_lib/data/test-catalog";
import {
  createTestOrders,
  deleteTestOrders,
  getTestOrdersForCase,
} from "@/app/_lib/data/test-orders";
import { redirectWithError, requireRole } from "@/app/_lib/actions/guards";
import { parseCaseForm } from "@/app/_lib/helpers";
import { RECEPTION_ROLES } from "@/app/_lib/constants";

const LOCKED_MESSAGE = (verb: string) =>
  `This case can no longer be ${verb} because testing has started`;

export async function addCase(formData: FormData) {
  const patient_id = formData.get("patient_id") as string;

  if (!patient_id) {
    redirectWithError(
      "/receptionist/cases/new",
      "Select a patient before creating a case"
    );
  }

  const returnPath = `/receptionist/cases/new?patientId=${patient_id}`;
  const supabase = await requireRole(RECEPTION_ROLES, returnPath);

  const testIds = formData.getAll("test_ids") as string[];
  if (testIds.length === 0) {
    redirectWithError(returnPath, "Select at least one test");
  }

  let caseRecord;
  try {
    const profile = await getMyProfile(supabase);
    caseRecord = await createCase(supabase, {
      patient_id,
      ...parseCaseForm(formData),
      created_by: profile.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create case";
    redirectWithError(returnPath, message);
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
    redirectWithError(`/receptionist/cases/${caseRecord.id}`, message);
  }

  revalidatePath("/receptionist/cases/new");
  redirect(`/receptionist/cases/${caseRecord.id}`);
}

export async function editCase(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await requireRole(
    RECEPTION_ROLES,
    `/receptionist/cases/${id}/edit`
  );

  const currentOrders = await getTestOrdersForCase(supabase, id);
  if (currentOrders.some((order) => order.status !== "ordered")) {
    redirectWithError(`/receptionist/cases/${id}`, LOCKED_MESSAGE("edited"));
  }

  const selectedTestIds = formData.getAll("test_ids") as string[];
  if (selectedTestIds.length === 0) {
    redirectWithError(
      `/receptionist/cases/${id}/edit`,
      "Select at least one test"
    );
  }

  try {
    await updateCase(supabase, id, parseCaseForm(formData));

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
    redirectWithError(`/receptionist/cases/${id}/edit`, message);
  }

  revalidatePath(`/receptionist/cases/${id}`);
  redirect(`/receptionist/cases/${id}`);
}

export async function deleteCaseAction(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await requireRole(
    RECEPTION_ROLES,
    `/receptionist/cases/${id}`
  );

  const currentOrders = await getTestOrdersForCase(supabase, id);
  if (currentOrders.some((order) => order.status !== "ordered")) {
    redirectWithError(`/receptionist/cases/${id}`, LOCKED_MESSAGE("deleted"));
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
    redirectWithError(`/receptionist/cases/${id}`, message);
  }

  revalidatePath("/receptionist/cases");
  redirect("/receptionist/cases");
}
