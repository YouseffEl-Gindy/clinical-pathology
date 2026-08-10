import { createClient } from "@/app/_lib/supabase/server";
import { getTestById } from "@/app/_lib/data/test-catalog";
import { editTest } from "@/app/_lib/actions/test-catalog";

export default async function EditTestPage({
  params,
  searchParams,
}: PageProps<"/pathologist/catalog/[id]/edit">) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();
  const test = await getTestById(supabase, id);

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <h1 className="text-xl font-semibold">Edit Test</h1>

      {error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form
        action={editTest}
        className="grid grid-cols-2 gap-4 rounded-lg border border-gray-200 p-6 shadow-sm"
      >
        <input type="hidden" name="id" value={test.id} />

        <div className="col-span-2 space-y-1">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={test.name ?? ""}
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
            defaultValue={test.code ?? ""}
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
            defaultValue={test.specimen_type ?? ""}
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
            defaultValue={test.price ?? ""}
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
            defaultValue={test.unit ?? ""}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="col-span-2 flex items-center gap-2">
          <input
            id="active"
            name="active"
            type="checkbox"
            defaultChecked={test.active}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="active" className="text-sm font-medium">
            Active
          </label>
        </div>

        <button
          type="submit"
          className="col-span-2 rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Save changes
        </button>

        <a
          href="/pathologist/catalog"
          className="col-span-2 text-center text-sm text-gray-500 hover:underline"
        >
          Cancel
        </a>
      </form>
    </div>
  );
}
