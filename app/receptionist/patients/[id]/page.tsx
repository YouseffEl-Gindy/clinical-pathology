import { createClient } from "@/app/_lib/supabase/server";
import { getPatientById } from "@/app/_lib/data/patients";

export default async function PatientDetailPage({
  params,
}: PageProps<"/receptionist/patients/[id]">) {
  const { id } = await params;
  const supabase = await createClient();
  const patient = await getPatientById(supabase, id);

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <h1 className="text-xl font-semibold">
        {patient.first_name} {patient.last_name}
      </h1>

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
    </div>
  );
}
