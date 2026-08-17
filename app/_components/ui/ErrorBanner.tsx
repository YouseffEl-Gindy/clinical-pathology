/**
 * The red banner every page shows for an `?error=` search param.
 *
 * Accepts the raw search-param type so pages can pass `error` straight through
 * without unwrapping it first, and renders nothing when there is no message.
 */
export function ErrorBanner({
  message,
}: {
  message?: string | string[] | undefined;
}) {
  const text = Array.isArray(message) ? message[0] : message;
  if (!text) return null;

  return (
    <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{text}</p>
  );
}
