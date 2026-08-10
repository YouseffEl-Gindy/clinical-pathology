import { createClient } from "@/app/_lib/supabase/server";
import { getTestCatalog } from "@/app/_lib/data/test-catalog";
import { addTest } from "@/app/_lib/actions/test-catalog";
import { DeleteTestButton } from "@/app/_components/pathologist/DeleteTestButton";

export default async function TestCatalogPage({
  searchParams,
}: PageProps<"/pathologist/catalog">) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const tests = await getTestCatalog(supabase);

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <h1 className="text-xl font-semibold">Test Catalog</h1>

      {error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form
        action={addTest}
        className="grid grid-cols-2 gap-4 rounded-lg border border-gray-200 p-6 shadow-sm"
      >
        <div className="col-span-2 space-y-1">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="code" className="text-sm font-medium">
            Code
          </label>
          <input
            id="code"
            name="code"
            type="text"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="specimen_type" className="text-sm font-medium">
            Specimen type
          </label>
          <input
            id="specimen_type"
            name="specimen_type"
            type="text"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="price" className="text-sm font-medium">
            Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="unit" className="text-sm font-medium">
            Unit
          </label>
          <input
            id="unit"
            name="unit"
            type="text"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="col-span-2 rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add test
        </button>
      </form>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500">
            <th className="py-2">Code</th>
            <th>Name</th>
            <th>Specimen</th>
            <th>Price</th>
            <th>Unit</th>
            <th>Status</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tests.map((t) => (
            <tr key={t.id} className="border-b border-gray-100">
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
                <a
                  href={`/pathologist/catalog/${t.id}/edit`}
                  className="text-sm text-gray-500 hover:underline"
                >
                  Edit
                </a>
              </td>
              <td>
                <DeleteTestButton id={t.id} />
              </td>
            </tr>
          ))}
          {tests.length === 0 && (
            <tr>
              <td colSpan={8} className="py-4 text-center text-gray-500">
                No tests yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
