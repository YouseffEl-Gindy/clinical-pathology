import { createClient } from "@/app/_lib/supabase/server";
import { getMyRole } from "@/app/_lib/data/profiles";
import { logout } from "@/app/_lib/actions/auth";

export default async function Home() {
  const supabase = await createClient();
  const role = await getMyRole(supabase);

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
        {role === "pathologist" && (
          <div className="flex gap-3">
            <a
              href="/pathologist/catalog"
              className="rounded border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Test Catalog
            </a>
            <a
              href="/pathologist/staff"
              className="rounded border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Staff
            </a>
          </div>
        )}
        <form action={logout}>
          <button
            type="submit"
            className="rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Sign out
          </button>
        </form>
      </main>
    </div>
  );
}
