import { hasDatabaseUrl } from "@/db";
import { ProfileForm } from "@/components/profile-form";
import { getCurrentUserProfile } from "@/lib/profile";
import { completeOnboarding } from "./actions";
import { redirect } from "next/navigation";

type OnboardingPageProps = {
  searchParams: Promise<{
    setup?: string;
  }>;
};

export default async function OnboardingPage({
  searchParams,
}: OnboardingPageProps) {
  const params = await searchParams;
  const profile = await getCurrentUserProfile();

  if (profile) {
    redirect("/");
  }

  return (
    <section className="onboarding-screen">
      <div className="onboarding-copy">
        {/* <p className="eyebrow">Profile Setup</p> */}
        <h1>Let&apos;s tune Buzz Book to your body.</h1>
        <p>
          We&apos;ll use this to calculate future BAC estimates.
        </p>
      </div>

      {!hasDatabaseUrl || params.setup === "db" ? (
        <section className="setup-card">
          <p className="slider-card-label">Database Setup Needed</p>
          <p>
            Add your Neon `DATABASE_URL` to `.env.local`, then run `npm run
            db:push` so we can store profiles and drink logs.
          </p>
        </section>
      ) : null}

      <ProfileForm action={completeOnboarding} submitLabel="Save Profile" />
    </section>
  );
}
