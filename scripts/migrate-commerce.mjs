import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const db = new Database("data/theda.db");
db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  password_hash TEXT,
  name TEXT NOT NULL,
  birthday TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_no TEXT NOT NULL UNIQUE,
  user_id INTEGER,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  subtotal INTEGER NOT NULL,
  shipping_fee INTEGER NOT NULL,
  total INTEGER NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  status TEXT NOT NULL DEFAULT 'waiting_payment',
  tracking_no TEXT,
  note TEXT,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  qty INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`);

// add stock/category columns to products if missing
const cols = db.prepare("PRAGMA table_info(products)").all().map((c) => c.name);
if (!cols.includes("stock")) db.exec("ALTER TABLE products ADD COLUMN stock INTEGER NOT NULL DEFAULT 0");
if (!cols.includes("category")) db.exec("ALTER TABLE products ADD COLUMN category TEXT NOT NULL DEFAULT 'skincare'");

// default stock
db.prepare("UPDATE products SET stock = 50 WHERE stock = 0").run();

// admin user
const adminPhone = "0800000000";
const adminHash = bcrypt.hashSync("thedaAdmin#2026", 10);
const existing = db.prepare("SELECT id FROM users WHERE phone = ?").get(adminPhone);
if (!existing) {
  db.prepare("INSERT INTO users (phone, password_hash, name, role, created_at) VALUES (?, ?, ?, 'admin', ?)")
    .run(adminPhone, adminHash, "THEDA Admin", Date.now());
}

// settings
const set = (k, v) => db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(k, v);
set("shipping_fee", "50");
set("free_shipping_min", "500");
set("promptpay_id", "0812345678"); // TODO: เปลี่ยนเป็นเบอร์พร้อมเพย์จริงของร้าน
set("bank_accounts", JSON.stringify([
  { bank: "KBANK", name: "บริษัท ธีด้า จำกัด", no: "123-4-56789-0" },
]));

console.log("commerce tables ready");
console.log("admin login: phone 0800000000 / password thedaAdmin#2026");
db.close();
