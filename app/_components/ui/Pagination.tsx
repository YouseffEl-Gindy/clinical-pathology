import Link from "next/link";
import { buildPageHref } from "@/app/_lib/helpers";

/**
 * The "Page X of Y" footer with previous/next links.
 *
 * `params` are the other filters in the URL (phone, view, test ids…); they are
 * carried onto every page link. Renders nothing when there are no results.
 */
export function Pagination({
  page,
  count,
  pageSize,
  basePath,
  params = {},
  noun,
}: {
  page: number;
  count: number;
  pageSize: number;
  basePath: string;
  params?: Record<string, string | string[] | undefined>;
  /** Singular noun for the count, e.g. "case" — pluralised automatically. */
  noun: string;
}) {
  if (count === 0) return null;

  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const hrefForPage = (p: number) => buildPageHref(basePath, params, p);

  return (
    <div className="flex items-center justify-between text-sm text-gray-500">
      <span>
        Page {page} of {totalPages} ({count} {noun}
        {count === 1 ? "" : "s"})
      </span>
      <div className="flex gap-4">
        {page > 1 ? (
          <Link href={hrefForPage(page - 1)} className="hover:underline">
            ← Previous
          </Link>
        ) : (
          <span className="text-gray-300">← Previous</span>
        )}
        {page < totalPages ? (
          <Link href={hrefForPage(page + 1)} className="hover:underline">
            Next →
          </Link>
        ) : (
          <span className="text-gray-300">Next →</span>
        )}
      </div>
    </div>
  );
}
