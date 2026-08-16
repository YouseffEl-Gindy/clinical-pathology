import Link from "next/link";
import { createClient } from "@/app/_lib/supabase/server";
import { getChemistBoardTestOrdersPaginated } from "@/app/_lib/data/test-orders";
import { getTestCatalog } from "@/app/_lib/data/test-catalog";
import { getChemistBoardCases } from "@/app/_lib/data/cases";
import { EnterResultForm } from "@/app/_components/chemist/EnterResultForm";
import { ViewToggle } from "@/app/_components/shared/ViewToggle";
import type { Tables } from "@/app/_lib/types/database.types";
import type { ChemistBoardCase } from "@/app/_lib/types/domain";

export default async function ChemistPage({
  searchParams,
}: PageProps<"/chemist">) {
  const { view: rawView, page: rawPage, test: rawTest } = await searchParams;
  const view = (Array.isArray(rawView) ? rawView[0] : rawView) === "test" ? "test" : "case";
  const page = Math.max(1, Number(Array.isArray(rawPage) ? rawPage[0] : rawPage) || 1);
  const testIds = rawTest === undefined ? [] : Array.isArray(rawTest) ? rawTest : [rawTest];

  const supabase = await createClient();

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Tests waiting to be processed</h1>
        <ViewToggle basePath="/chemist" active={view} />
      </div>

      {view === "case" ? (
        <CaseView cases={await getChemistBoardCases(supabase)} />
      ) : (
        <TestView
          testIds={testIds}
          page={page}
          testCatalog={await getTestCatalog(supabase)}
          {...(await getChemistBoardTestOrdersPaginated(supabase, { testIds, page }))}
        />
      )}
    </div>
  );
}

function CaseView({ cases }: { cases: ChemistBoardCase[] }) {
  if (cases.length === 0) {
    return (
      <p className="text-center text-sm text-gray-500">
        No tests waiting to be processed.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {cases.map((c) => {
        const patient = c.patients;
        return (
          <div
            key={c.id}
            className="rounded-lg border border-gray-200 p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-medium">
                  {patient.first_name} {patient.last_name}
                </span>
                <span className="text-xs text-gray-400">Case {c.id}</span>
              </div>
              <span className="text-sm text-gray-500">{patient.phone}</span>
            </div>

            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2">Test</th>
                  <th>Code</th>
                  <th>Specimen</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {c.test_orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100">
                    <td className="py-2">{order.test_catalog.name}</td>
                    <td>{order.test_catalog.code}</td>
                    <td>{order.test_catalog.specimen_type}</td>
                    <td>
                      <EnterResultForm
                        id={order.id}
                        unit={order.test_catalog.unit}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

type PaginatedOrders = Awaited<
  ReturnType<typeof getChemistBoardTestOrdersPaginated>
>["orders"];

function TestView({
  orders,
  count,
  pageSize,
  page,
  testIds,
  testCatalog,
}: {
  orders: PaginatedOrders;
  count: number;
  pageSize: number;
  page: number;
  testIds: string[];
  testCatalog: Tables<"test_catalog">[];
}) {
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  const hrefForPage = (p: number) => {
    const params = new URLSearchParams();
    params.set("view", "test");
    for (const id of testIds) params.append("test", id);
    params.set("page", String(p));
    return `/chemist?${params}`;
  };

  return (
    <div className="space-y-6">
      <form className="rounded-lg border border-gray-200 p-6 shadow-sm">
        <input type="hidden" name="view" value="test" />
        <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {testCatalog.map((tc) => (
            <label key={tc.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="test"
                value={tc.id}
                defaultChecked={testIds.includes(tc.id)}
              />
              {tc.name} ({tc.code})
            </label>
          ))}
        </div>
        <button
          type="submit"
          className="rounded bg-gray-900 px-3 py-1 text-sm font-medium text-white hover:bg-gray-800"
        >
          Apply filters
        </button>
      </form>

      {orders.length === 0 && (
        <p className="text-center text-sm text-gray-500">
          {testIds.length > 0
            ? "No sampled tests match the selected filters."
            : "No tests waiting to be processed."}
        </p>
      )}

      {orders.length > 0 && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="py-2">Test</th>
              <th>Code</th>
              <th>Patient</th>
              <th>Phone</th>
              <th>Case ID</th>
              <th>Case opened</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const patient = order.cases.patients;
              return (
                <tr key={order.id} className="border-b border-gray-100">
                  <td className="py-2">{order.test_catalog.name}</td>
                  <td>{order.test_catalog.code}</td>
                  <td>
                    {patient.first_name} {patient.last_name}
                  </td>
                  <td>{patient.phone}</td>
                  <td className="text-xs text-gray-400">{order.cases.id}</td>
                  <td>
                    {new Date(order.cases.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <EnterResultForm
                      id={order.id}
                      unit={order.test_catalog.unit}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {count > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Page {page} of {totalPages} ({count} test{count === 1 ? "" : "s"})
          </span>
          <div className="flex gap-4">
            {page > 1 ? (
              <Link href={hrefForPage(page - 1)} className="hover:underline">
                ← Previous
              </Link>
            ) : (
              <span className="text-gray-300">← Previous</span>
            )}
            {page < totalPages ? (
              <Link href={hrefForPage(page + 1)} className="hover:underline">
                Next →
              </Link>
            ) : (
              <span className="text-gray-300">Next →</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
