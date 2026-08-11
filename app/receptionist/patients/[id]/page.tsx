import Link from "next/link";
import { createClient } from "@/app/_lib/supabase/server";
import { getPatientById } from "@/app/_lib/data/patients";
import { getCasesForPatient } from "@/app/_lib/data/cases";
import { DeletePatientButton } from "@/app/_components/receptionist/DeletePatientButton";

export default async function PatientDetailPage({
  params,
}: PageProps<"/receptionist/patients/[id]">) {
  const { id } = await params;
  const supabase = await createClient();
  const patient = await getPatientById(supabase, id);
  const cases = await getCasesForPatient(supabase, id);

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {patient.first_name} {patient.last_name}
        </h1>
        <div className="flex items-center gap-4">
          <Link
            href={`/receptionist/patients/${patient.id}/edit`}
            className="text-sm text-gray-500 hover:underline"
          >
            Edit
          </Link>
          <DeletePatientButton id={patient.id} />
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-4 rounded-lg border border-gray-200 p-6 shadow-sm text-sm">
        <div>
          <dt className="text-gray-500">Date of birth</dt>
          <dd>{patient.dob}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Phone</dt>
          <dd>{patient.phone}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Gender</dt>
          <dd>{patient.gender}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Marital status</dt>
          <dd>{patient.marital_status ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Residence</dt>
          <dd>{patient.residence ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Email</dt>
          <dd>{patient.email ?? "—"}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-gray-500">Referral source</dt>
          <dd>{patient.referral_source ?? "—"}</dd>
        </div>
      </dl>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Cases</h2>
          <Link
            href={`/receptionist/cases/new?patientId=${patient.id}`}
            className="text-sm text-gray-500 hover:underline"
          >
            + New case
          </Link>
        </div>

        <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 text-sm">
          {cases.map((c) => (
            <li key={c.id} className="px-4 py-2">
              <Link
                href={`/receptionist/cases/${c.id}`}
                className="hover:underline"
              >
                {new Date(c.created_at).toLocaleDateString()}
              </Link>
            </li>
          ))}
          {cases.length === 0 && (
            <li className="px-4 py-4 text-center text-gray-500">
              No cases yet.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
