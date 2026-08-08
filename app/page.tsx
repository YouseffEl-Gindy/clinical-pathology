import { createClient } from "@/app/_lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  // Throwaway query: no tables exist yet (Phase 0), so any structured response
  // (including "relation does not exist") proves we reached Postgres via Supabase.
  const { error } = await supabase.from("__connection_check").select("*").limit(1);

  const reachedDatabase = !!error && error.code !== undefined;

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-4 p-16 text-center">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Clinical Pathology Lab
        </h1>
        {reachedDatabase ? (
          <>
            <p className="text-green-600 dark:text-green-400">
              ✓ Connected to Supabase
            </p>
            <p className="max-w-md text-sm text-zinc-500">
              Response from database: {error?.message}
            </p>
          </>
        ) : (
          <p className="text-red-600 dark:text-red-400">
            ✗ Could not reach Supabase — check .env.local
          </p>
        )}
      </main>
    </div>
  );
}
