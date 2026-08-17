import { redirect } from "next/navigation";
import { createClient } from "@/app/_lib/supabase/server";
import { getMyRole } from "@/app/_lib/data/profiles";
import type { StaffRole } from "@/app/_lib/constants";

/**
 * Section role-gate, used by each role folder's `layout.tsx`.
 *
 * Sends anyone without one of `roles` back to the home page. This is a
 * navigation guard, not the security boundary — RLS enforces the real rules.
 */
export async function requireRoleOrRedirect(
  roles: StaffRole[],
  to: string = "/",
) {
  const supabase = await createClient();
  const role = await getMyRole(supabase);

  if (!role || !roles.includes(role as StaffRole)) {
    redirect(to);
  }

  return role as StaffRole;
}
