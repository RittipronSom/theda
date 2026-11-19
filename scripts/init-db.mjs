// Creates the database on first boot (e.g. a fresh Render disk).
// Never re-seeds an existing database, so orders/users/stock are kept.
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const Database = require("better-sqlite3");

const dataDir = process.env.DATA_DIR || "data";
mkdirSync(dataDir, { recursive: true });
const file = join(dataDir, "theda.db");

const hasTable = (name) => {
  if (!existsSync(file)) return false;
  const db = new Database(file);
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(name);
  db.close();
  return !!row;
};

const run = (cmd) => execSync(cmd, { stdio: "inherit", env: process.env });

if (!hasTable("products")) {
  console.log(`[init-db] no database at ${file}, seeding...`);
  run("npx tsx db/seed.ts");
}
if (!hasTable("users")) {
  console.log("[init-db] adding commerce tables + admin user...");
  run("node scripts/migrate-commerce.mjs");
}
console.log("[init-db] database ready");
