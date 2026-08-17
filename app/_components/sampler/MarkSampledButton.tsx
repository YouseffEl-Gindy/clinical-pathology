import { sampleTestOrder } from "@/app/_lib/actions/test-orders";
import { Button } from "@/app/_components/ui/Button";

/** Advances one test order `ordered` → `sampled`, or shows that it's done. */
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
      <Button size="sm">Mark sampled</Button>
    </form>
  );
}
