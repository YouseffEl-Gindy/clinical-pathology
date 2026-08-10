"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/app/_lib/supabase/server";
import { getMyRole } from "@/app/_lib/data/profiles";
import { createTest, updateTest, deleteTest } from "@/app/_lib/data/test-catalog";

export async function addTest(formData: FormData) {
  const supabase = await createClient();
  const role = await getMyRole(supabase);

  if (role !== "pathologist") {
    redirect("/pathologist/catalog?error=Not authorized");
  }

  const name = (formData.get("name") as string)?.trim();
  const priceRaw = formData.get("price") as string;
  const price = priceRaw ? Number(priceRaw) : NaN;

  if (!name || !priceRaw || Number.isNaN(price)) {
    redirect(
      "/pathologist/catalog?error=" +
        encodeURIComponent("Name and a valid price are required")
    );
  }

  const code = (formData.get("code") as string)?.trim() || null;
  const specimen_type = (formData.get("specimen_type") as string)?.trim() || null;
  const unit = (formData.get("unit") as string)?.trim() || null;

  try {
    await createTest(supabase, { name, price, code, specimen_type, unit });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to add test";
    redirect("/pathologist/catalog?error=" + encodeURIComponent(message));
  }

  revalidatePath("/pathologist/catalog");
}

export async function editTest(formData: FormData) {
  const supabase = await createClient();
  const role = await getMyRole(supabase);

  const id = formData.get("id") as string;

  if (role !== "pathologist") {
    redirect(`/pathologist/catalog/${id}/edit?error=Not authorized`);
  }

  const name = (formData.get("name") as string)?.trim();
  const priceRaw = formData.get("price") as string;
  const price = priceRaw ? Number(priceRaw) : NaN;

  if (!name || !priceRaw || Number.isNaN(price)) {
    redirect(
      `/pathologist/catalog/${id}/edit?error=` +
        encodeURIComponent("Name and a valid price are required")
    );
  }

  const code = (formData.get("code") as string)?.trim() || null;
  const specimen_type = (formData.get("specimen_type") as string)?.trim() || null;
  const unit = (formData.get("unit") as string)?.trim() || null;
  const active = formData.get("active") === "on";

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
    const message = err instanceof Error ? err.message : "Failed to update test";
    redirect(`/pathologist/catalog/${id}/edit?error=` + encodeURIComponent(message));
  }

  revalidatePath("/pathologist/catalog");
  redirect("/pathologist/catalog");
}

export async function deleteTestAction(formData: FormData) {
  const supabase = await createClient();
  const role = await getMyRole(supabase);

  const id = formData.get("id") as string;

  if (role !== "pathologist") {
    redirect("/pathologist/catalog?error=Not authorized");
  }

  try {
    await deleteTest(supabase, id);
  } catch (err) {
    const pgError = err as { code?: string; message?: string };
    const message =
      pgError.code === "23503"
        ? "This test has been used in orders and can't be deleted. Deactivate it instead."
        : pgError.message ?? "Failed to delete test";
    redirect("/pathologist/catalog?error=" + encodeURIComponent(message));
  }

  revalidatePath("/pathologist/catalog");
}
