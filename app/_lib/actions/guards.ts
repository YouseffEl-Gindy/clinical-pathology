import { redirect } from "next/navigation";
import { createClient } from "@/app/_lib/supabase/server";
import { getMyRole } from "@/app/_lib/data/profiles";
import type { StaffRole } from "@/app/_lib/constants";

/**
 * Bounce back to `path` with a message the page will render in its error banner.
 *
 * Never returns — `redirect` throws. Appends to an existing query string rather
 * than clobbering it, so callers can keep params like `?patientId=`.
 */
export function redirectWithError(path: string, message: string): never {
  const separator = path.includes("?") ? "&" : "?";
  redirect(`${path}${separator}error=${encodeURIComponent(message)}`);
}

/**
 * The preamble every server action shares: open a client, check the caller's
 * role, and bounce them if it isn't allowed.
 *
 * Returns the Supabase client so the caller doesn't build a second one.
 *
 * This is a convenience, not the security boundary — RLS in Postgres is what
 * actually enforces these rules (see CLAUDE.md §8).
 */
export async function requireRole(roles: StaffRole[], redirectTo: string) {
  const supabase = await createClient();
  const role = await getMyRole(supabase);

  if (!role || !roles.includes(role as StaffRole)) {
    redirectWithError(redirectTo, "Not authorized");
  }

  return supabase;
}
