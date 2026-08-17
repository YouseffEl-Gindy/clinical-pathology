import { deleteTestAction } from "@/app/_lib/actions/test-catalog";
import { ConfirmDeleteForm } from "@/app/_components/ui/ConfirmDeleteForm";

export function DeleteTestButton({ id }: { id: string }) {
  return (
    <ConfirmDeleteForm
      id={id}
      action={deleteTestAction}
      message="Delete this test? This cannot be undone."
    />
  );
}
