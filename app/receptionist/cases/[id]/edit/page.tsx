import Link from "next/link";
import { createClient } from "@/app/_lib/supabase/server";
import { getCaseById } from "@/app/_lib/data/cases";
import { getPatientById } from "@/app/_lib/data/patients";
import { getTestCatalog } from "@/app/_lib/data/test-catalog";
import { getTestOrdersForCase } from "@/app/_lib/data/test-orders";
import { editCase } from "@/app/_lib/actions/cases";

export default async function EditCasePage({
  params,
  searchParams,
}: PageProps<"/receptionist/cases/[id]/edit">) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const caseRecord = await getCaseById(supabase, id);
  const patient = await getPatientById(supabase, caseRecord.patient_id);
  const currentOrders = await getTestOrdersForCase(supabase, id);
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

  const tests = await getTestCatalog(supabase, { activeOnly: true });
  const currentTestIds = currentOrders.map((order) => order.test_id);

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <h1 className="text-xl font-semibold">Edit Case</h1>

      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
        <span>
          {patient.first_name} {patient.last_name} ({patient.phone})
        </span>
      </div>

      {error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form
        action={editCase}
        className="grid grid-cols-2 gap-4 rounded-lg border border-gray-200 p-6 shadow-sm"
      >
        <input type="hidden" name="id" value={caseRecord.id} />

        <div className="col-span-2 space-y-1">
          <label htmlFor="came_from" className="text-sm font-medium">
            Where do you come from
          </label>
          <input
            id="came_from"
            name="came_from"
            type="text"
            defaultValue={caseRecord.came_from ?? ""}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="fasting_since" className="text-sm font-medium">
            Last time you ate
          </label>
          <input
            id="fasting_since"
            name="fasting_since"
            type="text"
            defaultValue={caseRecord.fasting_since ?? ""}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="drugs_used" className="text-sm font-medium">
            Drugs used
          </label>
          <input
            id="drugs_used"
            name="drugs_used"
            type="text"
            defaultValue={caseRecord.drugs_used ?? ""}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="col-span-2 space-y-1">
          <label htmlFor="doctor_advice" className="text-sm font-medium">
            Doctor advice
          </label>
          <input
            id="doctor_advice"
            name="doctor_advice"
            type="text"
            defaultValue={caseRecord.doctor_advice ?? ""}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="referring_doctor" className="text-sm font-medium">
            Referring doctor
          </label>
          <input
            id="referring_doctor"
            name="referring_doctor"
            type="text"
            defaultValue={caseRecord.referring_doctor ?? ""}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="payment_status" className="text-sm font-medium">
            Payment status
          </label>
          <select
            id="payment_status"
            name="payment_status"
            defaultValue={caseRecord.payment_status ?? ""}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select...</option>
            <option value="not_paid">Not paid</option>
            <option value="full">Full</option>
            <option value="deposit">Deposit</option>
            <option value="repeated">Repeated</option>
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="payment_method" className="text-sm font-medium">
            Payment method
          </label>
          <select
            id="payment_method"
            name="payment_method"
            defaultValue={caseRecord.payment_method ?? ""}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select...</option>
            <option value="cash">Cash</option>
            <option value="credit_card">Credit card</option>
            <option value="debit_card">Debit card</option>
          </select>
        </div>

        <div className="col-span-2 grid grid-cols-3 gap-3">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              name="is_pregnant"
              type="checkbox"
              defaultChecked={caseRecord.is_pregnant ?? false}
              className="h-4 w-4 rounded border-gray-300"
            />
            Pregnant
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              name="smoker"
              type="checkbox"
              defaultChecked={caseRecord.smoker ?? false}
              className="h-4 w-4 rounded border-gray-300"
            />
            Smoker
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              name="athletic"
              type="checkbox"
              defaultChecked={caseRecord.athletic ?? false}
              className="h-4 w-4 rounded border-gray-300"
            />
            Athletic
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              name="alcoholic"
              type="checkbox"
              defaultChecked={caseRecord.alcoholic ?? false}
              className="h-4 w-4 rounded border-gray-300"
            />
            Alcoholic
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              name="has_diet_plan"
              type="checkbox"
              defaultChecked={caseRecord.has_diet_plan ?? false}
              className="h-4 w-4 rounded border-gray-300"
            />
            Has diet plan
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              name="has_prior_contract"
              type="checkbox"
              defaultChecked={caseRecord.has_prior_contract ?? false}
              className="h-4 w-4 rounded border-gray-300"
            />
            Has prior contract
          </label>
        </div>

        <div className="col-span-2 space-y-2">
          <p className="text-sm font-medium">Tests to order</p>
          <div className="grid grid-cols-2 gap-2 rounded border border-gray-200 p-3">
            {tests.map((test) => (
              <label key={test.id} className="flex items-center gap-2 text-sm">
                <input
                  name="test_ids"
                  type="checkbox"
                  value={test.id}
                  defaultChecked={currentTestIds.includes(test.id)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                {test.name} {test.price != null ? `(${test.price})` : ""}
              </label>
            ))}
            {tests.length === 0 && (
              <p className="text-sm text-gray-500">
                No active tests in the catalog.
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="col-span-2 rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Save changes
        </button>

        <a
          href={`/receptionist/cases/${id}`}
          className="col-span-2 text-center text-sm text-gray-500 hover:underline"
        >
          Cancel
        </a>
      </form>
    </div>
  );
}
