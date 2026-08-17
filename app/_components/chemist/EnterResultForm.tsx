import { enterTestResult } from "@/app/_lib/actions/test-orders";
import { Button } from "@/app/_components/ui/Button";

/** Inline result entry for one test order: a number, its unit, and Save. */
export function EnterResultForm({
  id,
  unit,
}: {
  id: string;
  unit: string | null;
}) {
  return (
    <form
      action={enterTestResult}
      className="flex items-center justify-end gap-2"
    >
      <input type="hidden" name="id" value={id} />
      <input
        type="number"
        step="any"
        name="result_value"
        required
        className="w-24 rounded border border-gray-300 px-2 py-1 text-sm"
      />
      {unit && <span className="text-sm text-gray-500">{unit}</span>}
      <Button size="sm">Save result</Button>
    </form>
  );
}
