import { metabolicEfficiencyValues, sexValues } from "@/db/schema";

export type ProfileFormValues = {
  sex: (typeof sexValues)[number];
  weightInPounds: number;
  metabolicEfficiency: (typeof metabolicEfficiencyValues)[number];
};

export const LEGACY_DEFAULT_HEIGHT_IN_INCHES = 66;

export function parseRequiredNumber(value: FormDataEntryValue | null) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error("Expected a positive number.");
  }

  return parsed;
}

export function parseOptionalNumber(value: FormDataEntryValue | null) {
  const parsed = Number(value ?? 0);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error("Expected a non-negative number.");
  }

  return parsed;
}

export function getProfileValuesFromFormData(formData: FormData): ProfileFormValues {
  const sex = String(formData.get("sex"));
  const weightInPounds = parseRequiredNumber(formData.get("weightInPounds"));
  const metabolicEfficiency = String(formData.get("metabolicEfficiency"));

  if (!sexValues.includes(sex as never)) {
    throw new Error("Invalid sex value.");
  }

  if (!metabolicEfficiencyValues.includes(metabolicEfficiency as never)) {
    throw new Error("Invalid metabolic efficiency value.");
  }

  return {
    sex: sex as "female" | "male",
    weightInPounds,
    metabolicEfficiency: metabolicEfficiency as
      | "lightweight"
      | "average"
      | "efficient",
  };
}

export function getHeightPartsFromInches(heightInInches: number | string) {
  const totalInches = Number(heightInInches);
  const heightFeet = Math.floor(totalInches / 12);
  const remainingInches = totalInches % 12;

  return {
    heightFeet,
    heightInches: remainingInches,
  };
}

export function formatSexLabel(sex: ProfileFormValues["sex"]) {
  if (sex === "female") {
    return "Female";
  }

  return "Male";
}

export function formatMetabolicEfficiencyLabel(
  metabolicEfficiency: ProfileFormValues["metabolicEfficiency"],
) {
  if (metabolicEfficiency === "lightweight") {
    return "Lightweight";
  }

  if (metabolicEfficiency === "efficient") {
    return "Efficient";
  }

  return "Average";
}
