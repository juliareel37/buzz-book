"use server";

import { deleteDrinkEntryForClerkUser } from "@/db/queries";
import { requireCurrentUserProfile } from "@/lib/profile";
import { revalidatePath } from "next/cache";

export async function deleteDrinkEntryAction(formData: FormData) {
  const profile = await requireCurrentUserProfile();
  const drinkEntryId = String(formData.get("drinkEntryId") ?? "");

  if (!drinkEntryId) {
    throw new Error("Missing drink entry id.");
  }

  await deleteDrinkEntryForClerkUser(drinkEntryId, profile.clerkUserId);

  revalidatePath("/");
  revalidatePath("/trends");
}
