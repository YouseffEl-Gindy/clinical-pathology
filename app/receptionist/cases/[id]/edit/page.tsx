import Link from "next/link";
import { createClient } from "@/app/_lib/supabase/server";
import { getCaseById } from "@/app/_lib/data/cases";
import { getPatientById } from "@/app/_lib/data/patients";
import { getTestCatalog } from "@/app/_lib/data/test-catalog";
import { getTestOrdersForCase } from "@/app/_lib/data/test-orders";
import { editCase } from "@/app/_lib/actions/cases";
import { CaseForm } from "@/app/_components/receptionist/CaseForm";
import { ErrorBanner } from "@/app/_components/ui/ErrorBanner";

export default async function EditCasePage({
  params,
  searchParams,
}: PageProps<"/receptionist/cases/[id]/edit">) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  // Only these two are needed to decide whether the case is still editable, so
  // they go out together and nothing else is fetched until that's known.
  const [caseRecord, currentOrders] = await Promise.all([
    getCaseById(supabase, id),
    getTestOrdersForCase(supabase, id),
  ]);
  const isEditable = currentOrders.every((order) => order.status === "ordered");

  if (!isEditable) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 p-6">
        <h1 className="text-xl font-semibold">Case Locked</h1>
        <p className="text-sm text-gray-600">
          This case can no longer be edited because testing has started.
        </p>
        <Link
          href={`/receptionist/cases/${id}`}
          className="text-sm text-gray-500 hover:underline"
        >
          ← Back to case
        </Link>
      </div>
    );
  }

  // Both only feed the form below, so a locked case never pays for them.
  const [patient, tests] = await Promise.all([
    getPatientById(supabase, caseRecord.patient_id),
    getTestCatalog(supabase, { activeOnly: true }),
  ]);
  const currentTestIds = currentOrders.map((order) => order.test_id);

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <h1 className="text-xl font-semibold">Edit Case</h1>

      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
        <span>
          {patient.first_name} {patient.last_name} ({patient.phone})
        </span>
      </div>

      <ErrorBanner message={error} />

      <CaseForm
        caseRecord={caseRecord}
        tests={tests}
        currentTestIds={currentTestIds}
        action={editCase}
      />
    </div>
  );
}
