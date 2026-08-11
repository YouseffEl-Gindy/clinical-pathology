import Link from "next/link";
import { createClient } from "@/app/_lib/supabase/server";
import { getPatients, getPatientById } from "@/app/_lib/data/patients";
import { getTestCatalog } from "@/app/_lib/data/test-catalog";
import { addCase } from "@/app/_lib/actions/cases";

export default async function NewCasePage({
  searchParams,
}: PageProps<"/receptionist/cases/new">) {
  const {
    phone: rawPhone,
    patientId: rawPatientId,
    error,
  } = await searchParams;
  const phone = Array.isArray(rawPhone) ? rawPhone[0] : rawPhone;
  const patientId = Array.isArray(rawPatientId) ? rawPatientId[0] : rawPatientId;

  const supabase = await createClient();

  if (!patientId) {
    const { patients } = await getPatients(supabase, { phone });

    return (
      <div className="mx-auto max-w-4xl space-y-8 p-6">
        <h1 className="text-xl font-semibold">New Case — Select Patient</h1>

        {error && (
          <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <form className="flex gap-2 rounded-lg border border-gray-200 p-6 shadow-sm">
          <input
            name="phone"
            type="text"
            placeholder="Search by phone number"
            defaultValue={phone}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Search
          </button>
        </form>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="py-2">Name</th>
              <th>Phone</th>
              <th>DOB</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id} className="border-b border-gray-100">
                <td className="py-2">
                  {p.first_name} {p.last_name}
                </td>
                <td>{p.phone}</td>
                <td>{p.dob}</td>
                <td>
                  <Link
                    href={`/receptionist/cases/new?patientId=${p.id}`}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    Select
                  </Link>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">
                  {phone
                    ? `No patients found for "${phone}".`
                    : "Search for a patient by phone."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  const patient = await getPatientById(supabase, patientId);
  const tests = await getTestCatalog(supabase, { activeOnly: true });

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <h1 className="text-xl font-semibold">New Case</h1>

      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
        <span>
          Creating case for <strong>{patient.first_name} {patient.last_name}</strong> ({patient.phone})
        </span>
        <Link href="/receptionist/cases/new" className="text-gray-500 hover:underline">
          Change patient
        </Link>
      </div>

      {error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form
        action={addCase}
        className="grid grid-cols-2 gap-4 rounded-lg border border-gray-200 p-6 shadow-sm"
      >
        <input type="hidden" name="patient_id" value={patient.id} />

        <div className="col-span-2 space-y-1">
          <label htmlFor="came_from" className="text-sm font-medium">
            Where do you come from
          </label>
          <input
            id="came_from"
            name="came_from"
            type="text"
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
            defaultValue=""
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
            defaultValue=""
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
              className="h-4 w-4 rounded border-gray-300"
            />
            Pregnant
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              name="smoker"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
            />
            Smoker
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              name="athletic"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
            />
            Athletic
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              name="alcoholic"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
            />
            Alcoholic
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              name="has_diet_plan"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
            />
            Has diet plan
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              name="has_prior_contract"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
            />
            Has prior contract
          </label>
        </div>

        <div className="col-span-2 space-y-2">
          <p className="text-sm font-medium">Tests to order</p>
          <div className="grid grid-cols-2 gap-2 rounded border border-gray-200 p-3">
            {tests.map((test) => (
              <label
                key={test.id}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  name="test_ids"
                  type="checkbox"
                  value={test.id}
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
          Create case
        </button>
      </form>
    </div>
  );
}
