# Clinical Pathology Lab — Project Spec

> This is the single source of truth for the project. Read it at the start of every
> session. When a phase or task is completed, tick its checkbox so the "what's done
> vs what's left" picture stays accurate.

---

## 1. What this is

A web application for a clinical pathology laboratory. Patients walk in, a receptionist
registers them and records their case, samples are drawn and processed, a pathologist
approves the results, and the approved report is delivered to the patient (printed or
emailed as a PDF).

This is a first real client project. Scope is deliberately kept tight: build the core
loop well, defer everything non-essential.

### Tech stack
- **Frontend:** Next.js (App Router) + Tailwind CSS
- **Backend:** Supabase (Postgres + Auth + Row Level Security + Edge Functions later)
- **Supabase management:** via Supabase MCP server (connected through Claude Code) —
  use its tools (`apply_migration`, `execute_sql`, `get_advisors`, `list_tables`, etc.)
  for schema changes, RLS policies, and inspection, instead of manually pasting SQL
  into the dashboard SQL Editor.
- **PDF:** `@react-pdf/renderer`
- **Email:** Resend (test mode during dev, verified client domain at go-live)
- **Hosting:** Vercel

---

## 1a. Folder architecture (agreed — follow this for every new file)

Routes are split by role as **plain folders** (not Next.js route groups) so the role
shows in the URL and two roles can never accidentally collide on the same path:

```
app/
├── receptionist/           # routes under /receptionist/...
│   └── layout.tsx          # role-gate: redirect if profile.role !== "receptionist" | "pathologist"
├── sampler/                # routes under /sampler/...
├── chemist/                # routes under /chemist/...
├── pathologist/            # routes under /pathologist/... (dashboard, staff, catalog, approvals)
├── login/                  # role-agnostic
├── _components/
│   ├── ui/                 # generic primitives: Button, Input, Table, Modal
│   ├── shared/              # cross-role domain components, e.g. TestOrderStatusBadge
│   ├── receptionist/        # role-specific components (includes patient forms/search)
│   ├── sampler/
│   ├── chemist/
│   └── pathologist/         # includes dashboard components
├── _lib/
│   ├── supabase/
│   │   ├── client.ts        # browser client, anon key
│   │   └── server.ts        # server components/actions, cookie-based auth
│   ├── data/                 # plain functions wrapping Supabase queries, e.g. patients.ts, cases.ts,
│   │                         # test-orders.ts — no "use server", no form/React knowledge, reusable anywhere
│   ├── actions/               # "use server" wrappers, one file per domain, colocated with data/ —
│   │                         # do auth/role checks, call data/ functions, revalidatePath/redirect.
│   │                         # service_role-key code (add-staff) lives here, never in the browser.
│   ├── types/
│   │   ├── database.types.ts # Supabase-generated
│   │   └── domain.ts         # hand-written app types
│   └── helpers.ts            # one-off pure helpers (formatting, calc)
└── _styles/globals.css
```

**Placement rule of thumb:**
| Kind of code | Goes in |
|---|---|
| Page/route UI for a specific role | `app/<role>/<feature>/page.tsx` |
| Layout/role-gate for a role's section | `app/<role>/layout.tsx` |
| Login/role-agnostic page | top-level `app/` (no role folder) |
| Generic UI primitive | `_components/ui/` |
| Component used by one role only | `_components/<role>/` |
| Component used by 2+ roles | `_components/shared/` |
| Raw Supabase query/mutation | `_lib/data/<entity>.ts` |
| Form/button handler, revalidation, service_role usage | `_lib/actions/<entity>.ts` |
| Supabase client setup | `_lib/supabase/client.ts` or `server.ts` |
| TS types (domain or generated) | `_lib/types/` |

If a piece of new code doesn't clearly fit one of these, ask rather than guess.

---

## 2. The core idea (read this first)

**Everything funnels through the `test_orders` table.** Each row is one test in one case,
and its `status` column is the heart of the whole system:

```
ordered → sampled → processed → approved
```

Every role acts on this status as the test moves along. The pathologist's dashboard is
just a view over these statuses. The rule "patient can't see results until approved" is
one status gate. Get `test_orders` right and the rest follows.

---

## 3. User roles

There are **four staff roles**. All of them log in. Patients do **not** log in — they are
pure data records managed by the receptionist.

