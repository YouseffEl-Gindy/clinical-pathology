import { createClient } from "@/app/_lib/supabase/server";
import { getSamplerBoardTestOrders } from "@/app/_lib/data/test-orders";
import { MarkSampledButton } from "@/app/_components/sampler/MarkSampledButton";

const SAMPLED_CASE_VISIBLE_MS = 3 * 60 * 1000;

const CASE_BADGE_STYLES: Record<string, string> = {
  ordered: "bg-gray-100 text-gray-700",
  sampling: "bg-amber-100 text-amber-700",
  sampled: "bg-green-100 text-green-700",
};

export default async function SamplerPage() {
  const supabase = await createClient();
  const orders = await getSamplerBoardTestOrders(supabase);

  const groups = new Map<string, (typeof orders)[number][]>();
  for (const order of orders) {
    const caseId = order.cases.id;
    const group = groups.get(caseId);
    if (group) {
      group.push(order);
    } else {
      groups.set(caseId, [order]);
    }
  }

  const now = Date.now();
  const caseGroups = Array.from(groups.values())
    .map((tests) => {
      const allSampled = tests.every((t) => t.status === "sampled");
      const noneSampled = tests.every((t) => t.status === "ordered");
      const label = noneSampled ? "ordered" : allSampled ? "sampled" : "sampling";
      const lastSampledAt = allSampled
        ? tests.reduce<string | null>((latest, t) => {
            if (!t.sampled_at) return latest;
            return !latest || t.sampled_at > latest ? t.sampled_at : latest;
          }, null)
        : null;
      return { tests, label, lastSampledAt };
    })
    .filter(({ label, lastSampledAt }) => {
      if (label !== "sampled" || !lastSampledAt) return true;
      return now - new Date(lastSampledAt).getTime() <= SAMPLED_CASE_VISIBLE_MS;
    });

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <h1 className="text-xl font-semibold">Tests waiting to be sampled</h1>

      {caseGroups.length === 0 && (
        <p className="text-center text-sm text-gray-500">
          No tests waiting to be sampled.
        </p>
      )}

      <div className="space-y-6">
        {caseGroups.map(({ tests, label }) => {
          const { cases } = tests[0];
          const patient = cases.patients;
          return (
            <div
              key={cases.id}
              className="rounded-lg border border-gray-200 p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium">
                    {patient.first_name} {patient.last_name}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${CASE_BADGE_STYLES[label]}`}
                  >
                    {label}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{patient.phone}</span>
              </div>

              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="py-2">Test</th>
                    <th>Code</th>
                    <th>Specimen</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100">
                      <td className="py-2">{order.test_catalog.name}</td>
                      <td>{order.test_catalog.code}</td>
                      <td>{order.test_catalog.specimen_type}</td>
                      <td className="text-right">
                        <MarkSampledButton id={order.id} status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
