"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/app/_lib/supabase/server";
import { createAdminClient } from "@/app/_lib/supabase/admin";
import { getMyRole } from "@/app/_lib/data/profiles";

const VALID_ROLES = ["receptionist", "sampler", "chemist", "pathologist"];

export async function addStaff(formData: FormData) {
  const supabase = await createClient();
  const role = await getMyRole(supabase);

  if (role !== "pathologist") {
    redirect("/pathologist/staff?error=Not authorized");
  }

  const full_name = (formData.get("full_name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const staffRole = formData.get("role") as string;

  if (!full_name || !email || !password || !VALID_ROLES.includes(staffRole)) {
    redirect(
      "/pathologist/staff?error=" +
        encodeURIComponent("All fields are required and role must be valid")
    );
  }

  const admin = createAdminClient();

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    redirect(
      "/pathologist/staff?error=" +
        encodeURIComponent(createError?.message ?? "Failed to create login")
    );
  }

  const { error: profileError } = await admin.from("profiles").insert({
    auth_user_id: created.user.id,
    full_name,
    role: staffRole,
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(created.user.id);
    redirect(
      "/pathologist/staff?error=" + encodeURIComponent(profileError.message)
    );
  }

  revalidatePath("/pathologist/staff");
}
