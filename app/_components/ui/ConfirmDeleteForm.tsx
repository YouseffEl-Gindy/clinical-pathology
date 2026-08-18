"use client";

import { SubmitButton } from "@/app/_components/ui/SubmitButton";

/**
 * A "Delete" button that asks for confirmation before submitting.
 *
 * The three delete buttons (patient, case, catalog test) are the same form
 * with a different action and a different confirmation message.
 */
export function ConfirmDeleteForm({
  id,
  action,
  message,
  label = "Delete",
}: {
  id: string;
  action: (formData: FormData) => void | Promise<void>;
  message: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(message)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <SubmitButton variant="danger">{label}</SubmitButton>
    </form>
  );
}
