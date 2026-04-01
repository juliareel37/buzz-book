import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { getEffectiveDrinkTime } from "@/lib/drink-entry";
import {
  drinkEntries,
  type NewDrinkEntry,
  type NewUserProfile,
  userProfiles,
} from "@/db/schema";

function requireDb() {
  if (!db) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return db;
}

export async function getUserProfileByClerkId(clerkUserId: string) {
  const database = requireDb();

  const [profile] = await database
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.clerkUserId, clerkUserId))
    .limit(1);

  return profile ?? null;
}

export async function createUserProfile(profile: NewUserProfile) {
  const database = requireDb();

  const [createdProfile] = await database
    .insert(userProfiles)
    .values(profile)
    .returning();

  return createdProfile;
}

export async function updateUserProfile(
  clerkUserId: string,
  updates: Pick<
    NewUserProfile,
    "sex" | "heightInInches" | "weightInPounds" | "metabolicEfficiency"
  >,
) {
  const database = requireDb();

  const [updatedProfile] = await database
    .update(userProfiles)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(userProfiles.clerkUserId, clerkUserId))
    .returning();

  return updatedProfile ?? null;
}

export async function createDrinkEntry(entry: NewDrinkEntry) {
  const database = requireDb();

  const [createdEntry] = await database
    .insert(drinkEntries)
    .values(entry)
    .returning();

  return createdEntry;
}

export async function getDrinkSummaryForClerkUser(
  clerkUserId: string,
  rangeStart: Date,
) {
  const database = requireDb();

  const entries = await database
    .select({
      id: drinkEntries.id,
      consumedAt: drinkEntries.consumedAt,
      loggedAt: drinkEntries.loggedAt,
    })
    .from(drinkEntries)
    .where(eq(drinkEntries.clerkUserId, clerkUserId));

  const relevantEntries = entries
    .filter((entry) => getEffectiveDrinkTime(entry) >= rangeStart)
    .sort(
      (a, b) => getEffectiveDrinkTime(b).getTime() - getEffectiveDrinkTime(a).getTime(),
    );

  return {
    drinksTonight: relevantEntries.length,
    lastDrinkAt: relevantEntries[0] ? getEffectiveDrinkTime(relevantEntries[0]) : null,
  };
}

export async function getDrinkEntriesForClerkUser(clerkUserId: string) {
  const database = requireDb();

  const entries = await database
    .select()
    .from(drinkEntries)
    .where(eq(drinkEntries.clerkUserId, clerkUserId));

  return entries.sort(
    (a, b) => getEffectiveDrinkTime(b).getTime() - getEffectiveDrinkTime(a).getTime(),
  );
}

export async function deleteDrinkEntryForClerkUser(
  id: string,
  clerkUserId: string,
) {
  const database = requireDb();

  const [deletedEntry] = await database
    .delete(drinkEntries)
    .where(and(eq(drinkEntries.id, id), eq(drinkEntries.clerkUserId, clerkUserId)))
    .returning();

  return deletedEntry ?? null;
}
