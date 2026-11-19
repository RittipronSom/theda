import Hero from "@/components/Hero";
import ProductCategories from "@/components/ProductCategories";
import Philosophy from "@/components/Philosophy";
import ProductGrid from "@/components/ProductGrid";
import Ingredients from "@/components/Ingredients";
import Routine from "@/components/Routine";
import Marquee from "@/components/Marquee";
import { getProducts, getHeroIngredients, getRoutineSteps } from "@/lib/queries";

// Night Repair Cream ถูกถอดออกจากหน้าแรกตามคำขอ (หน้าสินค้ายังเข้าได้ตามลิงก์เดิม)
const HIDDEN_ON_HOME = new Set(["night-repair-cream"]);

export default function HomePage() {
  const products = getProducts().filter((p) => !HIDDEN_ON_HOME.has(p.slug));
  const ingredients = getHeroIngredients();
  const steps = getRoutineSteps();

  return (
    <>
      <Hero />
      <ProductCategories />
      <Marquee />
      <Philosophy />
      <ProductGrid products={products} />
      <Ingredients items={ingredients} />
      <Routine steps={steps} />
    </>
  );
}
