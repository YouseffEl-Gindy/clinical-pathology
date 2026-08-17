import { createClient } from "@/app/_lib/supabase/server";
import { getChemistBoardTestOrdersPaginated } from "@/app/_lib/data/test-orders";
import { getTestCatalog } from "@/app/_lib/data/test-catalog";
import { getChemistBoardCases } from "@/app/_lib/data/cases";
import { ChemistBoardCaseView } from "@/app/_components/chemist/ChemistBoardCaseView";
import { ChemistBoardTestView } from "@/app/_components/chemist/ChemistBoardTestView";
import { ViewToggle } from "@/app/_components/shared/ViewToggle";
import { firstParam, paramList, parsePageParam } from "@/app/_lib/helpers";

export default async function ChemistPage({
  searchParams,
}: PageProps<"/chemist">) {
  const { view: rawView, page: rawPage, test: rawTest } = await searchParams;
  const view = firstParam(rawView) === "test" ? "test" : "case";
  const page = parsePageParam(rawPage);
  const testIds = paramList(rawTest);

  const supabase = await createClient();

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Tests waiting to be processed</h1>
        <ViewToggle basePath="/chemist" active={view} />
      </div>

      {view === "case" ? (
        <ChemistBoardCaseView cases={await getChemistBoardCases(supabase)} />
      ) : (
        <ChemistBoardTestView
          testIds={testIds}
          page={page}
          testCatalog={await getTestCatalog(supabase)}
          {...(await getChemistBoardTestOrdersPaginated(supabase, {
            testIds,
            page,
          }))}
        />
      )}
    </div>
  );
}
