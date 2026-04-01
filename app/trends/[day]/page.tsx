import { notFound } from "next/navigation";
import { HistoryBackButton } from "@/components/history-back-button";
import { getDrinkEntriesForClerkUser } from "@/db/queries";
import { getDrinkBacIncrease } from "@/lib/bac";
import { getEffectiveDrinkTime } from "@/lib/drink-entry";
import { requireCurrentUserProfile } from "@/lib/profile";
import { getRequestTimeZone } from "@/lib/timezone";
import { deleteDrinkEntryAction } from "../actions";
import { TonightList } from "../tonight-list";
import {
  drinkTypeIcons,
  formatDayHeading,
  formatDrinkType,
  formatLoggedAt,
  getDayKey,
  parseDayKey,
} from "../utils";

type DayDetailPageProps = {
  params: Promise<{
    day: string;
  }>;
  searchParams: Promise<{
    from?: string;
  }>;
};

export default async function DayDetailPage({
  params,
  searchParams,
}: DayDetailPageProps) {
  const { day } = await params;
  const { from } = await searchParams;
  const fromHistory = from === "history";
  const timeZone = await getRequestTimeZone();
  const selectedDate = parseDayKey(day, timeZone);

  if (!selectedDate) {
    notFound();
  }

  const profile = await requireCurrentUserProfile();
  const entries = await getDrinkEntriesForClerkUser(profile.clerkUserId);
  const dayEntries = entries.filter(
    (entry) => getDayKey(getEffectiveDrinkTime(entry), timeZone) === day,
  );

  if (dayEntries.length === 0) {
    notFound();
  }

  return (
    <section className="settings-screen">
      <div className="settings-copy settings-section-header settings-copy-spacious">
        <HistoryBackButton
          fallbackHref={fromHistory ? "/trends/history" : "/trends"}
          className="back-link back-link-icon-only"
          restoreSessionKey={fromHistory ? "buzz-book-history-restore" : undefined}
        />
        <h1>{formatDayHeading(selectedDate, timeZone)}</h1>
      </div>

      <section className="activity-section">
        <section className="activity-log-card">
          <TonightList
            entries={dayEntries.map((entry) => ({
              id: entry.id,
              iconUrl: drinkTypeIcons[entry.drinkType],
              drinkName: formatDrinkType(entry.drinkType, entry.customDrinkName),
              detailLine: `${formatLoggedAt(getEffectiveDrinkTime(entry), timeZone)} | ${Number(entry.servingSizeOz).toFixed(1)} oz`,
              abvLine: `${Number(entry.abvPercent).toFixed(1)}%\u00A0ABV`,
              bacAdd: `+ ${getDrinkBacIncrease(entry.servingSizeOz, entry.abvPercent, {
                sex: profile.sex,
                weightInPounds: profile.weightInPounds,
              }).toFixed(3)}`,
            }))}
            deleteAction={deleteDrinkEntryAction}
          />
        </section>
      </section>
    </section>
  );
}
