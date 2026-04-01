type DrinkEntryTimeLike = {
  consumedAt?: Date | null;
  loggedAt: Date;
};

export function getEffectiveDrinkTime(entry: DrinkEntryTimeLike) {
  return entry.consumedAt ?? entry.loggedAt;
}
