import { getEffectiveDrinkTime } from "@/lib/drink-entry";

type BacProfile = {
  sex: "female" | "male";
  weightInPounds: number | string;
  metabolicEfficiency?: "lightweight" | "average" | "efficient";
};

type BacDrinkEntry = {
  servingSizeOz: number | string;
  abvPercent: number | string;
  consumedAt?: Date | null;
  loggedAt: Date;
};

const ELIMINATION_RATE_PER_HOUR = 0.015;
const FEMALE_DISTRIBUTION_RATIO = 0.66;
const MALE_DISTRIBUTION_RATIO = 0.73;
const LIGHTWEIGHT_ELIMINATION_RATE_PER_HOUR = 0.012;
const EFFICIENT_ELIMINATION_RATE_PER_HOUR = 0.018;

export function getDistributionRatio(sex: BacProfile["sex"]) {
  return sex === "female" ? FEMALE_DISTRIBUTION_RATIO : MALE_DISTRIBUTION_RATIO;
}

export function getAlcoholOunces(servingSizeOz: number | string, abvPercent: number | string) {
  return Number(servingSizeOz) * (Number(abvPercent) / 100);
}

export function getEliminationRatePerHour(
  metabolicEfficiency: BacProfile["metabolicEfficiency"],
) {
  if (metabolicEfficiency === "lightweight") {
    return LIGHTWEIGHT_ELIMINATION_RATE_PER_HOUR;
  }

  if (metabolicEfficiency === "efficient") {
    return EFFICIENT_ELIMINATION_RATE_PER_HOUR;
  }

  return ELIMINATION_RATE_PER_HOUR;
}

export function getDrinkBacIncrease(
  servingSizeOz: number | string,
  abvPercent: number | string,
  profile: BacProfile,
) {
  const weightInPounds = Number(profile.weightInPounds);
  const distributionRatio = getDistributionRatio(profile.sex);
  const alcoholOunces = getAlcoholOunces(servingSizeOz, abvPercent);

  if (weightInPounds <= 0 || !Number.isFinite(weightInPounds)) {
    return 0;
  }

  return (alcoholOunces * 5.14) / (weightInPounds * distributionRatio);
}

export function calculateCurrentBac(entries: BacDrinkEntry[], profile: BacProfile, now = new Date()) {
  const currentTime = now.getTime();
  const eliminationRatePerHour = getEliminationRatePerHour(profile.metabolicEfficiency);

  const totalBac = entries.reduce((sum, entry) => {
    const effectiveTime = getEffectiveDrinkTime(entry);
    const hoursSinceDrink = Math.max((currentTime - effectiveTime.getTime()) / 3_600_000, 0);
    const drinkIncrease = getDrinkBacIncrease(
      entry.servingSizeOz,
      entry.abvPercent,
      profile,
    );

    return sum + Math.max(drinkIncrease - eliminationRatePerHour * hoursSinceDrink, 0);
  }, 0);

  return Math.max(totalBac, 0);
}

export function getBacProgressPercent(bacValue: number) {
  const maxDisplayBac = 0.16;
  return Math.min((bacValue / maxDisplayBac) * 100, 100);
}
