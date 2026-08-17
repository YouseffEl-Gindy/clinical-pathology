"use server";

import { revalidatePath } from "next/cache";
import { getMyProfile } from "@/app/_lib/data/profiles";
import {
  markTestOrderSampled,
  markTestOrderProcessed,
} from "@/app/_lib/data/test-orders";
import { redirectWithError, requireRole } from "@/app/_lib/actions/guards";
import { PROCESSING_ROLES, SAMPLING_ROLES } from "@/app/_lib/constants";

/** `ordered` → `sampled`. Stamps the sampler's profile id onto the order. */
export async function sampleTestOrder(formData: FormData) {
  const supabase = await requireRole(SAMPLING_ROLES, "/sampler");

  const id = formData.get("id") as string;

  try {
    const profile = await getMyProfile(supabase);
    await markTestOrderSampled(supabase, id, profile.id);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to mark test sampled";
    redirectWithError("/sampler", message);
  }

  revalidatePath("/sampler");
}

/** `sampled` → `processed`. Records the result and the chemist's profile id. */
export async function enterTestResult(formData: FormData) {
  const supabase = await requireRole(PROCESSING_ROLES, "/chemist");

  const id = formData.get("id") as string;
  const resultValue = Number(formData.get("result_value"));

  if (!Number.isFinite(resultValue)) {
    redirectWithError("/chemist", "Enter a valid result value");
  }

  try {
    const profile = await getMyProfile(supabase);
    await markTestOrderProcessed(supabase, id, profile.id, resultValue);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save result";
    redirectWithError("/chemist", message);
  }

  revalidatePath("/chemist");
  revalidatePath("/chemist/history");
}
