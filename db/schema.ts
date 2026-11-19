import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  nameEn: text("name_en"),
  badge: text("badge"),
  category: text("category").notNull().default("skincare"),
  size: text("size").notNull(),
  price: integer("price").notNull(), // บาท
  stock: integer("stock").notNull().default(0),
  shortDesc: text("short_desc").notNull(),
  longDesc: text("long_desc").notNull(),
  suitableFor: text("suitable_for").notNull(),
  image: text("image"),
  tiktokUrl: text("tiktok_url"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const productIngredients = sqliteTable("product_ingredients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productSlug: text("product_slug").notNull(),
  name: text("name").notNull(),
  detail: text("detail").notNull(),
});

export const heroIngredients = sqliteTable("hero_ingredients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  letter: text("letter").notNull(),
  name: text("name").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  tags: text("tags").notNull(), // comma separated
});

export const routineSteps = sqliteTable("routine_steps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  stepNo: integer("step_no").notNull(),
  title: text("title").notNull(),
  productSlug: text("product_slug").notNull(),
  instruction: text("instruction").notNull(),
  timing: text("timing").notNull(),
});

export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  quote: text("quote").notNull(),
  initial: text("initial").notNull(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  location: text("location").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ---------- e-commerce ----------

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  passwordHash: text("password_hash"), // null = สมัครด้วยเบอร์อย่างเดียว
  name: text("name").notNull(),
  birthday: text("birthday"), // YYYY-MM-DD
  role: text("role").notNull().default("customer"), // customer | admin
  createdAt: integer("created_at").notNull(),
});

export const sessions = sqliteTable("sessions", {
  token: text("token").primaryKey(),
  userId: integer("user_id").notNull(),
  expiresAt: integer("expires_at").notNull(),
});

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderNo: text("order_no").notNull().unique(),
  userId: integer("user_id"), // null = guest
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  subtotal: integer("subtotal").notNull(),
  shippingFee: integer("shipping_fee").notNull(),
  total: integer("total").notNull(),
  paymentMethod: text("payment_method").notNull(), // promptpay | bank
  paymentStatus: text("payment_status").notNull().default("pending"), // pending | paid
  status: text("status").notNull().default("waiting_payment"),
  // waiting_payment | paid | shipped | completed | cancelled
  trackingNo: text("tracking_no"),
  note: text("note"),
  createdAt: integer("created_at").notNull(),
});

export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").notNull(),
  productSlug: text("product_slug").notNull(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  qty: integer("qty").notNull(),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export type Product = typeof products.$inferSelect;
export type ProductIngredient = typeof productIngredients.$inferSelect;
export type HeroIngredient = typeof heroIngredients.$inferSelect;
export type RoutineStep = typeof routineSteps.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type User = typeof users.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
