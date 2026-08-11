import Link from "next/link";
import { createClient } from "@/app/_lib/supabase/server";
import { getCases } from "@/app/_lib/data/cases";
import { getTestOrderStatusesForCases } from "@/app/_lib/data/test-orders";
import { DeleteCaseButton } from "@/app/_components/receptionist/DeleteCaseButton";

export default async function CasesListPage({
  searchParams,
}: PageProps<"/receptionist/cases">) {
  const { phone: rawPhone, page: rawPage } = await searchParams;
  const phone = Array.isArray(rawPhone) ? rawPhone[0] : rawPhone;
  const pageParam = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const page = Math.max(1, Number(pageParam) || 1);

  const supabase = await createClient();
  const { cases, count, pageSize } = await getCases(supabase, { phone, page });
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  const orderStatuses =
    cases.length > 0
      ? await getTestOrderStatusesForCases(
          supabase,
          cases.map((c) => c.id)
        )
      : [];
  const editableCaseIds = new Set(
    cases
      .filter((c) =>
        orderStatuses
          .filter((o) => o.case_id === c.id)
          .every((o) => o.status === "ordered")
      )
      .map((c) => c.id)
  );

  const hrefForPage = (p: number) =>
    `/receptionist/cases?${new URLSearchParams({
      ...(phone ? { phone } : {}),
      page: String(p),
    })}`;

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Cases</h1>
        <Link
          href="/receptionist/cases/new"
          className="rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          + New case
        </Link>
      </div>

      <form className="flex gap-2 rounded-lg border border-gray-200 p-6 shadow-sm">
        <input
          name="phone"
          type="text"
          placeholder="Search by patient phone number"
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
            <th className="py-2">Patient</th>
            <th>Phone</th>
            <th>Created</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.id} className="border-b border-gray-100">
              <td className="py-2">
                <Link
                  href={`/receptionist/patients/${c.patient_id}`}
                  className="hover:underline"
                >
                  {c.patients.first_name} {c.patients.last_name}
                </Link>
              </td>
              <td>{c.patients.phone}</td>
              <td>{new Date(c.created_at).toLocaleDateString()}</td>
              <td>
                <Link
                  href={`/receptionist/cases/${c.id}`}
                  className="text-sm text-gray-500 hover:underline"
                >
                  View
                </Link>
              </td>
              <td>{editableCaseIds.has(c.id) && <DeleteCaseButton id={c.id} />}</td>
            </tr>
          ))}
          {cases.length === 0 && (
            <tr>
              <td colSpan={5} className="py-4 text-center text-gray-500">
                {phone ? `No cases found for "${phone}".` : "No cases yet."}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {count > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Page {page} of {totalPages} ({count} case{count === 1 ? "" : "s"})
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
