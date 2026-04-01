import { getDrinkingDayStart } from "@/lib/drinking-day";
import { getEffectiveDrinkTime } from "@/lib/drink-entry";

export const drinkTypeIcons: Record<string, string> = {
  beer: "/icons/beer.svg",
  wine: "/icons/wine.svg",
  liquor: "/icons/liquor.svg",
  cocktail: "/icons/cocktail.svg",
  custom_mix: "/icons/cocktail.svg",
};

export function getStartOfToday() {
  return getDrinkingDayStart();
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

export function formatLoggedAt(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function getDayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function parseDayKey(dayKey: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) {
    return null;
  }

  const date = new Date(`${dayKey}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatDayHeading(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function getMonthKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

export function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getDaysAgoDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function buildDailyDigest<
  T extends {
    consumedAt?: Date | null;
    loggedAt: Date;
    servingSizeOz: number | string;
    abvPercent: number | string;
  },
>(entries: T[]) {
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
      const key = getDayKey(effectiveTime);
      const calendarDayDate = parseDayKey(key);

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
