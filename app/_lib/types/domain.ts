import type {
  getChemistBoardTestOrdersPaginated,
  getChemistHistoryTestOrders,
} from "@/app/_lib/data/test-orders";

export type SamplerBoardCase = {
  id: string;
  created_at: string;
  patients: { first_name: string; last_name: string; phone: string };
  test_orders: {
    id: string;
    status: string;
    sampled_at: string | null;
    test_catalog: { name: string; code: string; specimen_type: string | null };
  }[];
};

export type ChemistBoardCase = {
  id: string;
  created_at: string;
  patients: { first_name: string; last_name: string; phone: string };
  test_orders: {
    id: string;
    status: string;
    test_catalog: {
      name: string;
      code: string;
      specimen_type: string | null;
      unit: string | null;
    };
  }[];
};

/** Where a case sits in the sampling stage — derived, never stored. */
export type CaseStatusLabel = "ordered" | "sampling" | "sampled";

/** One sampler-board case with its derived status label. */
export type SamplerCaseGroup = {
  case: SamplerBoardCase;
  tests: SamplerBoardCase["test_orders"];
  label: CaseStatusLabel;
  lastSampledAt: string | null;
};

/** One row of the chemist's "tests waiting to be processed" board. */
export type ChemistBoardOrder = Awaited<
  ReturnType<typeof getChemistBoardTestOrdersPaginated>
>["orders"][number];

/** One row of the chemist's processed-tests history. */
export type ChemistHistoryOrder = Awaited<
  ReturnType<typeof getChemistHistoryTestOrders>
>[number];
