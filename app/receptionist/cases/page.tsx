import Link from "next/link";
import { createClient } from "@/app/_lib/supabase/server";
import { getCases } from "@/app/_lib/data/cases";
import { getTestOrderStatusesForCases } from "@/app/_lib/data/test-orders";
import { DeleteCaseButton } from "@/app/_components/receptionist/DeleteCaseButton";
import { PhoneSearchForm } from "@/app/_components/shared/PhoneSearchForm";
import { BackLink } from "@/app/_components/ui/BackLink";
import { LinkButton } from "@/app/_components/ui/LinkButton";
import { Pagination } from "@/app/_components/ui/Pagination";
import { Row, Table } from "@/app/_components/ui/Table";
import { firstParam, parsePageParam } from "@/app/_lib/helpers";

export default async function CasesListPage({
  searchParams,
}: PageProps<"/receptionist/cases">) {
  const { phone: rawPhone, page: rawPage } = await searchParams;
  const phone = firstParam(rawPhone);
  const page = parsePageParam(rawPage);

  const supabase = await createClient();
  const { cases, count, pageSize } = await getCases(supabase, { phone, page });

  // A case can only be deleted while every one of its tests is still `ordered`.
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

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <BackLink href="/">Home</BackLink>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Cases</h1>
        <LinkButton href="/receptionist/cases/new">+ New case</LinkButton>
      </div>

      <PhoneSearchForm
        placeholder="Search by patient phone number"
        defaultValue={phone}
      />

      <Table
        headers={["Patient", "Phone", "Created", "", ""]}
        isEmpty={cases.length === 0}
        emptyMessage={
          phone ? `No cases found for "${phone}".` : "No cases yet."
        }
      >
        {cases.map((c) => (
          <Row key={c.id}>
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
          </Row>
        ))}
      </Table>

      <Pagination
        page={page}
        count={count}
        pageSize={pageSize}
        basePath="/receptionist/cases"
        params={{ phone }}
        noun="case"
      />
    </div>
  );
}
