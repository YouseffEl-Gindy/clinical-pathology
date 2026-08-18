import Link from "next/link";
import { SubmitButton } from "@/app/_components/ui/SubmitButton";
import { CARD_CLASS } from "@/app/_components/ui/Card";
import { TextField } from "@/app/_components/ui/FormField";
import { Checkbox } from "@/app/_components/ui/Input";
import type { Tables } from "@/app/_lib/types/database.types";

/**
 * The test-catalog entry form, shared by add and edit.
 *
 * The active/inactive toggle only appears in edit mode — a newly added test is
 * always active, and the catalog list is where deactivation happens.
 */
export function TestForm({
  test,
  action,
}: {
  test?: Tables<"test_catalog">;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const isEdit = test !== undefined;

  return (
    <form action={action} className={`grid grid-cols-2 gap-4 ${CARD_CLASS}`}>
      {isEdit && <input type="hidden" name="id" value={test.id} />}

      <TextField
        label="Name"
        name="name"
        type="text"
        required
        fieldClassName="col-span-2"
        defaultValue={test?.name ?? ""}
      />
      <TextField
        label="Code"
        name="code"
        type="text"
        defaultValue={test?.code ?? ""}
      />
      <TextField
        label="Specimen type"
        name="specimen_type"
        type="text"
        defaultValue={test?.specimen_type ?? ""}
      />
      <TextField
        label="Price"
        name="price"
        type="number"
        step="0.01"
        min="0"
        required
        defaultValue={test?.price ?? ""}
      />
      <TextField
        label="Unit"
        name="unit"
        type="text"
        defaultValue={test?.unit ?? ""}
      />

      {isEdit && (
        <div className="col-span-2 flex items-center gap-2">
          <Checkbox id="active" name="active" defaultChecked={test.active} />
          <label htmlFor="active" className="text-sm font-medium">
            Active
          </label>
        </div>
      )}

      <SubmitButton className="col-span-2">
        {isEdit ? "Save changes" : "Add test"}
      </SubmitButton>

      {isEdit && (
        <Link
          href="/pathologist/catalog"
          className="col-span-2 text-center text-sm text-gray-500 hover:underline"
        >
          Cancel
        </Link>
      )}
    </form>
  );
}
