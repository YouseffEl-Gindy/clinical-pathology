import { createClient } from "@/app/_lib/supabase/server";
import { getChemistHistoryTestOrders } from "@/app/_lib/data/test-orders";
import { ViewToggle } from "@/app/_components/shared/ViewToggle";

export default async function ChemistHistoryPage({
  searchParams,
}: PageProps<"/chemist/history">) {
  const { view: rawView } = await searchParams;
  const view = (Array.isArray(rawView) ? rawView[0] : rawView) === "test" ? "test" : "case";

  const supabase = await createClient();
  const orders = await getChemistHistoryTestOrders(supabase);

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
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
        <CaseView orders={orders} />
      ) : (
        <TestView orders={orders} />
      )}
    </div>
  );
}

type Orders = Awaited<ReturnType<typeof getChemistHistoryTestOrders>>;

function CaseView({ orders }: { orders: Orders }) {
  const groups = new Map<string, Orders>();
  for (const order of orders) {
    const caseId = order.cases.id;
    const group = groups.get(caseId);
    if (group) {
      group.push(order);
    } else {
      groups.set(caseId, [order]);
    }
  }

  return (
    <div className="space-y-6">
      {Array.from(groups.values()).map((tests) => {
        const { cases } = tests[0];
        const patient = cases.patients;
        return (
          <div
            key={cases.id}
            className="rounded-lg border border-gray-200 p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-medium">
                  {patient.first_name} {patient.last_name}
                </span>
                <span className="text-xs text-gray-400">Case {cases.id}</span>
              </div>
              <span className="text-sm text-gray-500">{patient.phone}</span>
            </div>

            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2">Test</th>
                  <th>Result</th>
                  <th>Processed by</th>
                  <th>Processed at</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100">
                    <td className="py-2">{order.test_catalog.name}</td>
                    <td>
                      {order.result_value} {order.result_unit}
                    </td>
                    <td>{order.processed_by_profile?.full_name}</td>
                    <td>
                      {order.processed_at &&
                        new Date(order.processed_at).toLocaleString()}
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

function TestView({ orders }: { orders: Orders }) {
  const groups = new Map<string, Orders>();
  for (const order of orders) {
    const group = groups.get(order.test_id);
    if (group) {
      group.push(order);
    } else {
      groups.set(order.test_id, [order]);
    }
  }

  const testGroups = Array.from(groups.values()).sort((a, b) => {
    const nameCompare = a[0].test_catalog.name.localeCompare(b[0].test_catalog.name);
    return nameCompare !== 0 ? nameCompare : a[0].test_id.localeCompare(b[0].test_id);
  });

  return (
    <div className="space-y-6">
      {testGroups.map((tests) => {
        const { test_catalog } = tests[0];
        return (
          <div
            key={tests[0].test_id}
            className="rounded-lg border border-gray-200 p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="font-medium">{test_catalog.name}</span>
              <span className="text-sm text-gray-500">{test_catalog.code}</span>
            </div>

            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2">Patient</th>
                  <th>Case ID</th>
                  <th>Result</th>
                  <th>Processed by</th>
                  <th>Processed at</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((order) => {
                  const patient = order.cases.patients;
                  return (
                    <tr key={order.id} className="border-b border-gray-100">
                      <td className="py-2">
                        {patient.first_name} {patient.last_name}
                      </td>
                      <td className="text-xs text-gray-400">{order.cases.id}</td>
                      <td>
                        {order.result_value} {order.result_unit}
                      </td>
                      <td>{order.processed_by_profile?.full_name}</td>
                      <td>
                        {order.processed_at &&
                          new Date(order.processed_at).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
