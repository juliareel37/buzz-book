import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

export const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

const sql = hasDatabaseUrl ? neon(process.env.DATABASE_URL!) : null;

export const db = sql ? drizzle({ client: sql, schema }) : null;

export type Database = typeof db;
