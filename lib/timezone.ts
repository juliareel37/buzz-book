import { cookies } from "next/headers";

const TIMEZONE_COOKIE = "buzz-book-timezone";
const FALLBACK_TIME_ZONE = "America/Chicago";

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function isValidTimeZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

export async function getRequestTimeZone() {
  const cookieStore = await cookies();
  const timeZone = cookieStore.get(TIMEZONE_COOKIE)?.value;

  if (timeZone && isValidTimeZone(timeZone)) {
    return timeZone;
  }

  return FALLBACK_TIME_ZONE;
}

export function getTimeZoneParts(date: Date, timeZone: string): ZonedParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");

  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: read("hour"),
    minute: read("minute"),
    second: read("second"),
  };
}

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
  const parts = getTimeZoneParts(date, timeZone);
  const asUtcTimestamp = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );

  return asUtcTimestamp - date.getTime();
}

export function zonedTimeToUtc(parts: ZonedParts, timeZone: string) {
  const utcGuess = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );

  let offset = getTimeZoneOffsetMs(new Date(utcGuess), timeZone);
  let utcTimestamp = utcGuess - offset;
  const adjustedOffset = getTimeZoneOffsetMs(new Date(utcTimestamp), timeZone);

  if (adjustedOffset !== offset) {
    offset = adjustedOffset;
    utcTimestamp = utcGuess - offset;
  }

  return new Date(utcTimestamp);
}

export function formatInTimeZone(
  date: Date,
  timeZone: string,
  options: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat("en-US", {
    ...options,
    timeZone,
  }).format(date);
}

export function getLocalDayKey(date: Date, timeZone: string) {
  const parts = getTimeZoneParts(date, timeZone);
  const month = String(parts.month).padStart(2, "0");
  const day = String(parts.day).padStart(2, "0");

  return `${parts.year}-${month}-${day}`;
}

export function parseLocalDayKey(dayKey: string, timeZone: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) {
    return null;
  }

  const [year, month, day] = dayKey.split("-").map(Number);

  return zonedTimeToUtc(
    {
      year,
      month,
      day,
      hour: 0,
      minute: 0,
      second: 0,
    },
    timeZone,
  );
}

export function getStartOfLocalDayDaysAgo(days: number, timeZone: string, now = new Date()) {
  const parts = getTimeZoneParts(now, timeZone);
  const localMidnight = zonedTimeToUtc(
    {
      year: parts.year,
      month: parts.month,
      day: parts.day,
      hour: 0,
      minute: 0,
      second: 0,
    },
    timeZone,
  );

  localMidnight.setUTCDate(localMidnight.getUTCDate() - days);
  return localMidnight;
}

