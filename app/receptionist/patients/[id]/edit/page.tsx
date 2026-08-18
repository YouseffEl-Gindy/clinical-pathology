import { createClient } from "@/app/_lib/supabase/server";
import { getPatientById } from "@/app/_lib/data/patients";
import { editPatient } from "@/app/_lib/actions/patients";
import { PatientForm } from "@/app/_components/receptionist/PatientForm";
import { BackLink } from "@/app/_components/ui/BackLink";
import { ErrorBanner } from "@/app/_components/ui/ErrorBanner";

export default async function EditPatientPage({
  params,
  searchParams,
}: PageProps<"/receptionist/patients/[id]/edit">) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();
  const patient = await getPatientById(supabase, id);

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <BackLink href={`/receptionist/patients/${id}`}>Back to patient</BackLink>
      <h1 className="text-xl font-semibold">Edit Patient</h1>
      <ErrorBanner message={error} />
      <PatientForm patient={patient} action={editPatient} />
    </div>
  );
}
