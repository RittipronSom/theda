import Image from "next/image";
import Link from "next/link";
import { getProductGallery } from "@/lib/product-gallery";

const categories = [
  { label: "น้ำตบดอกไม้", slug: "hydro-matrix-activator-essence", image: "essence", color: "#e9f5fc" },
  { label: "เซรั่ม Niacinamide 10%", slug: "glow-serum", image: "serum", color: "#fff0f4" },
  { label: "มอยส์บูสเตอร์ผิวละมุน", slug: "hydro-matrix-fluid-emulsion", image: "fluid-emulsion", color: "#e8f4ff" },
  { label: "ครีมผิวกระจก", slug: "hydro-matrix-deep-cream", image: "deep-cream", color: "#e9f5fc" },
];

export default function ProductCategories() {
  return (
    <section className="product-categories" aria-labelledby="categories-title">
      <div className="site-container">
        <h2 id="categories-title">ผลิตภัณฑ์ของเรา</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <Link key={category.slug} href={`/products/${category.slug}`} className="category-link">
              <span className="category-image" style={{ backgroundColor: category.color }}>
                <Image src={getProductGallery(category.slug, category.label)[0].src} alt={category.label} fill unoptimized sizes="(max-width: 767px) 72px, 6vw" className="object-contain" />
              </span>
              <span>{category.label}</span>
              <span className="category-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
