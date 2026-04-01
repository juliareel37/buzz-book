import { getDrinkingDayStart } from "@/lib/drinking-day";
import { getEffectiveDrinkTime } from "@/lib/drink-entry";
import {
  formatInTimeZone,
  getLocalDayKey,
  getStartOfLocalDayDaysAgo,
  parseLocalDayKey,
} from "@/lib/timezone";

export const drinkTypeIcons: Record<string, string> = {
  beer: "/icons/beer.svg",
  wine: "/icons/wine.svg",
  liquor: "/icons/liquor.svg",
  cocktail: "/icons/cocktail.svg",
  custom_mix: "/icons/cocktail.svg",
};

export function getStartOfToday(timeZone: string) {
  return getDrinkingDayStart(new Date(), timeZone);
}

export function formatDrinkType(drinkType: string, customDrinkName?: string | null) {
  if (customDrinkName) {
    return customDrinkName;
  }

  if (drinkType === "custom_mix") {
    return "Custom Mix";
  }

  return drinkType.charAt(0).toUpperCase() + drinkType.slice(1);
}

export function formatLoggedAt(date: Date, timeZone: string) {
  return formatInTimeZone(date, timeZone, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getDayKey(date: Date, timeZone: string) {
  return getLocalDayKey(date, timeZone);
}

export function parseDayKey(dayKey: string, timeZone: string) {
  return parseLocalDayKey(dayKey, timeZone);
}

export function formatDayLabel(date: Date, timeZone: string) {
  return formatInTimeZone(date, timeZone, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatDayHeading(date: Date, timeZone: string) {
  return formatInTimeZone(date, timeZone, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function getMonthKey(date: Date, timeZone: string) {
  const dayKey = getLocalDayKey(date, timeZone);
  const [year, month] = dayKey.split("-");

  return `${year}-${month}`;
}

export function formatMonthLabel(date: Date, timeZone: string) {
  return formatInTimeZone(date, timeZone, {
    month: "long",
    year: "numeric",
  });
}

export function getDaysAgoDate(days: number, timeZone: string) {
  return getStartOfLocalDayDaysAgo(days, timeZone);
}

export function buildDailyDigest<
  T extends {
    consumedAt?: Date | null;
    loggedAt: Date;
    servingSizeOz: number | string;
    abvPercent: number | string;
  },
>(entries: T[], timeZone: string) {
  return Object.values(
    entries.reduce<
      Record<
        string,
        {
          dayKey: string;
          date: Date;
          count: number;
          totalOz: number;
          averageAbv: number;
        }
      >
    >((acc, entry) => {
      const effectiveTime = getEffectiveDrinkTime(entry);
      const key = getDayKey(effectiveTime, timeZone);
      const calendarDayDate = parseDayKey(key, timeZone);

      if (!acc[key]) {
        acc[key] = {
          dayKey: key,
          date: calendarDayDate ?? effectiveTime,
          count: 0,
          totalOz: 0,
          averageAbv: 0,
        };
      }

      acc[key].count += 1;
      acc[key].totalOz += Number(entry.servingSizeOz);
      acc[key].averageAbv += Number(entry.abvPercent);

      return acc;
    }, {}),
  )
    .map((day) => ({
      ...day,
      averageAbv: day.count > 0 ? day.averageAbv / day.count : 0,
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}
