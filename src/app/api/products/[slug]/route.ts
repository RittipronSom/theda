import { NextResponse } from "next/server";
import { getProductBySlug, getProductIngredients } from "@/lib/queries";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product] = getProductBySlug(slug);
  if (!product) {
    return NextResponse.json({ error: "product not found" }, { status: 404 });
  }
  const ingredients = getProductIngredients(slug);
  return NextResponse.json({ product, ingredients });
}
