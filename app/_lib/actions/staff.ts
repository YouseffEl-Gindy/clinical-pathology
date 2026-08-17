"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/app/_lib/supabase/admin";
import { redirectWithError, requireRole } from "@/app/_lib/actions/guards";
import { ADMIN_ROLES, VALID_ROLES, type StaffRole } from "@/app/_lib/constants";

/**
 * Create a staff login.
 *
 * The only action that needs the `service_role` key: writing to `auth.users`
 * bypasses RLS, so it must stay server-side (see CLAUDE.md §8).
 */
export async function addStaff(formData: FormData) {
  await requireRole(ADMIN_ROLES, "/pathologist/staff");

  const full_name = (formData.get("full_name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const staffRole = formData.get("role") as StaffRole;

  if (
    !full_name ||
    !email ||
    !password ||
    !VALID_ROLES.includes(staffRole)
  ) {
    redirectWithError(
      "/pathologist/staff",
      "All fields are required and role must be valid"
    );
  }

  const admin = createAdminClient();

  const { data: created, error: createError } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (createError || !created.user) {
    redirectWithError(
      "/pathologist/staff",
      createError?.message ?? "Failed to create login"
    );
  }

  const { error: profileError } = await admin.from("profiles").insert({
    auth_user_id: created.user.id,
    full_name,
    role: staffRole,
  });

  if (profileError) {
    // Roll the auth user back so a failed insert doesn't strand a login
    // with no profile attached to it.
    await admin.auth.admin.deleteUser(created.user.id);
    redirectWithError("/pathologist/staff", profileError.message);
  }

  revalidatePath("/pathologist/staff");
}
