import { db } from "@db/client";
import {
  products,
  productIngredients,
  heroIngredients,
  routineSteps,
  testimonials,
} from "@db/schema";
import { asc, eq } from "drizzle-orm";

// better-sqlite3 เป็น sync driver — ต้องปิดท้ายด้วย .all() จึงจะได้ผลลัพธ์จริง

export function getProducts() {
  return db.select().from(products).orderBy(asc(products.sortOrder)).all();
}

export function getProductBySlug(slug: string) {
  return db.select().from(products).where(eq(products.slug, slug)).limit(1).all();
}

export function getProductIngredients(slug: string) {
  return db
    .select()
    .from(productIngredients)
    .where(eq(productIngredients.productSlug, slug))
    .all();
}

export function getHeroIngredients() {
  return db.select().from(heroIngredients).orderBy(asc(heroIngredients.id)).all();
}

export function getRoutineSteps() {
  return db.select().from(routineSteps).orderBy(asc(routineSteps.stepNo)).all();
}

export function getTestimonials() {
  return db.select().from(testimonials).orderBy(asc(testimonials.sortOrder)).all();
}
