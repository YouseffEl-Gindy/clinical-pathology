"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getMyProfile } from "@/app/_lib/data/profiles";
import {
  createPatient,
  updatePatient,
  deletePatient,
} from "@/app/_lib/data/patients";
import { redirectWithError, requireRole } from "@/app/_lib/actions/guards";
import {
  PATIENT_REQUIRED_ERROR,
  isCompletePatientForm,
  parsePatientForm,
  pgErrorMessage,
} from "@/app/_lib/helpers";
import { RECEPTION_ROLES } from "@/app/_lib/constants";

const DUPLICATE_PHONE = "A patient with this phone number already exists.";

export async function addPatient(formData: FormData) {
  const supabase = await requireRole(
    RECEPTION_ROLES,
    "/receptionist/patients/new"
  );

  const fields = parsePatientForm(formData);
  if (!isCompletePatientForm(fields)) {
    redirectWithError("/receptionist/patients/new", PATIENT_REQUIRED_ERROR);
  }

  let patient;
  try {
    const profile = await getMyProfile(supabase);
    patient = await createPatient(supabase, {
      ...fields,
      created_by: profile.id,
    });
  } catch (err) {
    redirectWithError(
      "/receptionist/patients/new",
      pgErrorMessage(err, "Failed to register patient", {
        "23505": DUPLICATE_PHONE,
      })
    );
  }

  revalidatePath("/receptionist/patients/new");
  redirect(`/receptionist/patients/${patient.id}`);
}

export async function editPatient(formData: FormData) {
  const id = formData.get("id") as string;
  const returnPath = `/receptionist/patients/${id}/edit`;
  const supabase = await requireRole(RECEPTION_ROLES, returnPath);

  const fields = parsePatientForm(formData);
  if (!isCompletePatientForm(fields)) {
    redirectWithError(returnPath, PATIENT_REQUIRED_ERROR);
  }

  try {
    await updatePatient(supabase, id, fields);
  } catch (err) {
    redirectWithError(
      returnPath,
      pgErrorMessage(err, "Failed to update patient", {
        "23505": DUPLICATE_PHONE,
      })
    );
  }

  revalidatePath("/receptionist/patients");
  redirect(`/receptionist/patients/${id}`);
}

export async function deletePatientAction(formData: FormData) {
  const supabase = await requireRole(RECEPTION_ROLES, "/receptionist/patients");

  const id = formData.get("id") as string;

  try {
    await deletePatient(supabase, id);
  } catch (err) {
    redirectWithError(
      "/receptionist/patients",
      pgErrorMessage(err, "Failed to delete patient", {
        "23503": "This patient has existing cases and can't be deleted.",
      })
    );
  }

  revalidatePath("/receptionist/patients");
  redirect("/receptionist/patients");
}
