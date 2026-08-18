/**
 * The placeholder a role section shows while its next page renders on the server.
 *
 * Exists so a slow navigation is visible rather than silent: without a
 * `loading.tsx` boundary the router keeps the previous page on screen,
 * completely unchanged, until the whole server render finishes — so a stall
 * and a fast response look identical to the person clicking.
 */
export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      role="status"
      className="mx-auto flex max-w-4xl items-center justify-center gap-3 p-16 text-sm text-gray-500"
    >
      <span
        aria-hidden
        className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"
      />
      {label}
    </div>
  );
}
