import type { Product } from "@db/schema";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <section id="products" className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="label-caps text-taupe">คอลเลกชันของเรา</p>
            <h2 className="mt-5 font-display text-4xl font-light leading-tight md:text-5xl">
              คัดสรรเพื่อ<span className="font-medium">ผิวของคุณ</span>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="max-w-xs text-right text-xs leading-relaxed tracking-wide text-taupe">
              5 ขั้นตอนสำคัญ สู่ผลลัพธ์ที่เปล่งประกาย — คลินิกัลกับธรรมชาติในสูตรเดียว
            </p>
          </Reveal>
        </div>

        {/* 2 คอลัมน์ รูปใหญ่ มินิมอล */}
        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2">
          {products.map((p) => (
            <Reveal key={p.slug}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
