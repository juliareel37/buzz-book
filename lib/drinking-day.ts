const DRINKING_DAY_RESET_HOUR = 8;

export function getDrinkingDayStart(date = new Date()) {
  const start = new Date(date);
  start.setMinutes(0, 0, 0);

  if (start.getHours() < DRINKING_DAY_RESET_HOUR) {
    start.setDate(start.getDate() - 1);
  }

  start.setHours(DRINKING_DAY_RESET_HOUR, 0, 0, 0);
  return start;
}

export function getDrinkingDayKey(date: Date) {
  const drinkingDayStart = getDrinkingDayStart(date);
  const year = drinkingDayStart.getFullYear();
  const month = String(drinkingDayStart.getMonth() + 1).padStart(2, "0");
  const day = String(drinkingDayStart.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getDrinkingDayWindowStartDaysAgo(days: number, now = new Date()) {
  const start = getDrinkingDayStart(now);
  start.setDate(start.getDate() - days);
  return start;
}
