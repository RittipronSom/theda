import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import * as schema from "./schema";

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), "data");
mkdirSync(DATA_DIR, { recursive: true });

const globalForDb = globalThis as unknown as { __thedaDb?: ReturnType<typeof createDb> };

function createDb() {
  const sqlite = new Database(join(DATA_DIR, "theda.db"));
  sqlite.pragma("journal_mode = WAL");
  return drizzle(sqlite, { schema });
}

export const db = globalForDb.__thedaDb ?? createDb();
if (!globalForDb.__thedaDb) globalForDb.__thedaDb = db;
