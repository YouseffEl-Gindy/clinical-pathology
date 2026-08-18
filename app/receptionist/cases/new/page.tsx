import Link from "next/link";
import { createClient } from "@/app/_lib/supabase/server";
import { getPatients, getPatientById } from "@/app/_lib/data/patients";
import { getTestCatalog } from "@/app/_lib/data/test-catalog";
import { addCase } from "@/app/_lib/actions/cases";
import { CaseForm } from "@/app/_components/receptionist/CaseForm";
import { PatientPicker } from "@/app/_components/receptionist/PatientPicker";
import { BackLink } from "@/app/_components/ui/BackLink";
import { ErrorBanner } from "@/app/_components/ui/ErrorBanner";
import { firstParam } from "@/app/_lib/helpers";

export default async function NewCasePage({
  searchParams,
}: PageProps<"/receptionist/cases/new">) {
  const {
    phone: rawPhone,
    patientId: rawPatientId,
    error,
  } = await searchParams;
  const phone = firstParam(rawPhone);
  const patientId = firstParam(rawPatientId);

  const supabase = await createClient();

  // No patient chosen yet — show the picker instead of the questionnaire.
  if (!patientId) {
    const { patients } = await getPatients(supabase, { phone });

    return (
      <div className="mx-auto max-w-4xl space-y-8 p-6">
        <BackLink href="/receptionist/cases">All cases</BackLink>
        <h1 className="text-xl font-semibold">New Case — Select Patient</h1>
        <ErrorBanner message={error} />
        <PatientPicker patients={patients} phone={phone} />
      </div>
    );
  }

  // Independent of each other — fetched together so the two round trips
  // overlap instead of queueing.
  const [patient, tests] = await Promise.all([
    getPatientById(supabase, patientId),
    getTestCatalog(supabase, { activeOnly: true }),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <BackLink href="/receptionist/cases">All cases</BackLink>
      <h1 className="text-xl font-semibold">New Case</h1>

      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
        <span>
          Creating case for{" "}
          <strong>
            {patient.first_name} {patient.last_name}
          </strong>{" "}
          ({patient.phone})
        </span>
        <Link
          href="/receptionist/cases/new"
          className="text-gray-500 hover:underline"
        >
          Change patient
        </Link>
      </div>

      <ErrorBanner message={error} />

      <CaseForm patientId={patient.id} tests={tests} action={addCase} />
    </div>
  );
}
