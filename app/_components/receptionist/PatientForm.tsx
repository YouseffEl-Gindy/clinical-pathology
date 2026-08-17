import Link from "next/link";
import { Button } from "@/app/_components/ui/Button";
import { CARD_CLASS } from "@/app/_components/ui/Card";
import { SelectField, TextField } from "@/app/_components/ui/FormField";
import type { Tables } from "@/app/_lib/types/database.types";

/**
 * The patient questionnaire, shared by register and edit.
 *
 * Passing `patient` switches the form into edit mode: fields are pre-filled, a
 * hidden `id` is submitted, and a Cancel link back to the detail page appears.
 */
export function PatientForm({
  patient,
  action,
}: {
  patient?: Tables<"patients">;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const isEdit = patient !== undefined;

  return (
    <form action={action} className={`grid grid-cols-2 gap-4 ${CARD_CLASS}`}>
      {isEdit && <input type="hidden" name="id" value={patient.id} />}

      <TextField
        label="First name"
        name="first_name"
        type="text"
        required
        defaultValue={patient?.first_name}
      />
      <TextField
        label="Last name"
        name="last_name"
        type="text"
        required
        defaultValue={patient?.last_name}
      />
      <TextField
        label="Date of birth"
        name="dob"
        type="date"
        required
        defaultValue={patient?.dob}
      />
      <TextField
        label="Phone"
        name="phone"
        type="text"
        required
        defaultValue={patient?.phone}
      />

      <SelectField
        label="Gender"
        name="gender"
        required
        defaultValue={patient?.gender ?? ""}
      >
        {!isEdit && (
          <option value="" disabled>
            Select...
          </option>
        )}
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </SelectField>

      <TextField
        label="Marital status"
        name="marital_status"
        type="text"
        defaultValue={patient?.marital_status ?? ""}
      />
      <TextField
        label="Residence"
        name="residence"
        type="text"
        defaultValue={patient?.residence ?? ""}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        defaultValue={patient?.email ?? ""}
      />
      <TextField
        label="Referral source"
        name="referral_source"
        type="text"
        fieldClassName="col-span-2"
        defaultValue={patient?.referral_source ?? ""}
      />

      <Button className="col-span-2">
        {isEdit ? "Save changes" : "Register patient"}
      </Button>

      {isEdit && (
        <Link
          href={`/receptionist/patients/${patient.id}`}
          className="col-span-2 text-center text-sm text-gray-500 hover:underline"
        >
          Cancel
        </Link>
      )}
    </form>
  );
}
