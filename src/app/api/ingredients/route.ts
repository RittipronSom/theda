import { NextResponse } from "next/server";
import { getHeroIngredients } from "@/lib/queries";

export function GET() {
  return NextResponse.json({ ingredients: getHeroIngredients() });
}
