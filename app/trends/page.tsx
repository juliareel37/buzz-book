import Link from "next/link";
import { getDrinkEntriesForClerkUser } from "@/db/queries";
import { getDrinkBacIncrease } from "@/lib/bac";
import { getEffectiveDrinkTime } from "@/lib/drink-entry";
import { requireCurrentUserProfile } from "@/lib/profile";
import { deleteDrinkEntryAction } from "./actions";
import { TonightList } from "./tonight-list";
import {
  buildDailyDigest,
  drinkTypeIcons,
  formatDayLabel,
  formatDrinkType,
  formatLoggedAt,
  getDaysAgoDate,
  getStartOfToday,
} from "./utils";

function formatDateRange(startDate: Date, endDate: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });

  return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
}

export default async function TrendsPage() {
  const profile = await requireCurrentUserProfile();
  const entries = await getDrinkEntriesForClerkUser(profile.clerkUserId);
  const tonightStart = getStartOfToday();
  const pastTwoWeeks = getDaysAgoDate(14);

  const tonightEntries = entries.filter((entry) => getEffectiveDrinkTime(entry) >= tonightStart);
  const entriesPastTwoWeeks = entries.filter(
    (entry) => getEffectiveDrinkTime(entry) >= pastTwoWeeks,
  );

  const pastTwoWeeksAvgAbv =
    entriesPastTwoWeeks.length > 0
      ? entriesPastTwoWeeks.reduce((sum, entry) => sum + Number(entry.abvPercent), 0) /
        entriesPastTwoWeeks.length
      : 0;

  const pastTwoWeeksTopDrinkType = Object.entries(
    entriesPastTwoWeeks.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.drinkType] = (acc[entry.drinkType] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1])[0]?.[0];
  const pastTwoWeeksTotalOz = entriesPastTwoWeeks.reduce(
    (sum, entry) => sum + Number(entry.servingSizeOz),
    0,
  );
  const hasPastTwoWeeksData = entriesPastTwoWeeks.length > 0;

  const pastTwoWeeksByDay = buildDailyDigest(entriesPastTwoWeeks);

  return (
    <section className="activity-screen">
      <section className="activity-section">
        <div className="activity-section-header">
          <p className="activity-section-title">Summary</p>
        </div>

        <section className="activity-summary-panel">
          <article className="activity-summary-feature">
            <p className="activity-summary-label">Past 2 Weeks</p>
            {hasPastTwoWeeksData ? (
              <>
                <div className="activity-summary-feature-row">
                  <strong className="activity-summary-feature-value">
                    {entriesPastTwoWeeks.length}
                  </strong>
                  <span className="activity-summary-feature-unit">
                    {entriesPastTwoWeeks.length === 1 ? "drink" : "drinks"}
                  </span>
                </div>
                <p className="activity-summary-feature-meta">
                  {pastTwoWeeksTotalOz.toFixed(1)} oz total
                </p>
              </>
            ) : (
              <>
                <strong className="activity-summary-feature-value activity-summary-feature-value-empty">
                  No drinks yet
                </strong>
                <p className="activity-summary-feature-meta activity-summary-feature-meta-empty">
                  Log your first drink to start building your activity summary.
                </p>
              </>
            )}
          </article>

          <div className="activity-summary-grid">
            <article className="activity-summary-card">
              <p className="activity-summary-label">Top Drink</p>
              <strong className="activity-summary-value activity-summary-value-text">
                {pastTwoWeeksTopDrinkType ? formatDrinkType(pastTwoWeeksTopDrinkType) : "None"}
              </strong>
            </article>

            <article className="activity-summary-card">
              <p className="activity-summary-label">Avg ABV</p>
              <strong className="activity-summary-value">
                {hasPastTwoWeeksData ? `${pastTwoWeeksAvgAbv.toFixed(1)}%` : "N/A"}
              </strong>
            </article>
          </div>
        </section>
      </section>

      <section className="activity-section">
        <div className="activity-section-header">
          <p className="activity-section-title">Tonight</p>
        </div>

        <section className="activity-log-card">
          {tonightEntries.length > 0 ? (
            <TonightList
              entries={tonightEntries.map((entry) => ({
                id: entry.id,
                iconUrl: drinkTypeIcons[entry.drinkType],
                drinkName: formatDrinkType(entry.drinkType, entry.customDrinkName),
                detailLine: `${formatLoggedAt(getEffectiveDrinkTime(entry))} | ${Number(entry.servingSizeOz).toFixed(1)} oz`,
                abvLine: `${Number(entry.abvPercent).toFixed(1)}%\u00A0ABV`,
                bacAdd: `+ ${getDrinkBacIncrease(entry.servingSizeOz, entry.abvPercent, {
                  sex: profile.sex,
                  weightInPounds: profile.weightInPounds,
                }).toFixed(3)}`,
              }))}
              deleteAction={deleteDrinkEntryAction}
            />
          ) : (
            <p className="activity-empty">No drinks logged tonight.</p>
          )}
        </section>
      </section>

      <section className="activity-section">
        <div className="activity-section-header">
          <div className="activity-section-heading">
            <p className="activity-section-title">Past 2 Weeks</p>
            <p className="activity-section-range">
              {formatDateRange(pastTwoWeeks, new Date())}
            </p>
          </div>
          <Link href="/trends/history" className="activity-section-link">
            View All
          </Link>
        </div>

        <section className="activity-log-card">
          {pastTwoWeeksByDay.length > 0 ? (
            <div className="activity-digest-list">
              {pastTwoWeeksByDay.map((day) => (
                <Link
                  key={day.dayKey}
                  href={`/trends/${day.dayKey}`}
                  className="activity-digest-row"
                >
                  <div className="activity-digest-copy">
                    <p className="activity-digest-title">{formatDayLabel(day.date)}</p>
                    <p className="activity-digest-meta">
                      {day.totalOz.toFixed(1)} oz total · {day.averageAbv.toFixed(1)}% avg ABV
                    </p>
                  </div>
                  <p className="activity-digest-count">
                    <span className="activity-digest-count-value">{day.count}</span>
                    <span className="activity-digest-count-unit">
                      {day.count === 1 ? "drink" : "drinks"}
                    </span>
                  </p>
                  <span className="activity-digest-caret" aria-hidden="true">
                    ›
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="activity-empty">No drinks logged in the past two weeks.</p>
          )}
        </section>
      </section>
    </section>
  );
}
