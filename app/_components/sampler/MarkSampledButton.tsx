"use client";

import { sampleTestOrder } from "@/app/_lib/actions/test-orders";

export function MarkSampledButton({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  if (status === "sampled") {
    return (
      <span className="rounded bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
        Sampled
      </span>
    );
  }

  return (
    <form action={sampleTestOrder}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded bg-gray-900 px-3 py-1 text-sm font-medium text-white hover:bg-gray-800"
      >
        Mark sampled
      </button>
    </form>
  );
}
