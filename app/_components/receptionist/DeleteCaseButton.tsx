import { deleteCaseAction } from "@/app/_lib/actions/cases";
import { ConfirmDeleteForm } from "@/app/_components/ui/ConfirmDeleteForm";

export function DeleteCaseButton({ id }: { id: string }) {
  return (
    <ConfirmDeleteForm
      id={id}
      action={deleteCaseAction}
      message="Delete this case? This cannot be undone."
    />
  );
}
