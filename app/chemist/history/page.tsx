import { createClient } from "@/app/_lib/supabase/server";
import { getChemistHistoryTestOrders } from "@/app/_lib/data/test-orders";
import { ChemistHistoryCaseView } from "@/app/_components/chemist/ChemistHistoryCaseView";
import { ChemistHistoryTestView } from "@/app/_components/chemist/ChemistHistoryTestView";
import { ViewToggle } from "@/app/_components/shared/ViewToggle";
import { BackLink } from "@/app/_components/ui/BackLink";
import { firstParam } from "@/app/_lib/helpers";

export default async function ChemistHistoryPage({
  searchParams,
}: PageProps<"/chemist/history">) {
  const { view: rawView } = await searchParams;
  const view = firstParam(rawView) === "test" ? "test" : "case";

  const supabase = await createClient();
  const orders = await getChemistHistoryTestOrders(supabase);

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <BackLink href="/">Home</BackLink>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Processed tests</h1>
        <ViewToggle basePath="/chemist/history" active={view} />
      </div>

      {orders.length === 0 && (
        <p className="text-center text-sm text-gray-500">
          No tests have been processed yet.
        </p>
      )}

      {view === "case" ? (
        <ChemistHistoryCaseView orders={orders} />
      ) : (
        <ChemistHistoryTestView orders={orders} />
      )}
    </div>
  );
}
