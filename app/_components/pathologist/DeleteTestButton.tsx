"use client";

import { deleteTestAction } from "@/app/_lib/actions/test-catalog";

export function DeleteTestButton({ id }: { id: string }) {
  return (
    <form
      action={deleteTestAction}
      onSubmit={(e) => {
        if (!confirm("Delete this test? This cannot be undone.")) {
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
