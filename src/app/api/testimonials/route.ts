import { NextResponse } from "next/server";
import { getTestimonials } from "@/lib/queries";

export function GET() {
  return NextResponse.json({ testimonials: getTestimonials() });
}
