import { NextResponse } from "next/server";
import { getProducts } from "@/lib/queries";

export function GET() {
  const products = getProducts();
  return NextResponse.json({ count: products.length, products });
}
