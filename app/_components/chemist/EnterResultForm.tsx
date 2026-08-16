"use client";

import { enterTestResult } from "@/app/_lib/actions/test-orders";

export function EnterResultForm({
  id,
  unit,
}: {
  id: string;
  unit: string | null;
}) {
  return (
    <form action={enterTestResult} className="flex items-center justify-end gap-2">
      <input type="hidden" name="id" value={id} />
      <input
        type="number"
        step="any"
        name="result_value"
        required
        className="w-24 rounded border border-gray-300 px-2 py-1 text-sm"
      />
      {unit && <span className="text-sm text-gray-500">{unit}</span>}
      <button
        type="submit"
        className="rounded bg-gray-900 px-3 py-1 text-sm font-medium text-white hover:bg-gray-800"
      >
        Save result
      </button>
    </form>
  );
}
