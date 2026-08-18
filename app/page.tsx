import { createClient } from "@/app/_lib/supabase/server";
import { getMyRole } from "@/app/_lib/data/profiles";
import { logout } from "@/app/_lib/actions/auth";
import { LinkButton } from "@/app/_components/ui/LinkButton";
import { SubmitButton } from "@/app/_components/ui/SubmitButton";
import {
  ADMIN_ROLES,
  PROCESSING_ROLES,
  RECEPTION_ROLES,
  SAMPLING_ROLES,
} from "@/app/_lib/constants";
import type { StaffRole } from "@/app/_lib/constants";

export default async function Home() {
  const supabase = await createClient();
  const role = await getMyRole(supabase);

  // The role groups already encode "pathologist can do everything the other
  // roles can", so a pathologist sees the reception links too.
  const can = (allowed: StaffRole[]) =>
    role !== null && allowed.includes(role as StaffRole);

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-4 p-16 text-center">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Clinical Pathology Lab
        </h1>
        {role ? (
          <p className="text-lg text-zinc-700 dark:text-zinc-300">
            Logged in as: <span className="font-semibold">{role}</span>
          </p>
        ) : (
          <p className="text-red-600 dark:text-red-400">
            No profile found for this account.
          </p>
        )}
        {can(RECEPTION_ROLES) && (
          <div className="flex gap-3">
            <LinkButton href="/receptionist/patients" variant="secondary">
              Patients
            </LinkButton>
            <LinkButton href="/receptionist/cases" variant="secondary">
              Cases
            </LinkButton>
          </div>
        )}
        {can(SAMPLING_ROLES) && (
          <div className="flex gap-3">
            <LinkButton href="/sampler" variant="secondary">
              Sampling
            </LinkButton>
          </div>
        )}
        {can(PROCESSING_ROLES) && (
          <div className="flex gap-3">
            <LinkButton href="/chemist" variant="secondary">
              Processing
            </LinkButton>
            <LinkButton href="/chemist/history" variant="secondary">
              Processing history
            </LinkButton>
          </div>
        )}
        {can(ADMIN_ROLES) && (
          <div className="flex gap-3">
            <LinkButton href="/pathologist/catalog" variant="secondary">
              Test Catalog
            </LinkButton>
            <LinkButton href="/pathologist/staff" variant="secondary">
              Staff
            </LinkButton>
          </div>
        )}
        <form action={logout}>
          <SubmitButton>Sign out</SubmitButton>
        </form>
      </main>
    </div>
  );
}
