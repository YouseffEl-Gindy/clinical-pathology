/** Rows per page for every paginated list (patients, cases, chemist board). */
export const PAGE_SIZE = 20;

/**
 * How long a fully-sampled case stays on the sampler board before dropping off.
 * Checked on render only — there is no auto-polling.
 */
export const SAMPLED_CASE_VISIBLE_MS = 3 * 60 * 1000;

/** The four staff roles that can be assigned a login. */
export const VALID_ROLES = [
  "receptionist",
  "sampler",
  "chemist",
  "pathologist",
] as const;

export type StaffRole = (typeof VALID_ROLES)[number];

/**
 * Who may perform each stage's action.
 *
 * The pathologist appears in every group on purpose — per the spec they can do
 * everything the other roles can.
 */
export const RECEPTION_ROLES: StaffRole[] = ["receptionist", "pathologist"];
export const SAMPLING_ROLES: StaffRole[] = ["sampler", "pathologist"];
export const PROCESSING_ROLES: StaffRole[] = ["chemist", "pathologist"];
export const ADMIN_ROLES: StaffRole[] = ["pathologist"];
