"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/app/_lib/supabase/server";
import { getMyRole, getMyProfile } from "@/app/_lib/data/profiles";
import { markTestOrderSampled } from "@/app/_lib/data/test-orders";

export async function sampleTestOrder(formData: FormData) {
  const supabase = await createClient();
  const role = await getMyRole(supabase);

  const id = formData.get("id") as string;

  if (role !== "sampler" && role !== "pathologist") {
    redirect("/sampler?error=Not authorized");
  }

  try {
    const profile = await getMyProfile(supabase);
    await markTestOrderSampled(supabase, id, profile.id);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to mark test sampled";
    redirect("/sampler?error=" + encodeURIComponent(message));
  }

  revalidatePath("/sampler");
}
