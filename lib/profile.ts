import { auth } from "@clerk/nextjs/server";
import { hasDatabaseUrl } from "@/db";
import { getUserProfileByClerkId } from "@/db/queries";
import { redirect } from "next/navigation";

export async function requireClerkUserId() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return userId;
}

export async function getCurrentUserProfile() {
  if (!hasDatabaseUrl) {
    return null;
  }

  const userId = await requireClerkUserId();
  return getUserProfileByClerkId(userId);
}

export async function requireCurrentUserProfile() {
  const userId = await requireClerkUserId();

  if (!hasDatabaseUrl) {
    redirect("/onboarding?setup=db");
  }

  const profile = await getUserProfileByClerkId(userId);

  if (!profile) {
    redirect("/onboarding");
  }

  return profile;
}
