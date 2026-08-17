import { SAMPLED_CASE_VISIBLE_MS } from "@/app/_lib/constants";
import type { SamplerBoardCase, SamplerCaseGroup } from "@/app/_lib/types/domain";

/* ------------------------------------------------------------------ *
 * Search params
 * ------------------------------------------------------------------ */

/** Next gives a search param as `string | string[] | undefined`. Take the first value. */
export function firstParam(raw: string | string[] | undefined) {
  return Array.isArray(raw) ? raw[0] : raw;
}

/** Read a `?page=` param as a 1-based page number, defaulting to 1. */
export function parsePageParam(raw: string | string[] | undefined) {
  return Math.max(1, Number(firstParam(raw)) || 1);
}

/** Read a search param that may legitimately repeat (e.g. `?test=a&test=b`). */
export function paramList(raw: string | string[] | undefined) {
  if (raw === undefined) return [];
  return Array.isArray(raw) ? raw : [raw];
}

/**
 * Build the href for a given page of a paginated list, carrying the other
 * filters along. Undefined values and empty arrays are dropped.
 */
export function buildPageHref(
  basePath: string,
  params: Record<string, string | string[] | undefined>,
  page: number,
) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) search.append(key, v);
    } else {
      search.set(key, value);
    }
  }
  search.set("page", String(page));
  return `${basePath}?${search}`;
}

/* ------------------------------------------------------------------ *
 * Formatting
 * ------------------------------------------------------------------ */

export function yesNo(value: boolean | null) {
  return value ? "Yes" : "No";
}

/* ------------------------------------------------------------------ *
 * Errors
 * ------------------------------------------------------------------ */

/**
 * Turn a thrown Postgres error into a message worth showing a user.
 *
 * `byCode` maps a Postgres error code to a friendly message — most often
 * `23505` (unique violation) or `23503` (foreign key violation). Anything
 * unmapped falls back to the driver's own message, then to `fallback`.
 */
export function pgErrorMessage(
  err: unknown,
  fallback: string,
  byCode: Record<string, string> = {},
) {
  const pgError = err as { code?: string; message?: string };
  if (pgError?.code && byCode[pgError.code]) return byCode[pgError.code];
  return pgError?.message ?? fallback;
}

/* ------------------------------------------------------------------ *
 * Form parsing
 *
 * Each `parse*Form` is shared between the "add" and "edit" server action for
 * that entity — the two used to hold byte-identical copies of this code.
 * ------------------------------------------------------------------ */

/** A trimmed text field, or null when blank. */
function text(formData: FormData, name: string) {
  return (formData.get(name) as string)?.trim() || null;
}

/** A trimmed required text field — empty string rather than null when blank. */
function requiredText(formData: FormData, name: string) {
  return (formData.get(name) as string)?.trim() ?? "";
}

/** An unchecked HTML checkbox submits nothing; a checked one submits "on". */
function checkbox(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

export const PATIENT_REQUIRED_ERROR =
  "First name, last name, date of birth, phone, and gender are required";

export function parsePatientForm(formData: FormData) {
  return {
    first_name: requiredText(formData, "first_name"),
    last_name: requiredText(formData, "last_name"),
    dob: requiredText(formData, "dob"),
    phone: requiredText(formData, "phone"),
    gender: requiredText(formData, "gender"),
    residence: text(formData, "residence"),
    marital_status: text(formData, "marital_status"),
    email: text(formData, "email"),
    referral_source: text(formData, "referral_source"),
  };
}

export function isCompletePatientForm(
  fields: ReturnType<typeof parsePatientForm>,
) {
  return Boolean(
    fields.first_name &&
      fields.last_name &&
      fields.dob &&
      fields.phone &&
      fields.gender,
  );
}

export function parseCaseForm(formData: FormData) {
  return {
    is_pregnant: checkbox(formData, "is_pregnant"),
    smoker: checkbox(formData, "smoker"),
    athletic: checkbox(formData, "athletic"),
    alcoholic: checkbox(formData, "alcoholic"),
    has_diet_plan: checkbox(formData, "has_diet_plan"),
    has_prior_contract: checkbox(formData, "has_prior_contract"),
    came_from: text(formData, "came_from"),
    fasting_since: text(formData, "fasting_since"),
    drugs_used: text(formData, "drugs_used"),
    doctor_advice: text(formData, "doctor_advice"),
    referring_doctor: text(formData, "referring_doctor"),
    payment_status: (formData.get("payment_status") as string) || null,
    payment_method: (formData.get("payment_method") as string) || null,
  };
}

export const TEST_REQUIRED_ERROR = "Name and a valid price are required";

export function parseTestForm(formData: FormData) {
  const priceRaw = formData.get("price") as string;
  const price = priceRaw ? Number(priceRaw) : NaN;

  return {
    name: requiredText(formData, "name"),
    price,
    priceRaw,
    code: text(formData, "code"),
    specimen_type: text(formData, "specimen_type"),
    unit: text(formData, "unit"),
    active: checkbox(formData, "active"),
  };
}

export function isCompleteTestForm(fields: ReturnType<typeof parseTestForm>) {
  return Boolean(fields.name && fields.priceRaw && !Number.isNaN(fields.price));
}

/* ------------------------------------------------------------------ *
 * Sampler board
 * ------------------------------------------------------------------ */

/**
 * Group the sampler board's cases and derive each one's status label.
 *
 * A case whose tests are *all* sampled stays visible for
 * `SAMPLED_CASE_VISIBLE_MS` after its last sample, then drops off — so the
 * sampler gets a moment to see their work land before it disappears.
 */
export function filterRecentlySampledCases(
  cases: SamplerBoardCase[],
  now: number = Date.now(),
): SamplerCaseGroup[] {
  return cases
    .map((c) => {
      const tests = c.test_orders;
      const allSampled = tests.every((t) => t.status === "sampled");
      const noneSampled = tests.every((t) => t.status === "ordered");
      const label = noneSampled ? "ordered" : allSampled ? "sampled" : "sampling";
      const lastSampledAt = allSampled
        ? tests.reduce<string | null>((latest, t) => {
            if (!t.sampled_at) return latest;
            return !latest || t.sampled_at > latest ? t.sampled_at : latest;
          }, null)
        : null;
      return { case: c, tests, label, lastSampledAt } satisfies SamplerCaseGroup;
    })
    .filter(({ label, lastSampledAt }) => {
      if (label !== "sampled" || !lastSampledAt) return true;
      return now - new Date(lastSampledAt).getTime() <= SAMPLED_CASE_VISIBLE_MS;
    });
}
