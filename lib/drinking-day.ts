import { getLocalDayKey, getTimeZoneParts, zonedTimeToUtc } from "@/lib/timezone";

const DRINKING_DAY_RESET_HOUR = 8;

export function getDrinkingDayStart(
  date = new Date(),
  timeZone = "America/Chicago",
) {
  const parts = getTimeZoneParts(date, timeZone);
  const localDate = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));

  if (parts.hour < DRINKING_DAY_RESET_HOUR) {
    localDate.setUTCDate(localDate.getUTCDate() - 1);
  }

  return zonedTimeToUtc(
    {
      year: localDate.getUTCFullYear(),
      month: localDate.getUTCMonth() + 1,
      day: localDate.getUTCDate(),
      hour: DRINKING_DAY_RESET_HOUR,
      minute: 0,
      second: 0,
    },
    timeZone,
  );
}

export function getDrinkingDayKey(date: Date, timeZone = "America/Chicago") {
  return getLocalDayKey(getDrinkingDayStart(date, timeZone), timeZone);
}

export function getDrinkingDayWindowStartDaysAgo(
  days: number,
  now = new Date(),
  timeZone = "America/Chicago",
) {
  const start = getDrinkingDayStart(now, timeZone);
  const localStartParts = getTimeZoneParts(start, timeZone);
  const localDate = new Date(
    Date.UTC(localStartParts.year, localStartParts.month - 1, localStartParts.day),
  );
  localDate.setUTCDate(localDate.getUTCDate() - days);

  return zonedTimeToUtc(
    {
      year: localDate.getUTCFullYear(),
      month: localDate.getUTCMonth() + 1,
      day: localDate.getUTCDate(),
      hour: DRINKING_DAY_RESET_HOUR,
      minute: 0,
      second: 0,
    },
    timeZone,
  );
}
