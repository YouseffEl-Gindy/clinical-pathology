import { createClient } from "@/app/_lib/supabase/server";
import { getSamplerBoardCases } from "@/app/_lib/data/cases";
import { SamplerCaseCard } from "@/app/_components/sampler/SamplerCaseCard";
import { BackLink } from "@/app/_components/ui/BackLink";
import { filterRecentlySampledCases } from "@/app/_lib/helpers";

export default async function SamplerPage() {
  const supabase = await createClient();
  const cases = await getSamplerBoardCases(supabase);
  const caseGroups = filterRecentlySampledCases(cases);

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <BackLink href="/">Home</BackLink>

      <h1 className="text-xl font-semibold">Tests waiting to be sampled</h1>

      {caseGroups.length === 0 && (
        <p className="text-center text-sm text-gray-500">
          No tests waiting to be sampled.
        </p>
      )}

      <div className="space-y-6">
        {caseGroups.map((group) => (
          <SamplerCaseCard key={group.case.id} group={group} />
        ))}
      </div>
    </div>
  );
}
