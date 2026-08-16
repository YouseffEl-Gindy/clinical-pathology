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
