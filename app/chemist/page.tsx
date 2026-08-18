import { createClient } from "@/app/_lib/supabase/server";
import { getChemistBoardTestOrdersPaginated } from "@/app/_lib/data/test-orders";
import { getTestCatalog } from "@/app/_lib/data/test-catalog";
import { getChemistBoardCases } from "@/app/_lib/data/cases";
import { ChemistBoardCaseView } from "@/app/_components/chemist/ChemistBoardCaseView";
import { ChemistBoardTestView } from "@/app/_components/chemist/ChemistBoardTestView";
import { ViewToggle } from "@/app/_components/shared/ViewToggle";
import { BackLink } from "@/app/_components/ui/BackLink";
import { firstParam, paramList, parsePageParam } from "@/app/_lib/helpers";

export default async function ChemistPage({
  searchParams,
}: PageProps<"/chemist">) {
  const { view: rawView, page: rawPage, test: rawTest } = await searchParams;
  const view = firstParam(rawView) === "test" ? "test" : "case";
  const page = parsePageParam(rawPage);
  const testIds = paramList(rawTest);

  const supabase = await createClient();

  // Resolved before the JSX rather than inside it: awaiting in two separate
  // props made the catalog and the page of orders queue up one after the other,
  // even though neither depends on the other. Only the active view is fetched.
  let board: React.ReactNode;

  if (view === "case") {
    board = <ChemistBoardCaseView cases={await getChemistBoardCases(supabase)} />;
  } else {
    const [testCatalog, orders] = await Promise.all([
      getTestCatalog(supabase),
      getChemistBoardTestOrdersPaginated(supabase, { testIds, page }),
    ]);
    board = (
      <ChemistBoardTestView
        testIds={testIds}
        page={page}
        testCatalog={testCatalog}
        {...orders}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <BackLink href="/">Home</BackLink>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Tests waiting to be processed</h1>
        <ViewToggle basePath="/chemist" active={view} />
      </div>

      {board}
    </div>
  );
}
