Neon + Drizzle setup:

1. Add your Neon connection string to `.env.local` as `DATABASE_URL`.
2. Run `npm run db:generate` to create a migration from `db/schema.ts`.
3. Run `npm run db:push` to apply the schema directly, or `npm run db:migrate` if you are using generated migrations.

Current starter tables:
- `user_profiles`
- `drink_entries`
