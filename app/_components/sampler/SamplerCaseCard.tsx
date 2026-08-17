import { MarkSampledButton } from "@/app/_components/sampler/MarkSampledButton";
import { CaseStatusBadge } from "@/app/_components/sampler/CaseStatusBadge";
import { Card } from "@/app/_components/ui/Card";
import { Row, Table } from "@/app/_components/ui/Table";
import type { SamplerCaseGroup } from "@/app/_lib/types/domain";

/** One case on the sampler board: the patient header plus its tests to draw. */
export function SamplerCaseCard({ group }: { group: SamplerCaseGroup }) {
  const { case: c, tests, label } = group;
  const patient = c.patients;

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-medium">
            {patient.first_name} {patient.last_name}
          </span>
          <CaseStatusBadge label={label} />
        </div>
        <span className="text-sm text-gray-500">{patient.phone}</span>
      </div>

      <Table headers={["Test", "Code", "Specimen", ""]}>
        {tests.map((order) => (
          <Row key={order.id}>
            <td className="py-2">{order.test_catalog.name}</td>
            <td>{order.test_catalog.code}</td>
            <td>{order.test_catalog.specimen_type}</td>
            <td className="text-right">
              <MarkSampledButton id={order.id} status={order.status} />
            </td>
          </Row>
        ))}
      </Table>
    </Card>
  );
}
