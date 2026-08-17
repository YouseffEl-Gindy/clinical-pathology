import { Card } from "@/app/_components/ui/Card";
import { Row, Table } from "@/app/_components/ui/Table";
import type { ChemistHistoryOrder } from "@/app/_lib/types/domain";

/**
 * Already-processed tests, grouped into one card per catalog test.
 *
 * Card order is set explicitly by test name here rather than inherited from
 * the query's case ordering — see CLAUDE.md §13 for why that distinction
 * matters.
 */
export function ChemistHistoryTestView({
  orders,
}: {
  orders: ChemistHistoryOrder[];
}) {
  const groups = new Map<string, ChemistHistoryOrder[]>();
  for (const order of orders) {
    const group = groups.get(order.test_id);
    if (group) {
      group.push(order);
    } else {
      groups.set(order.test_id, [order]);
    }
  }

  const testGroups = Array.from(groups.values()).sort((a, b) => {
    const nameCompare = a[0].test_catalog.name.localeCompare(
      b[0].test_catalog.name,
    );
    return nameCompare !== 0
      ? nameCompare
      : a[0].test_id.localeCompare(b[0].test_id);
  });

  return (
    <div className="space-y-6">
      {testGroups.map((tests) => {
        const { test_catalog } = tests[0];
        return (
          <Card key={tests[0].test_id}>
            <div className="mb-4 flex items-center gap-3">
              <span className="font-medium">{test_catalog.name}</span>
              <span className="text-sm text-gray-500">{test_catalog.code}</span>
            </div>

            <Table
              headers={[
                "Patient",
                "Case ID",
                "Result",
                "Processed by",
                "Processed at",
              ]}
            >
              {tests.map((order) => {
                const patient = order.cases.patients;
                return (
                  <Row key={order.id}>
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
                  </Row>
                );
              })}
            </Table>
          </Card>
        );
      })}
    </div>
  );
}
