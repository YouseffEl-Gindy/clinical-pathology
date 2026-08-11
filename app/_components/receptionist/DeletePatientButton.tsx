"use client";

import { deletePatientAction } from "@/app/_lib/actions/patients";

export function DeletePatientButton({ id }: { id: string }) {
  return (
    <form
      action={deletePatientAction}
      onSubmit={(e) => {
        if (!confirm("Delete this patient? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-sm text-red-600 hover:underline">
        Delete
      </button>
    </form>
  );
}
