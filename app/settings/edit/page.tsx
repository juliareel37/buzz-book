import Link from "next/link";
import { ProfileForm } from "@/components/profile-form";
import { requireCurrentUserProfile } from "@/lib/profile";
import { updateProfile } from "../actions";

export default async function EditSettingsPage() {
  const profile = await requireCurrentUserProfile();

  return (
    <section className="settings-screen">
      <div className="settings-copy settings-section-header settings-copy-spacious">
        <Link href="/settings" className="back-link back-link-icon-only" aria-label="Back">
          <span aria-hidden="true">←</span>
        </Link>
        <h1>Update Profile</h1>
      </div>

      <ProfileForm
        action={updateProfile}
        submitLabel="Save Changes"
        defaults={{
          sex: profile.sex,
          weightInPounds: Number(profile.weightInPounds),
          metabolicEfficiency: profile.metabolicEfficiency,
        }}
      />
    </section>
  );
}
