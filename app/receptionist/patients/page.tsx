import Link from "next/link";
import { createClient } from "@/app/_lib/supabase/server";
import { getPatients } from "@/app/_lib/data/patients";
import { DeletePatientButton } from "@/app/_components/receptionist/DeletePatientButton";

export default async function PatientsSearchPage({
  searchParams,
}: PageProps<"/receptionist/patients">) {
  const { phone: rawPhone, page: rawPage, error } = await searchParams;
  const phone = Array.isArray(rawPhone) ? rawPhone[0] : rawPhone;
  const pageParam = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const page = Math.max(1, Number(pageParam) || 1);

  const supabase = await createClient();
  const { patients, count, pageSize } = await getPatients(supabase, {
    phone,
    page,
  });
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  const hrefForPage = (p: number) =>
    `/receptionist/patients?${new URLSearchParams({
      ...(phone ? { phone } : {}),
      page: String(p),
    })}`;

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
            <th>Gender</th>
            <th></th>
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
            </tr>
          ))}
          {patients.length === 0 && (
            <tr>
              <td colSpan={6} className="py-4 text-center text-gray-500">
                {phone
                  ? `No patients found for "${phone}".`
                  : "No patients yet."}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {count > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Page {page} of {totalPages} ({count} patient
            {count === 1 ? "" : "s"})
          </span>
          <div className="flex gap-4">
            {page > 1 ? (
              <Link href={hrefForPage(page - 1)} className="hover:underline">
                ← Previous
              </Link>
            ) : (
              <span className="text-gray-300">← Previous</span>
            )}
            {page < totalPages ? (
              <Link href={hrefForPage(page + 1)} className="hover:underline">
                Next →
              </Link>
            ) : (
              <span className="text-gray-300">Next →</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
