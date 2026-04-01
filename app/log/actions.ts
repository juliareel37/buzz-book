"use server";

import { createDrinkEntry } from "@/db/queries";
import { requireCurrentUserProfile } from "@/lib/profile";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function parsePositiveNumber(value: FormDataEntryValue | null) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error("Expected a positive number.");
  }

  return parsed;
}

function parseConsumedAt(formData: FormData) {
  const timeMode = String(formData.get("consumptionTimeMode") ?? "now");
  const consumedAtIso = String(formData.get("consumedAtIso") ?? "");

  if (timeMode !== "manual" || !consumedAtIso) {
    return new Date();
  }

  const consumedAt = new Date(consumedAtIso);

  if (Number.isNaN(consumedAt.getTime())) {
    return new Date();
  }

  return consumedAt;
}

export async function logDrink(formData: FormData) {
  const profile = await requireCurrentUserProfile();
  const drinkType = String(formData.get("drinkType"));
  const customDrinkName = String(formData.get("customDrinkName") ?? "").trim();
  const servingSizeOz = parsePositiveNumber(formData.get("servingSizeOz"));
  const abvPercent = parsePositiveNumber(formData.get("abvPercent"));
  const consumedAt = parseConsumedAt(formData);

  await createDrinkEntry({
    clerkUserId: profile.clerkUserId,
    drinkType:
      drinkType === "custom_mix"
        ? "custom_mix"
        : (drinkType as "beer" | "wine" | "liquor" | "cocktail"),
    customDrinkName: customDrinkName || null,
    servingSizeOz: String(servingSizeOz),
    abvPercent: String(abvPercent),
    consumedAt,
    loggedAt: new Date(),
  });

  revalidatePath("/");
  revalidatePath("/log");
  redirect("/");
}
