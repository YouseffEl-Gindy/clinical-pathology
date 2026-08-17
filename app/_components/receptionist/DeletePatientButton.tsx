import { deletePatientAction } from "@/app/_lib/actions/patients";
import { ConfirmDeleteForm } from "@/app/_components/ui/ConfirmDeleteForm";

export function DeletePatientButton({ id }: { id: string }) {
  return (
    <ConfirmDeleteForm
      id={id}
      action={deletePatientAction}
      message="Delete this patient? This cannot be undone."
    />
  );
}
