import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductBuyBox from "@/components/ProductBuyBox";
import ProductCard from "@/components/ProductCard";
import ProductVisual from "@/components/ProductVisual";
import ProductGallery from "@/components/ProductGallery";
import { getProductGallery } from "@/lib/product-gallery";
import Accordion from "@/components/Accordion";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import { getProductBySlug, getProductIngredients, getRoutineSteps, getProducts } from "@/lib/queries";

// Render on each request so admin edits to products show up immediately.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [product] = getProductBySlug(slug);
  if (!product) return { title: "ไม่พบผลิตภัณฑ์ | THEDA" };
  return { title: `${product.name} | THEDA`, description: product.shortDesc };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product] = getProductBySlug(slug);
  if (!product) notFound();

  const ingredients = getProductIngredients(slug);
  const gallery = getProductGallery(slug, product.name);
  const all = getProducts();
  const related = all.filter((p) => p.slug !== slug).slice(0, 4);
  const routine = getRoutineSteps().find((s) => s.productSlug === slug);

  return (
    <>
      {/* dark entry strip with breadcrumb */}
      <div className="bg-espresso py-4 text-cream">
        <nav className="mx-auto max-w-6xl break-words px-5 text-[0.7rem] leading-relaxed tracking-[0.18em] text-cream/50 lg:px-8">
          <Link href="/" className="transition-colors hover:text-gold-light">
            หน้าแรก
          </Link>
          <span className="mx-3">/</span>
          <Link href="/#products" className="transition-colors hover:text-gold-light">
            ผลิตภัณฑ์
          </Link>
          <span className="mx-3">/</span>
          <span className="text-cream/80">{product.name}</span>
        </nav>
      </div>

      {/* main: gallery left / details right */}
      <section className="bg-cream pb-20 pt-6 lg:pb-28 lg:pt-8">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12 lg:px-8">
          {/* gallery */}
          <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            {gallery.length > 0 ? (
              <ProductGallery key={slug} images={gallery} />
            ) : (
            <div className="relative flex aspect-[4/5] items-center justify-center border border-espresso/10 bg-ivory">
              <div className="pointer-events-none absolute h-2/3 w-2/3 rounded-full bg-gold/10 blur-3xl" />
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={480}
                  height={480}
                  priority
                  quality={100}
                  className="relative h-[62%] w-auto object-contain drop-shadow-[0_25px_35px_rgba(59,34,40,0.2)]"
                />
              ) : (
                <ProductVisual
                  name={product.name}
                  note="Retinol · Ceramide · Centella"
                  className="h-[62%] w-52"
                />
              )}
              {product.badge && (
                <span className="absolute left-5 top-5 bg-espresso/90 px-3.5 py-1.5 text-[0.6rem] font-semibold tracking-[0.28em] text-gold-light">
                  {product.badge}
                </span>
              )}
            </div>
            )}
          </div>

          {/* details */}
          <div className="min-w-0 break-words">
            <p className="label-caps text-taupe">{product.size} — {product.badge ?? "THEDA"}</p>
            <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">{product.name}</h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-taupe md:text-base">{product.shortDesc}</p>

            {/* price row — thin rules above/below (minimal style) */}
            <div className="mt-8 flex items-baseline justify-between border-y border-espresso/15 py-5">
              <span className="font-display text-4xl">฿{product.price.toLocaleString("th-TH")}</span>
              <span className="text-[0.65rem] uppercase tracking-[0.25em] text-taupe">incl. vat</span>
            </div>

            <div className="mt-8">
              {product.tiktokUrl ? (
                <div>
                  <a
                    href={product.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-gold py-4 text-[0.82rem] font-semibold tracking-[0.18em] text-white transition-colors hover:bg-espresso"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.9 2.9 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .6.05.88.13V9.4a6.33 6.33 0 0 0-1-.05A6.34 6.34 0 1 0 15.7 15.7V8.31a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.88.26z" />
                    </svg>
                    ซื้อเลยบน TikTok Shop
                  </a>
                  <div className="mt-4">
                    <ProductBuyBox slug={product.slug} name={product.name} price={product.price} compact />
                  </div>
                </div>
              ) : (
                <ProductBuyBox slug={product.slug} name={product.name} price={product.price} />
              )}
            </div>

            {/* trust badges row — minimal */}
            <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-2 border-t border-espresso/10 pt-5 text-[0.62rem] uppercase tracking-[0.2em] text-taupe">
              <span>✓ ทดสอบทางผิวหนัง</span>
              <span>✓ cruelty-free</span>
              <span>✓ รับประกัน 30 วัน</span>
            </div>

            <div className="mt-12">
              <Accordion
                items={[
                  {
                    title: "รายละเอียดสูตร",
                    body: (
                      <>
                        <p>{product.longDesc}</p>
                        <p className="mt-3 rounded-xl bg-ivory px-5 py-3 text-xs">{product.suitableFor}</p>
                      </>
                    ),
                  },
                  {
                    title: "ส่วนผสมหลัก",
                    body: (
                      <ul className="space-y-4">
                        {ingredients.map((ing) => (
                          <li key={ing.id}>
                            <p className="font-display text-base text-espresso">{ing.name}</p>
                            <p className="mt-1">{ing.detail}</p>
                          </li>
                        ))}
                      </ul>
                    ),
                  },
                  {
                    title: "วิธีใช้",
                    body: routine ? (
                      <p>
                        ขั้นตอนที่ {routine.stepNo} — {routine.title}: {routine.instruction}{" "}
                        <span className="text-espresso/70">({routine.timing})</span>
                      </p>
                    ) : (
                      <p>ใช้ตามขั้นตอนการดูแลผิวประจำวันของคุณ</p>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <Marquee />

      {/* related */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal className="flex items-end justify-between">
            <h2 className="font-display text-3xl">
              คุณอาจสนใจ<span className="italic text-taupe">เช่นกัน</span>
            </h2>
            <Link href="/#products" className="text-xs tracking-[0.2em] text-gold hover:underline">
              ดูทั้งหมด →
            </Link>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <Reveal key={p.slug}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
