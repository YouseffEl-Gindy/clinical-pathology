import type { CaseStatusLabel } from "@/app/_lib/types/domain";

const CASE_BADGE_STYLES: Record<CaseStatusLabel, string> = {
  ordered: "bg-gray-100 text-gray-700",
  sampling: "bg-amber-100 text-amber-700",
  sampled: "bg-green-100 text-green-700",
};

/** Where a case sits in sampling: nothing drawn yet, part-way, or all drawn. */
export function CaseStatusBadge({ label }: { label: CaseStatusLabel }) {
  return (
    <span
      className={`rounded px-2 py-0.5 text-xs font-medium ${CASE_BADGE_STYLES[label]}`}
    >
      {label}
    </span>
  );
}