| Role | What they do |
|------|--------------|
| **receptionist** | Creates patients, searches by phone, creates cases (questionnaire), orders tests, prints/hands over reports |
| **sampler** | Sees cases needing sampling, marks each test `sampled` |
| **chemist** | Sees `sampled` tests, enters results → `processed` |
| **pathologist** (admin) | Approves results, has the dashboard, adds staff, manages the test catalog. Can do everything above. |

---

## 4. Data model

Relationships:
- one **profile** creates many patients and many cases
- one **patient** has many cases
- one **case** contains many test_orders
- one **test_catalog** entry is ordered as many test_orders, and defines many reference_ranges

### `profiles` — staff who log in
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| auth_user_id | uuid FK → auth.users | links to Supabase Auth |
| full_name | text | |
| role | text | `receptionist` \| `sampler` \| `chemist` \| `pathologist` |
| created_at | timestamptz | |

### `patients` — no login, data only
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| first_name | text | **required** |
| last_name | text | **required** |
| dob | date | **required** (used later for age-based reference ranges) |
| phone | text | **required** — primary lookup |
| gender | text | **required** |
| residence | text | where they live |
| marital_status | text | |
| email | text | optional — if present, report can be emailed |
| referral_source | text | "from where do you hear us" |
| created_by | uuid FK → profiles | |
| created_at | timestamptz | |

### `cases` — one per visit, holds the questionnaire
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| patient_id | uuid FK → patients | |
| created_by | uuid FK → profiles | |
| is_pregnant | bool | |
| came_from | text | "where do you come from" — rest vs active travel, for approval context |
| fasting_since | text | "last time you eat" |
| drugs_used | text | |
| smoker | bool | |
| athletic | bool | |
| alcoholic | bool | |
| has_diet_plan | bool | |
| doctor_advice | text | |
| referring_doctor | text | if another doctor referred the patient |
| has_prior_contract | bool | prior contract between patient and lab |
| payment_status | text | `not_paid` \| `full` \| `deposit` \| `repeated` |
| payment_method | text | `cash` \| `credit_card` \| `debit_card` |
| report_sent_at | timestamptz | **NULL = not sent.** Set when doctor sends report. Drives `reported` status. |
| created_at | timestamptz | |

> **case_status is NOT a stored column.** See §6.

### `test_catalog` — master list of offered tests (pathologist manages)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| code | text | short code |
| name | text | |
| specimen_type | text | blood, urine, etc. |
| price | numeric | |
| unit | text | result unit |
| active | bool | can be ordered |
| created_at | timestamptz | |

> Client has not provided the real test list yet. The pathologist admin screen (Phase 3)
> lets them add tests, which unblocks development.

### `test_orders` — THE HEART. One row per test in a case.
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| case_id | uuid FK → cases | |
| test_id | uuid FK → test_catalog | |
| status | text | `ordered` \| `sampled` \| `processed` \| `approved` |
| result_value | numeric | NULL until processed. One value per test (v1). |
| result_unit | text | |
| result_flag | text | `normal` \| `high` \| `low` — **deferred**, NULL for v1 |
| is_repeat | bool | default false — no-charge redo (see §5) |
| repeat_reason | text | |
| price_snapshot | numeric | price captured at order time |
| sampled_by | uuid FK → profiles | **NULL until sampled** |
| sampled_at | timestamptz | |
| processed_by | uuid FK → profiles | **NULL until processed** |
| processed_at | timestamptz | |
| approved_by | uuid FK → profiles | **NULL until approved** |
| approved_at | timestamptz | |
| created_at | timestamptz | |

> One sample per test → sample tracking lives here on the order. No separate samples table.
> The `*_by` columns are nullable and fill in as each stage happens — NULL means "not
> reached that stage yet."

### `reference_ranges` — DEFERRED (plan only, do not build in v1)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| test_id | uuid FK → test_catalog | |
| sex | text | |
| age_min | int | |
| age_max | int | |
| condition | text | `normal` \| `pregnant` \| ... |
| low | numeric | |
| high | numeric | |

> Separate table (not columns on test_catalog) because one test has **many** valid ranges
> that vary by sex, age band, and pregnancy — an unknown number, decided by data not schema.
> Inputs needed (dob → age, gender, is_pregnant) are already collected. Build later.

---

## 5. Per-test state machine

```
ordered ──► sampled ──► processed ──► approved
(recep.)    (sampler)   (chemist)     (pathologist)
   ▲                                      │
   └──────────────────────────────────────┘
        repeat: new sample drawn, no new charge (is_repeat = true)
```

- Each forward arrow = one role's action, which also stamps that role's id into the
  matching `*_by` column and moves `status` forward.
