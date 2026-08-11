"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/app/_lib/supabase/server";
import { getMyRole, getMyProfile } from "@/app/_lib/data/profiles";
import {
  createPatient,
  updatePatient,
  deletePatient,
} from "@/app/_lib/data/patients";

export async function addPatient(formData: FormData) {
  const supabase = await createClient();
  const role = await getMyRole(supabase);

  if (role !== "receptionist" && role !== "pathologist") {
    redirect("/receptionist/patients/new?error=Not authorized");
  }

  const first_name = (formData.get("first_name") as string)?.trim();
  const last_name = (formData.get("last_name") as string)?.trim();
  const dob = (formData.get("dob") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const gender = (formData.get("gender") as string)?.trim();

  if (!first_name || !last_name || !dob || !phone || !gender) {
    redirect(
      "/receptionist/patients/new?error=" +
        encodeURIComponent(
          "First name, last name, date of birth, phone, and gender are required"
        )
    );
  }

  const residence = (formData.get("residence") as string)?.trim() || null;
  const marital_status =
    (formData.get("marital_status") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const referral_source =
    (formData.get("referral_source") as string)?.trim() || null;

  let patient;
  try {
    const profile = await getMyProfile(supabase);

    patient = await createPatient(supabase, {
      first_name,
      last_name,
      dob,
      phone,
      gender,
      residence,
      marital_status,
      email,
      referral_source,
      created_by: profile.id,
    });
  } catch (err) {
    const pgError = err as { code?: string; message?: string };
    const message =
      pgError.code === "23505"
        ? "A patient with this phone number already exists."
        : pgError.message ?? "Failed to register patient";
    redirect("/receptionist/patients/new?error=" + encodeURIComponent(message));
  }

  revalidatePath("/receptionist/patients/new");
  redirect(`/receptionist/patients/${patient.id}`);
}

export async function editPatient(formData: FormData) {
  const supabase = await createClient();
  const role = await getMyRole(supabase);

  const id = formData.get("id") as string;

  if (role !== "receptionist" && role !== "pathologist") {
    redirect(`/receptionist/patients/${id}/edit?error=Not authorized`);
  }

  const first_name = (formData.get("first_name") as string)?.trim();
  const last_name = (formData.get("last_name") as string)?.trim();
  const dob = (formData.get("dob") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const gender = (formData.get("gender") as string)?.trim();

  if (!first_name || !last_name || !dob || !phone || !gender) {
    redirect(
      `/receptionist/patients/${id}/edit?error=` +
        encodeURIComponent(
          "First name, last name, date of birth, phone, and gender are required"
        )
    );
  }

  const residence = (formData.get("residence") as string)?.trim() || null;
  const marital_status =
    (formData.get("marital_status") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const referral_source =
    (formData.get("referral_source") as string)?.trim() || null;

  try {
    await updatePatient(supabase, id, {
      first_name,
      last_name,
      dob,
      phone,
      gender,
      residence,
      marital_status,
      email,
      referral_source,
    });
  } catch (err) {
    const pgError = err as { code?: string; message?: string };
    const message =
      pgError.code === "23505"
        ? "A patient with this phone number already exists."
        : pgError.message ?? "Failed to update patient";
    redirect(`/receptionist/patients/${id}/edit?error=` + encodeURIComponent(message));
  }

  revalidatePath("/receptionist/patients");
  redirect(`/receptionist/patients/${id}`);
}

export async function deletePatientAction(formData: FormData) {
  const supabase = await createClient();
  const role = await getMyRole(supabase);

  const id = formData.get("id") as string;

  if (role !== "receptionist" && role !== "pathologist") {
    redirect("/receptionist/patients?error=Not authorized");
  }

  try {
    await deletePatient(supabase, id);
  } catch (err) {
    const pgError = err as { code?: string; message?: string };
    const message =
      pgError.code === "23503"
        ? "This patient has existing cases and can't be deleted."
        : pgError.message ?? "Failed to delete patient";
    redirect("/receptionist/patients?error=" + encodeURIComponent(message));
  }

  revalidatePath("/receptionist/patients");
  redirect("/receptionist/patients");
}
