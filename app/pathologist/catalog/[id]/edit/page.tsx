import { createClient } from "@/app/_lib/supabase/server";
import { getTestById } from "@/app/_lib/data/test-catalog";
import { editTest } from "@/app/_lib/actions/test-catalog";
import { TestForm } from "@/app/_components/pathologist/TestForm";
import { ErrorBanner } from "@/app/_components/ui/ErrorBanner";

export default async function EditTestPage({
  params,
  searchParams,
}: PageProps<"/pathologist/catalog/[id]/edit">) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();
  const test = await getTestById(supabase, id);

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <h1 className="text-xl font-semibold">Edit Test</h1>
      <ErrorBanner message={error} />
      <TestForm test={test} action={editTest} />
    </div>
  );
}
