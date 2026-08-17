import { addPatient } from "@/app/_lib/actions/patients";
import { PatientForm } from "@/app/_components/receptionist/PatientForm";
import { ErrorBanner } from "@/app/_components/ui/ErrorBanner";

export default async function NewPatientPage({
  searchParams,
}: PageProps<"/receptionist/patients/new">) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <h1 className="text-xl font-semibold">Register Patient</h1>
      <ErrorBanner message={error} />
      <PatientForm action={addPatient} />
    </div>
  );
}
