"use server";

import { hasDatabaseUrl } from "@/db";
import { createUserProfile } from "@/db/queries";
import { requireClerkUserId } from "@/lib/profile";
import {
  getProfileValuesFromFormData,
  LEGACY_DEFAULT_HEIGHT_IN_INCHES,
} from "@/lib/profile-form";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function completeOnboarding(formData: FormData) {
  if (!hasDatabaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const clerkUserId = await requireClerkUserId();
  const values = getProfileValuesFromFormData(formData);

  await createUserProfile({
    clerkUserId,
    sex: values.sex,
    heightInInches: String(LEGACY_DEFAULT_HEIGHT_IN_INCHES),
    weightInPounds: String(values.weightInPounds),
    metabolicEfficiency: values.metabolicEfficiency,
  });

  revalidatePath("/");
  redirect("/");
}
