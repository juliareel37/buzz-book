"use server";

import { updateUserProfile } from "@/db/queries";
import { requireCurrentUserProfile } from "@/lib/profile";
import { getProfileValuesFromFormData } from "@/lib/profile-form";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const profile = await requireCurrentUserProfile();
  const values = getProfileValuesFromFormData(formData);

  await updateUserProfile(profile.clerkUserId, {
    sex: values.sex,
    heightInInches: String(profile.heightInInches),
    weightInPounds: String(values.weightInPounds),
    metabolicEfficiency: values.metabolicEfficiency,
  });

  revalidatePath("/");
  revalidatePath("/settings");
  redirect("/settings");
}
