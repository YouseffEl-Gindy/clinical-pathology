import Link from "next/link";

export function ViewToggle({
  basePath,
  active,
}: {
  basePath: string;
  active: "case" | "test";
}) {
  const tabs: { view: "case" | "test"; label: string }[] = [
    { view: "case", label: "By case" },
    { view: "test", label: "By test" },
  ];

  return (
    <div className="inline-flex rounded-lg border border-gray-200 p-1">
      {tabs.map(({ view, label }) => (
        <Link
          key={view}
          href={`${basePath}?view=${view}`}
          className={`rounded px-3 py-1 text-sm font-medium ${
            active === view
              ? "bg-gray-900 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
