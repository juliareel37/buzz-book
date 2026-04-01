import {
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const metabolicEfficiencyValues = [
  "lightweight",
  "average",
  "efficient",
] as const;

export const sexValues = [
  "female",
  "male",
] as const;

export const drinkTypeValues = [
  "beer",
  "wine",
  "liquor",
  "cocktail",
  "custom_mix",
] as const;

export const userProfiles = pgTable(
  "user_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id").notNull().unique(),
    sex: text("sex", { enum: sexValues }).notNull(),
    heightInInches: numeric("height_in_inches", { precision: 5, scale: 2 }).notNull(),
    weightInPounds: numeric("weight_in_pounds", { precision: 6, scale: 2 }).notNull(),
    metabolicEfficiency: text("metabolic_efficiency", {
      enum: metabolicEfficiencyValues,
    }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    clerkUserIdIdx: index("user_profiles_clerk_user_id_idx").on(table.clerkUserId),
  }),
);

export const drinkEntries = pgTable(
  "drink_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    drinkType: text("drink_type", { enum: drinkTypeValues }).notNull(),
    customDrinkName: text("custom_drink_name"),
    servingSizeOz: numeric("serving_size_oz", { precision: 6, scale: 2 }).notNull(),
    abvPercent: numeric("abv_percent", { precision: 5, scale: 2 }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    loggedAt: timestamp("logged_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    clerkUserIdIdx: index("drink_entries_clerk_user_id_idx").on(table.clerkUserId),
    consumedAtIdx: index("drink_entries_consumed_at_idx").on(table.consumedAt),
    loggedAtIdx: index("drink_entries_logged_at_idx").on(table.loggedAt),
  }),
);

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;
export type DrinkEntry = typeof drinkEntries.$inferSelect;
export type NewDrinkEntry = typeof drinkEntries.$inferInsert;
