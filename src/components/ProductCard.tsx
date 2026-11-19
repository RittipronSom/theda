import Image from "next/image";
import Link from "next/link";
import type { Product } from "../../db/schema";
import AddToCartButton from "./AddToCartButton";
import ProductVisual from "./ProductVisual";
import { getProductGallery } from "@/lib/product-gallery";

export default function ProductCard({ product }: { product: Product }) {
  const cover = getProductGallery(product.slug, product.name)[0];
  return (
    <article className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className={`relative flex items-center justify-center overflow-hidden rounded-3xl ${cover ? "aspect-square border border-espresso/10 bg-white" : "aspect-[4/5] bg-ivory"}`}>
          {cover ? (
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              unoptimized
              sizes="(min-width: 640px) 550px, 100vw"
              className="object-contain"
            />
          ) : product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={420}
              height={420}
              quality={100}
              className="h-[72%] w-auto object-contain transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <ProductVisual name={product.name} className="h-[72%] w-56" />
          )}
          {!cover && product.badge && (
            <span className="absolute left-5 top-5 rounded-full border border-espresso/15 bg-white/85 px-3.5 py-1.5 text-[0.58rem] uppercase tracking-[0.22em] backdrop-blur">
              {product.badge}
            </span>
          )}
          {!cover && <span className="absolute right-5 top-5 text-[0.65rem] tracking-[0.15em] text-taupe">
            {product.size}
          </span>}
        </div>
      </Link>

      <div className="mt-5 flex items-start justify-between gap-4 px-1">
        <div className="min-w-0">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-display text-xl font-light leading-snug transition-colors group-hover:text-taupe">
              {product.name.replace("THEDA ", "")}
            </h3>
          </Link>
          <p className="mt-1 font-display text-lg">฿{product.price.toLocaleString("th-TH")}</p>
        </div>
        {product.tiktokUrl ? (
          <a
            href={product.tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 shrink-0 rounded-full bg-gold px-5 py-2.5 text-[0.68rem] tracking-[0.14em] text-white transition-colors hover:bg-espresso"
          >
            ซื้อเลย ↗
          </a>
        ) : (
          <AddToCartButton
            slug={product.slug}
            name={product.name}
            price={product.price}
            className="mt-1 shrink-0 rounded-full border border-espresso/40 px-5 py-2.5 text-[0.68rem] tracking-[0.14em] transition-colors hover:bg-espresso hover:text-white"
            label="ใส่ตะกร้า"
          />
        )}
      </div>
    </article>
  );
}
