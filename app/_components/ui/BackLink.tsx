import Link from "next/link";

/**
 * The quiet "go back up one level" link that sits above a page heading.
 *
 * Deliberately a plain link rather than a `LinkButton` — every page has one, and
 * they'd compete with the page's real action if they were all filled buttons.
 */
export function BackLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-block text-sm text-gray-500 hover:underline"
    >
      ← {children}
    </Link>
  );
}
