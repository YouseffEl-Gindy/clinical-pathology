"use client";

import { deleteCaseAction } from "@/app/_lib/actions/cases";

export function DeleteCaseButton({ id }: { id: string }) {
  return (
    <form
      action={deleteCaseAction}
      onSubmit={(e) => {
        if (!confirm("Delete this case? This cannot be undone.")) {
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
