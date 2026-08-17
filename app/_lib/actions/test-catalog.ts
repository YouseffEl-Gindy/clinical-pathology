"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createTest,
  updateTest,
  deleteTest,
} from "@/app/_lib/data/test-catalog";
import { redirectWithError, requireRole } from "@/app/_lib/actions/guards";
import {
  TEST_REQUIRED_ERROR,
  isCompleteTestForm,
  parseTestForm,
  pgErrorMessage,
} from "@/app/_lib/helpers";
import { ADMIN_ROLES } from "@/app/_lib/constants";

export async function addTest(formData: FormData) {
  const supabase = await requireRole(ADMIN_ROLES, "/pathologist/catalog");

  const fields = parseTestForm(formData);
  if (!isCompleteTestForm(fields)) {
    redirectWithError("/pathologist/catalog", TEST_REQUIRED_ERROR);
  }

  // `active` and `priceRaw` are form-only concerns — a new test is always active.
  const { name, price, code, specimen_type, unit } = fields;

  try {
    await createTest(supabase, { name, price, code, specimen_type, unit });
  } catch (err) {
    redirectWithError(
      "/pathologist/catalog",
      pgErrorMessage(err, "Failed to add test")
    );
  }

  revalidatePath("/pathologist/catalog");
}

export async function editTest(formData: FormData) {
  const id = formData.get("id") as string;
  const returnPath = `/pathologist/catalog/${id}/edit`;
  const supabase = await requireRole(ADMIN_ROLES, returnPath);

  const fields = parseTestForm(formData);
  if (!isCompleteTestForm(fields)) {
    redirectWithError(returnPath, TEST_REQUIRED_ERROR);
  }

  const { name, price, code, specimen_type, unit, active } = fields;

  try {
    await updateTest(supabase, id, {
      name,
      price,
      code,
      specimen_type,
      unit,
      active,
    });
  } catch (err) {
    redirectWithError(
      returnPath,
      pgErrorMessage(err, "Failed to update test")
    );
  }

  revalidatePath("/pathologist/catalog");
  redirect("/pathologist/catalog");
}

export async function deleteTestAction(formData: FormData) {
  const supabase = await requireRole(ADMIN_ROLES, "/pathologist/catalog");

  const id = formData.get("id") as string;

  try {
    await deleteTest(supabase, id);
  } catch (err) {
    redirectWithError(
      "/pathologist/catalog",
      pgErrorMessage(err, "Failed to delete test", {
        "23503":
          "This test has been used in orders and can't be deleted. Deactivate it instead.",
      })
    );
  }

  revalidatePath("/pathologist/catalog");
}
