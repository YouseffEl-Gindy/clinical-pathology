import Link from "next/link";
import { createClient } from "@/app/_lib/supabase/server";
import { getCaseById } from "@/app/_lib/data/cases";
import { getPatientById } from "@/app/_lib/data/patients";
import { getTestOrdersForCase } from "@/app/_lib/data/test-orders";
import { DeleteCaseButton } from "@/app/_components/receptionist/DeleteCaseButton";
import { CARD_CLASS } from "@/app/_components/ui/Card";
import { ErrorBanner } from "@/app/_components/ui/ErrorBanner";
import { Row, Table } from "@/app/_components/ui/Table";
import { yesNo } from "@/app/_lib/helpers";

export default async function CaseDetailPage({
  params,
  searchParams,
}: PageProps<"/receptionist/cases/[id]">) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();
  const caseRecord = await getCaseById(supabase, id);
  const patient = await getPatientById(supabase, caseRecord.patient_id);
  const testOrders = await getTestOrdersForCase(supabase, id);
  const isEditable = testOrders.every((order) => order.status === "ordered");

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Case</h1>
          <Link
            href={`/receptionist/patients/${patient.id}`}
            className="text-sm text-gray-500 hover:underline"
          >
            {patient.first_name} {patient.last_name} ({patient.phone})
          </Link>
        </div>
        {isEditable && (
          <div className="flex items-center gap-4">
            <Link
              href={`/receptionist/cases/${id}/edit`}
              className="text-sm text-gray-500 hover:underline"
            >
              Edit
            </Link>
            <DeleteCaseButton id={id} />
          </div>
        )}
      </div>

      <ErrorBanner message={error} />

      <dl className={`grid grid-cols-2 gap-4 text-sm ${CARD_CLASS}`}>
        <div>
          <dt className="text-gray-500">Where do you come from</dt>
          <dd>{caseRecord.came_from ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Last time you ate</dt>
          <dd>{caseRecord.fasting_since ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Drugs used</dt>
          <dd>{caseRecord.drugs_used ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Referring doctor</dt>
          <dd>{caseRecord.referring_doctor ?? "—"}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-gray-500">Doctor advice</dt>
          <dd>{caseRecord.doctor_advice ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Payment status</dt>
          <dd>{caseRecord.payment_status ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Payment method</dt>
          <dd>{caseRecord.payment_method ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Pregnant</dt>
          <dd>{yesNo(caseRecord.is_pregnant)}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Smoker</dt>
          <dd>{yesNo(caseRecord.smoker)}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Athletic</dt>
          <dd>{yesNo(caseRecord.athletic)}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Alcoholic</dt>
          <dd>{yesNo(caseRecord.alcoholic)}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Has diet plan</dt>
          <dd>{yesNo(caseRecord.has_diet_plan)}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Has prior contract</dt>
          <dd>{yesNo(caseRecord.has_prior_contract)}</dd>
        </div>
      </dl>

      <div className="space-y-2">
        <h2 className="text-sm font-medium">Ordered tests</h2>
        <Table
          headers={["Test", "Code", "Price", "Status"]}
          isEmpty={testOrders.length === 0}
          emptyMessage="No tests ordered."
        >
          {testOrders.map((order) => (
            <Row key={order.id}>
              <td className="py-2">{order.test_catalog?.name ?? "—"}</td>
              <td>{order.test_catalog?.code ?? "—"}</td>
              <td>{order.price_snapshot ?? "—"}</td>
              <td>{order.status}</td>
            </Row>
          ))}
        </Table>
      </div>
    </div>
  );
}
