import Link from "next/link";
import { createClient } from "@/app/_lib/supabase/server";
import { getTestCatalog } from "@/app/_lib/data/test-catalog";
import { addTest } from "@/app/_lib/actions/test-catalog";
import { DeleteTestButton } from "@/app/_components/pathologist/DeleteTestButton";
import { TestForm } from "@/app/_components/pathologist/TestForm";
import { ErrorBanner } from "@/app/_components/ui/ErrorBanner";
import { Row, Table } from "@/app/_components/ui/Table";

export default async function TestCatalogPage({
  searchParams,
}: PageProps<"/pathologist/catalog">) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const tests = await getTestCatalog(supabase);

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <h1 className="text-xl font-semibold">Test Catalog</h1>

      <ErrorBanner message={error} />

      <TestForm action={addTest} />

      <Table
        headers={[
          "Code",
          "Name",
          "Specimen",
          "Price",
          "Unit",
          "Status",
          "",
          "",
        ]}
        isEmpty={tests.length === 0}
        emptyMessage="No tests yet."
      >
        {tests.map((t) => (
          <Row key={t.id}>
            <td className="py-2">{t.code ?? "—"}</td>
            <td>{t.name ?? "—"}</td>
            <td>{t.specimen_type ?? "—"}</td>
            <td>{t.price ?? "—"}</td>
            <td>{t.unit ?? "—"}</td>
            <td>
              {t.active ? (
                <span className="text-green-700">Active</span>
              ) : (
                <span className="text-gray-400">Inactive</span>
              )}
            </td>
            <td>
              <Link
                href={`/pathologist/catalog/${t.id}/edit`}
                className="text-sm text-gray-500 hover:underline"
              >
                Edit
              </Link>
            </td>
            <td>
              <DeleteTestButton id={t.id} />
            </td>
          </Row>
        ))}
      </Table>
    </div>
  );
}
