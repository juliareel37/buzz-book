import Link from "next/link";
import type { CSSProperties } from "react";
import {
  formatMetabolicEfficiencyLabel,
  formatSexLabel,
} from "@/lib/profile-form";
import { requireCurrentUserProfile } from "@/lib/profile";

function getMetabolismVisuals(
  metabolicEfficiency: "lightweight" | "average" | "efficient",
) {
  if (metabolicEfficiency === "lightweight") {
    return {
      progress: 32,
      description:
        "BAC estimation uses a lighter metabolism setting, so alcohol effects are expected to linger longer.",
    };
  }

  if (metabolicEfficiency === "efficient") {
    return {
      progress: 82,
      description:
        "BAC estimation uses a higher metabolism setting, so alcohol is expected to clear a bit faster.",
    };
  }

  return {
    progress: 58,
    description:
      "BAC estimation uses a balanced metabolism setting based on the profile details you’ve provided.",
  };
}

export default async function SettingsPage() {
  const profile = await requireCurrentUserProfile();
  const metabolism = getMetabolismVisuals(profile.metabolicEfficiency);

  return (
    <section className="settings-screen">
      <div className="settings-copy settings-section-header settings-section-header-split settings-copy-spacious profile-dashboard-header">
        <h1>Metabolic Profile</h1>
        <Link href="/settings/edit" className="profile-edit-link">
          <span>Edit</span>
        </Link>
      </div>

      <section className="profile-dashboard-grid">
        <article className="profile-feature-card">
          <p className="profile-feature-label">Weight</p>
          <strong className="profile-feature-value">
            {Number(profile.weightInPounds)}
            <span className="profile-feature-unit">lbs</span>
          </strong>
        </article>

        <article className="profile-feature-card">
          <p className="profile-feature-label">Sex</p>
          <strong className="profile-feature-value profile-feature-value-text">
            {formatSexLabel(profile.sex)}
          </strong>
        </article>

        <article className="profile-feature-card profile-feature-card-full metabolism-feature-card">
          <div className="metabolism-card-header">
            <div>
              <p className="profile-feature-label">Metabolism Rate</p>
              <strong className="profile-feature-value profile-feature-value-text metabolism-feature-value">
                {formatMetabolicEfficiencyLabel(profile.metabolicEfficiency)}
              </strong>
            </div>
            <span className="metabolism-card-icon" aria-hidden="true" />
          </div>
          <div className="metabolism-progress" aria-hidden="true">
            <span
              className="metabolism-progress-bar"
              style={{ "--progress": `${metabolism.progress}%` } as CSSProperties}
            />
          </div>
          <p className="metabolism-description">{metabolism.description}</p>
        </article>
      </section>
    </section>
  );
}
