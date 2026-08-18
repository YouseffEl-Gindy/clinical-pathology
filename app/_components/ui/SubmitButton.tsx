"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/app/_components/ui/Button";

/**
 * A submit button that disables itself and shows a spinner while its form's
 * server action is running.
 *
 * A thin client wrapper rather than a change to `Button` because
 * `useFormStatus` only works in a client component, and only reports the
 * status of the form the button sits inside — so it has to be a *child* of the
 * `<form>`, not the form itself.
 *
 * Only useful on forms whose `action` is a function. A plain GET form (the
 * phone search, the chemist filters) submits natively, which `useFormStatus`
 * does not track — those are ordinary navigations, covered by `loading.tsx`.
 */
export function SubmitButton({
  children,
  pendingLabel,
  disabled,
  ...props
}: React.ComponentProps<typeof Button> & { pendingLabel?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button {...props} disabled={pending || disabled}>
      {pending && (
        <span
          aria-hidden
          className="mr-2 inline-block size-3 animate-spin rounded-full border-2 border-current border-t-transparent align-[-1px]"
        />
      )}
      {pending && pendingLabel ? pendingLabel : children}
    </Button>
  );
}
