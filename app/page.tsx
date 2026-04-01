import { getDrinkEntriesForClerkUser, getDrinkSummaryForClerkUser } from "@/db/queries";
import { calculateCurrentBac, getBacProgressPercent } from "@/lib/bac";
import { getDrinkingDayStart } from "@/lib/drinking-day";
import { getEffectiveDrinkTime } from "@/lib/drink-entry";
import { requireCurrentUserProfile } from "@/lib/profile";
import { getRequestTimeZone } from "@/lib/timezone";
import type { CSSProperties } from "react";
import { AddDrinkLink } from "@/components/add-drink-link";
import { HomeScreenTransition } from "@/components/home-screen-transition";

function formatLastDrink(date: Date | null) {
  if (!date) {
    return null;
  }

  const diffInMs = Date.now() - date.getTime();
  const diffInMinutes = Math.max(Math.floor(diffInMs / 60000), 0);

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;

  if (minutes === 0) {
    return `${hours}h ago`;
  }

  return `${hours}h ${minutes}m ago`;
}

export default async function HomePage() {
  const profile = await requireCurrentUserProfile();
  const timeZone = await getRequestTimeZone();
  const tonightStart = getDrinkingDayStart(new Date(), timeZone);
  const [summary, entries] = await Promise.all([
    getDrinkSummaryForClerkUser(profile.clerkUserId, tonightStart),
    getDrinkEntriesForClerkUser(profile.clerkUserId),
  ]);
  const tonightEntries = entries.filter((entry) => getEffectiveDrinkTime(entry) >= tonightStart);
  const bacValue = calculateCurrentBac(tonightEntries, {
    sex: profile.sex,
    weightInPounds: profile.weightInPounds,
    metabolicEfficiency: profile.metabolicEfficiency,
  });
  const progress = getBacProgressPercent(bacValue);

  return (
    <HomeScreenTransition>
      <div className="home-copy">
        <h1>Track those drinks homie.</h1>
      </div>

      <section className="tonight-card" aria-label="Tonight status">
        <div className="bac-section" aria-label="Current BAC">
          <div
            className="bac-ring"
            style={
              {
                "--progress": `${progress}%`,
              } as CSSProperties
            }
          >
            <div className="bac-ring-inner">
              <span className="bac-inner-label">BAC</span>
              <span className="bac-value">{bacValue.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <section className="stats-strip" aria-label="Tonight summary">
          <article className="stat-panel">
            <div className="stat-heading">
              <span className="stat-icon stat-icon-drinks" aria-hidden="true" />
              <p className="stat-label">Drinks Tonight</p>
            </div>
            <strong className="stat-value">
              <span className="stat-value-number">{summary.drinksTonight}</span>
              <span className="stat-value-unit">units</span>
            </strong>
          </article>

          <article className="stat-panel">
            <div className="stat-heading">
              <span className="stat-icon stat-icon-time" aria-hidden="true" />
              <p className="stat-label">Last Drink</p>
            </div>
            {summary.lastDrinkAt ? (
              <strong className="stat-value">
                <span className="stat-value-number">
                  {formatLastDrink(summary.lastDrinkAt)?.replace(/\s*ago$/, "")}
                </span>
                <span className="stat-value-unit">ago</span>
              </strong>
            ) : (
              <strong className="stat-value stat-value-empty-wrap">
                <span className="stat-value-number">None</span>
              </strong>
            )}
          </article>
        </section>
      </section>

      <AddDrinkLink href="/log" className="primary-action">
        <span className="primary-action-copy">
          <span className="primary-action-title">Add a drink</span>
        </span>
        <span className="primary-action-icon" aria-hidden="true">
          +
        </span>
      </AddDrinkLink>
    </HomeScreenTransition>
  );
}
