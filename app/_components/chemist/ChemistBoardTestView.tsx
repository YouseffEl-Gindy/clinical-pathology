import { EnterResultForm } from "@/app/_components/chemist/EnterResultForm";
import { Button } from "@/app/_components/ui/Button";
import { CARD_CLASS } from "@/app/_components/ui/Card";
import { Pagination } from "@/app/_components/ui/Pagination";
import { Row, Table } from "@/app/_components/ui/Table";
import type { Tables } from "@/app/_lib/types/database.types";
import type { ChemistBoardOrder } from "@/app/_lib/types/domain";

/** Tests waiting to be processed as one flat, filterable, paginated list. */
export function ChemistBoardTestView({
  orders,
  count,
  pageSize,
  page,
  testIds,
  testCatalog,
}: {
  orders: ChemistBoardOrder[];
  count: number;
  pageSize: number;
  page: number;
  testIds: string[];
  testCatalog: Tables<"test_catalog">[];
}) {
  return (
    <div className="space-y-6">
      <form className={CARD_CLASS}>
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
        <Button size="sm">Apply filters</Button>
      </form>

      {orders.length === 0 && (
        <p className="text-center text-sm text-gray-500">
          {testIds.length > 0
            ? "No sampled tests match the selected filters."
            : "No tests waiting to be processed."}
        </p>
      )}

      {orders.length > 0 && (
        <Table
          headers={[
            "Test",
            "Code",
            "Patient",
            "Phone",
            "Case ID",
            "Case opened",
            "",
          ]}
        >
          {orders.map((order) => {
            const patient = order.cases.patients;
            return (
              <Row key={order.id}>
                <td className="py-2">{order.test_catalog.name}</td>
                <td>{order.test_catalog.code}</td>
                <td>
                  {patient.first_name} {patient.last_name}
                </td>
                <td>{patient.phone}</td>
                <td className="text-xs text-gray-400">{order.cases.id}</td>
                <td>{new Date(order.cases.created_at).toLocaleDateString()}</td>
                <td>
                  <EnterResultForm
                    id={order.id}
                    unit={order.test_catalog.unit}
                  />
                </td>
              </Row>
            );
          })}
        </Table>
      )}

      <Pagination
        page={page}
        count={count}
        pageSize={pageSize}
        basePath="/chemist"
        params={{ view: "test", test: testIds }}
        noun="test"
      />
    </div>
  );
}
