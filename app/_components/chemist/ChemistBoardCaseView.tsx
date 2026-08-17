import { EnterResultForm } from "@/app/_components/chemist/EnterResultForm";
import { Card } from "@/app/_components/ui/Card";
import { Row, Table } from "@/app/_components/ui/Table";
import type { ChemistBoardCase } from "@/app/_lib/types/domain";

/** Tests waiting to be processed, grouped into one card per case. */
export function ChemistBoardCaseView({ cases }: { cases: ChemistBoardCase[] }) {
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
          <Card key={c.id}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-medium">
                  {patient.first_name} {patient.last_name}
                </span>
                <span className="text-xs text-gray-400">Case {c.id}</span>
              </div>
              <span className="text-sm text-gray-500">{patient.phone}</span>
            </div>

            <Table headers={["Test", "Code", "Specimen", ""]}>
              {c.test_orders.map((order) => (
                <Row key={order.id}>
                  <td className="py-2">{order.test_catalog.name}</td>
                  <td>{order.test_catalog.code}</td>
                  <td>{order.test_catalog.specimen_type}</td>
                  <td>
                    <EnterResultForm
                      id={order.id}
                      unit={order.test_catalog.unit}
                    />
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
