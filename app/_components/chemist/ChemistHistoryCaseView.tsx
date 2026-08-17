import { Card } from "@/app/_components/ui/Card";
import { Row, Table } from "@/app/_components/ui/Table";
import type { ChemistHistoryOrder } from "@/app/_lib/types/domain";

/** Already-processed tests, grouped into one card per case. */
export function ChemistHistoryCaseView({
  orders,
}: {
  orders: ChemistHistoryOrder[];
}) {
  const groups = new Map<string, ChemistHistoryOrder[]>();
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
          <Card key={cases.id}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-medium">
                  {patient.first_name} {patient.last_name}
                </span>
                <span className="text-xs text-gray-400">Case {cases.id}</span>
              </div>
              <span className="text-sm text-gray-500">{patient.phone}</span>
            </div>

            <Table headers={["Test", "Result", "Processed by", "Processed at"]}>
              {tests.map((order) => (
                <Row key={order.id}>
                  <td className="py-2">{order.test_catalog.name}</td>
                  <td>
                    {order.result_value} {order.result_unit}
                  </td>
                  <td>{order.processed_by_profile?.full_name}</td>
                  <td>
                    {order.processed_at &&
                      new Date(order.processed_at).toLocaleString()}
                  </td>
                </Row>
              ))}
            </Table>
          </Card>
        );
      })}
    </div>
  );
}