- **Repeat loop:** a `processed` or `approved` test can be sent back to `ordered` with
  `is_repeat = true`. Used when a test fails (e.g. sample degraded, result rejected). It
  goes back to `ordered` because a repeat needs a fresh sample. **Payment is untouched —
  no new charge.**
- `approved` is the visibility gate: only then can the receptionist release/print, and only
  then does it count toward triggering the report email.

---

## 6. Case-level status (computed, not stored)

The dashboard shows four case states, but **only one is stored.** Compute the rest from the
test_orders in the case:

| Case status | How it's determined |
|-------------|---------------------|
| `open` | all tests still `ordered` |
| `in_progress` | some tests past ordered, but not all approved |
| `awaiting_approval` | all tests `approved`, report not sent yet |
| `reported` | `report_sent_at` is set |

**Store only `report_sent_at`** (the one bit the tests can't tell you). Compute the other
three on the fly (a DB view or query). This avoids the drift you'd get from manually keeping
a case_status column in sync every time a test changes.

---

## 7. Email / report delivery

- **Provider:** Resend. Free tier is far more than a single lab needs. No cost for sending.
- **Trigger:** doctor-controlled. A "Send report" button, enabled **only when every test in
  the case is `approved`.**
- **Content:** ONE combined PDF with all results for the case.
- **On success:** set `report_sent_at` → case becomes `reported`.
- **Dev (now):** Resend test mode — `from` must be `onboarding@resend.dev`, `to` must be your
  own Resend signup email. No domain, no cost. Build and test entirely against your own inbox.
- **Go-live:** client buys a domain (~$12/yr, their expense; client currently has none),
  verify it in Resend (DNS records: SPF/DKIM/DMARC), change the one `from` line → can send to
  real patients.
- Same PDF component powers both the receptionist's print/download and the email attachment.

---

## 8. Security / RLS (enforce in the database, not just the UI)

RLS policies must live in Postgres so rules can't be bypassed through the API.

- Use a `get_my_role()` helper to keep policies clean.
- Apply RLS changes via the Supabase MCP's `apply_migration` tool, and run
  `get_advisors` (security) afterward to catch missing/misconfigured policies.
- Each staff role can only make its own transition:
  - receptionist → writes patients/cases, moves nothing past `ordered`
  - sampler → `ordered → sampled` only
  - chemist → `sampled → processed` only (enters result)
  - pathologist → `processed → approved`, and the repeat reset; full access
- Test the policies directly in SQL (e.g. confirm a receptionist **cannot** approve).

### Two secret-key rules (never ship these to the browser)
1. **Supabase `service_role` key** — god mode, bypasses RLS. Server-only. Needed for creating
   staff logins.
2. **Resend API key** — server-only. Needed for sending email.

The browser only ever uses the **anon key** (limited, safe, guarded by RLS).

---

## 9. Gotchas / important facts

- **First admin is seeded by hand.** The first pathologist is created manually in the Supabase
  dashboard (insert auth user + a `profiles` row with role `pathologist`). Chicken-and-egg:
  nothing else can create it.
- **Add-staff is a special screen.** Creating a login writes to the protected `auth.users`
  table and needs the `service_role` key → it runs as a Next.js **server action** (`"use server"`),
  not a normal browser-side DB write. Every *other* form (patient, case) is a normal write using
  the anon key + RLS.
- **Don't freeze data irreversibly.** Edit/correction handling is deferred, but store results as
  data you *could* update later — don't add hard DB constraints that make "approved = permanently
  frozen." Keeps the door open to add editing without a migration.
- **Critical values (future):** some results are life-threatening and shouldn't wait quietly for
  approval/pickup. Real labs flag these for immediate contact. Parked for now.

---

## 10. Deferred / out of scope for v1

- Reference ranges + normal/high/low result flags (table planned, not built)
- Edit / amendment / correction UI and history
- Delivery tracking (emailed vs printed vs handed over)
- Critical-value flagging
- The client's real test list (use the admin screen meanwhile)
- Privacy/legal review — **required before real patients use it live**, not a build blocker
- Standard concerns handled as they come: search, timestamps, validation, deployment

---

## 11. Build checklist

Build strictly top to bottom. Each phase ends with something you can see working.

### Phase 0 — Setup
- [x] Create Next.js (App Router) project + Tailwind
- [x] Create Supabase project
- [x] Install Supabase client; put project URL + anon key in `.env.local`
- [x] One throwaway query to confirm the connection
- **Done when:** app runs and reaches the database. ✅ Done.

### Phase 1 — Login + roles
- [x] Manually seed the first pathologist in the Supabase dashboard
- [x] Create `profiles` table
- [x] Build the login page
- [x] `proxy.ts` — refreshes the Supabase session on each request (uses `createServerClient` from `@supabase/ssr`; named `proxy.ts` per Next.js 16's renamed convention, formerly `middleware.ts`)
- [x] Route protection (not logged in → login page)
- [x] `get_my_role()` helper
- [x] Placeholder page printing "logged in as: <role>"
- [x] Sign out button (server action, clears session, redirects to `/login`)
- **Done when:** login works and the app knows who + what role. ✅ Done.

### Phase 2 — Schema + RLS
- [x] Create `patients`, `cases`, `test_catalog`, `test_orders`
- [x] Write RLS policies per role
- [x] Test policies in SQL (e.g. receptionist cannot approve)
- **Done when:** the database enforces the rules by itself. ✅ Done.

### Phase 3 — Test catalog admin (pathologist)
- [x] Screen to add + list tests (name, code, specimen, price, unit)
- [x] Edit a test (including active/inactive toggle)
- [x] Delete a test (blocked with a friendly message if it's already been ordered)
- **Done when:** tests can be put in the system (unblocks ordering). ✅ Done.

### Phase 3.5 — Staff admin (pathologist)
- [x] Screen for pathologist to add a new staff login (name, role, email, password)
- [x] Server action using the Supabase secret key (`auth.admin.createUser` + insert `profiles` row)
- [x] List existing staff
- [x] Pathologist home page nav buttons to Test Catalog and Staff
- **Done when:** pathologist can create receptionist/sampler/chemist logins from the UI
      (unblocks testing Phases 4-6 with real accounts instead of manually seeded ones). ✅ Done.

### Phase 4 — Receptionist flow (the spine)
- [x] Create a patient
- [x] Search patients by phone
- [x] Edit a patient
- [x] Delete a patient (blocked with a friendly message if they have existing cases)
- [x] Enforce unique patient phone numbers (DB constraint + friendly error on conflict)
- [x] Create a case with the questionnaire
- [x] Order tests from the catalog (folded into case creation — at least one test required)
- [x] List all cases, paginated, with a patient-phone filter
- [x] Show a patient's case history on their detail page
- [x] Edit a case (questionnaire + which tests are ordered) — only while every test on the
      case is still `ordered`; locked once sampling starts
- [x] Delete a case — same "still `ordered`" guard as edit, enforced via RLS
- **Done when:** a complete case sits in the system, ready to move. ✅ Done.

### Phase 5 — Sampler
- [x] List tests waiting to be sampled, grouped by case/patient (`/sampler`)
- [x] Mark a test `sampled`
- [x] Case status badge (`ordered` / `sampling` / `sampled`); fully-sampled cases stay
      listed for 3 minutes, then drop off on next refresh (manual/action-triggered, no
      auto-polling)
- **Done when:** tests advance to the second stage. ✅ Done.

### Phase 6 — Chemist
- [ ] List `sampled` tests
- [ ] Enter a result → `processed`
- **Done when:** results enter the system.

### Phase 7 — Pathologist approval + dashboard
- [ ] List `processed` tests and approve them
- [ ] Dashboard (compute open / in_progress / awaiting_approval from test statuses)
- **Done when:** the whole pipeline works end to end — walk-in to approved. **Big milestone.**

### Phase 8 — PDF report
- [ ] Report as a `@react-pdf/renderer` component (lab header placeholder, patient info,
      results table, approving doctor, date)
- [ ] Receptionist can print/download
- **Done when:** a real printable report exists.

### Phase 9 — Email (Resend, test mode)
- [ ] Send a plain email to your own inbox
- [ ] Attach the combined PDF
- [ ] "Send report" button, enabled only when all case tests are `approved`
- [ ] On success set `report_sent_at` → case `reported`
- **Done when:** automated delivery works, free, to your own inbox.

### Phase 10 — Go live
- [ ] Client buys domain; verify in Resend; change the one `from` line
- [ ] Deploy to Vercel
- **Done when:** real patients receive real reports.

---

## 12. Working notes

- Don't jump ahead — the exciting parts (dashboard, PDF) depend on data that only exists once
  the spine is built.
- Phase 7 is the "it works!" moment. If lost mid-build, the goal is simply: get one test to
  `approved`.
- Keep secrets server-side. Two worlds: browser = visible to users, server = safe for secrets.
