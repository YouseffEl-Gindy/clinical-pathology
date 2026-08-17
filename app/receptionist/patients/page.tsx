import Link from "next/link";
import { createClient } from "@/app/_lib/supabase/server";
import { getPatients } from "@/app/_lib/data/patients";
import { DeletePatientButton } from "@/app/_components/receptionist/DeletePatientButton";
import { PhoneSearchForm } from "@/app/_components/shared/PhoneSearchForm";
import { ErrorBanner } from "@/app/_components/ui/ErrorBanner";
import { Pagination } from "@/app/_components/ui/Pagination";
import { Row, Table } from "@/app/_components/ui/Table";
import { firstParam, parsePageParam } from "@/app/_lib/helpers";

export default async function PatientsSearchPage({
  searchParams,
}: PageProps<"/receptionist/patients">) {
  const { phone: rawPhone, page: rawPage, error } = await searchParams;
  const phone = firstParam(rawPhone);
  const page = parsePageParam(rawPage);

  const supabase = await createClient();
  const { patients, count, pageSize } = await getPatients(supabase, {
    phone,
    page,
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Patients</h1>
        <Link
          href="/receptionist/patients/new"
          className="rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          + Register new patient
        </Link>
      </div>

      <ErrorBanner message={error} />

      <PhoneSearchForm defaultValue={phone} />

      <Table
        headers={["Name", "Phone", "DOB", "Gender", "", ""]}
        isEmpty={patients.length === 0}
        emptyMessage={
          phone ? `No patients found for "${phone}".` : "No patients yet."
        }
      >
        {patients.map((p) => (
          <Row key={p.id}>
            <td className="py-2">
              {p.first_name} {p.last_name}
            </td>
            <td>{p.phone}</td>
            <td>{p.dob}</td>
            <td>{p.gender}</td>
            <td>
              <Link
                href={`/receptionist/patients/${p.id}`}
                className="text-sm text-gray-500 hover:underline"
              >
                View
              </Link>
            </td>
            <td>
              <DeletePatientButton id={p.id} />
            </td>
          </Row>
        ))}
      </Table>

      <Pagination
        page={page}
        count={count}
        pageSize={pageSize}
        basePath="/receptionist/patients"
        params={{ phone }}
        noun="patient"
      />
    </div>
  );
}
