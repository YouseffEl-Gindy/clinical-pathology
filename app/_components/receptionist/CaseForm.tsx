import Link from "next/link";
import { SubmitButton } from "@/app/_components/ui/SubmitButton";
import { CARD_CLASS } from "@/app/_components/ui/Card";
import {
  CheckboxField,
  SelectField,
  TextField,
} from "@/app/_components/ui/FormField";
import { Checkbox } from "@/app/_components/ui/Input";
import type { Tables } from "@/app/_lib/types/database.types";

const PAYMENT_STATUSES = [
  { value: "not_paid", label: "Not paid" },
  { value: "full", label: "Full" },
  { value: "deposit", label: "Deposit" },
  { value: "repeated", label: "Repeated" },
];

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "credit_card", label: "Credit card" },
  { value: "debit_card", label: "Debit card" },
];

const LIFESTYLE_CHECKBOXES = [
  { name: "is_pregnant", label: "Pregnant" },
  { name: "smoker", label: "Smoker" },
  { name: "athletic", label: "Athletic" },
  { name: "alcoholic", label: "Alcoholic" },
  { name: "has_diet_plan", label: "Has diet plan" },
  { name: "has_prior_contract", label: "Has prior contract" },
] as const;

/**
 * The case questionnaire plus test picker, shared by create and edit.
 *
 * Passing `caseRecord` switches the form into edit mode; otherwise `patientId`
 * identifies the patient the new case is being opened for.
 */
export function CaseForm({
  caseRecord,
  patientId,
  tests,
  currentTestIds = [],
  action,
}: {
  caseRecord?: Tables<"cases">;
  patientId?: string;
  tests: Tables<"test_catalog">[];
  currentTestIds?: string[];
  action: (formData: FormData) => void | Promise<void>;
}) {
  const isEdit = caseRecord !== undefined;

  return (
    <form action={action} className={`grid grid-cols-2 gap-4 ${CARD_CLASS}`}>
      {isEdit ? (
        <input type="hidden" name="id" value={caseRecord.id} />
      ) : (
        <input type="hidden" name="patient_id" value={patientId} />
      )}

      <TextField
        label="Where do you come from"
        name="came_from"
        type="text"
        fieldClassName="col-span-2"
        defaultValue={caseRecord?.came_from ?? ""}
      />
      <TextField
        label="Last time you ate"
        name="fasting_since"
        type="text"
        defaultValue={caseRecord?.fasting_since ?? ""}
      />
      <TextField
        label="Drugs used"
        name="drugs_used"
        type="text"
        defaultValue={caseRecord?.drugs_used ?? ""}
      />
      <TextField
        label="Doctor advice"
        name="doctor_advice"
        type="text"
        fieldClassName="col-span-2"
        defaultValue={caseRecord?.doctor_advice ?? ""}
      />
      <TextField
        label="Referring doctor"
        name="referring_doctor"
        type="text"
        defaultValue={caseRecord?.referring_doctor ?? ""}
      />

      <SelectField
        label="Payment status"
        name="payment_status"
        defaultValue={caseRecord?.payment_status ?? ""}
      >
        <option value="">Select...</option>
        {PAYMENT_STATUSES.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Payment method"
        name="payment_method"
        defaultValue={caseRecord?.payment_method ?? ""}
      >
        <option value="">Select...</option>
        {PAYMENT_METHODS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </SelectField>

      <div className="col-span-2 grid grid-cols-3 gap-3">
        {LIFESTYLE_CHECKBOXES.map(({ name, label }) => (
          <CheckboxField
            key={name}
            name={name}
            label={label}
            defaultChecked={caseRecord?.[name] ?? false}
          />
        ))}
      </div>

      <div className="col-span-2 space-y-2">
        <p className="text-sm font-medium">Tests to order</p>
        <div className="grid grid-cols-2 gap-2 rounded border border-gray-200 p-3">
          {tests.map((test) => (
            <label key={test.id} className="flex items-center gap-2 text-sm">
              <Checkbox
                name="test_ids"
                value={test.id}
                defaultChecked={currentTestIds.includes(test.id)}
              />
              {test.name} {test.price != null ? `(${test.price})` : ""}
            </label>
          ))}
          {tests.length === 0 && (
            <p className="text-sm text-gray-500">
              No active tests in the catalog.
            </p>
          )}
        </div>
      </div>

      <SubmitButton className="col-span-2">
        {isEdit ? "Save changes" : "Create case"}
      </SubmitButton>

      {isEdit && (
        <Link
          href={`/receptionist/cases/${caseRecord.id}`}
          className="col-span-2 text-center text-sm text-gray-500 hover:underline"
        >
          Cancel
        </Link>
      )}
    </form>
  );
}
