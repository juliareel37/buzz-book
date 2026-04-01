import { HistoryBackButton } from "@/components/history-back-button";
import { getDrinkEntriesForClerkUser } from "@/db/queries";
import { requireCurrentUserProfile } from "@/lib/profile";
import { getRequestTimeZone } from "@/lib/timezone";
import {
  buildDailyDigest,
  formatDayLabel,
  formatMonthLabel,
  getMonthKey,
} from "../utils";
import { HistoryMonthGroups } from "./history-month-groups";

export default async function TrendsHistoryPage() {
  const profile = await requireCurrentUserProfile();
  const timeZone = await getRequestTimeZone();
  const entries = await getDrinkEntriesForClerkUser(profile.clerkUserId);
  const historyByDay = buildDailyDigest(entries, timeZone);
  const historyByMonth = Object.values(
    historyByDay.reduce<
      Record<
        string,
        {
          monthDate: Date;
          days: typeof historyByDay;
          count: number;
        }
      >
    >((acc, day) => {
      const monthKey = getMonthKey(day.date, timeZone);

      if (!acc[monthKey]) {
        acc[monthKey] = {
          monthDate: day.date,
          days: [],
          count: 0,
        };
      }

      acc[monthKey].days.push(day);
      acc[monthKey].count += day.count;

      return acc;
    }, {}),
  ).sort((a, b) => b.monthDate.getTime() - a.monthDate.getTime());

  const historyMonthData = historyByMonth.map((month) => ({
    monthKey: getMonthKey(month.monthDate, timeZone),
    monthLabel: formatMonthLabel(month.monthDate, timeZone),
    dayCount: month.days.length,
    drinkCount: month.count,
    days: month.days.map((day) => ({
      dayKey: day.dayKey,
      dayLabel: formatDayLabel(day.date, timeZone),
      totalOz: day.totalOz.toFixed(1),
      averageAbv: day.averageAbv.toFixed(1),
      count: day.count,
    })),
  }));

  return (
    <section className="settings-screen">
      <div className="settings-copy settings-section-header settings-copy-spacious">
        <HistoryBackButton
          fallbackHref="/trends"
          className="back-link back-link-icon-only"
        />
        <h1>Full History</h1>
      </div>

      <section className="activity-section">
        {historyMonthData.length > 0 ? (
          <HistoryMonthGroups months={historyMonthData} />
        ) : (
          <p className="activity-empty">No drink history yet.</p>
        )}
      </section>
    </section>
  );
}
