"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductGalleryImage } from "@/lib/product-gallery";

const labels = ["แนะนำสินค้า", "ส่วนผสม", "ภาพผลิตภัณฑ์"];

export default function ProductGallery({ images }: { images: ProductGalleryImage[] }) {
  const [selected, setSelected] = useState(0);
  const active = images[selected];

  return (
    <div className="mx-auto w-full max-w-[460px]">
      <div id="product-gallery-image" className="relative aspect-square border border-espresso/10 bg-white" aria-live="polite">
        <Image
          src={active.src}
          alt={active.alt}
          fill
          priority
          unoptimized
          sizes="(min-width: 1024px) 550px, 100vw"
          className="object-contain"
        />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3" role="group" aria-label="เลือกรูปสินค้า">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            aria-label={`ดูรูป ${index + 1}: ${labels[index]}`}
            aria-pressed={selected === index}
            aria-controls="product-gallery-image"
            onClick={() => setSelected(index)}
            className={`overflow-hidden border bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-espresso ${selected === index ? "border-espresso ring-1 ring-espresso" : "border-espresso/15 hover:border-espresso/60"}`}
          >
            <span className="relative block aspect-[4/3]">
              <Image src={image.src} alt={image.alt} fill unoptimized sizes="(min-width: 1024px) 175px, 30vw" className="object-contain" />
            </span>
            <span className="block border-t border-espresso/10 px-1 py-2 text-[0.65rem] text-espresso">{labels[index]}</span>
          </button>
        ))}
      </div>
      <a href={active.src} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-xs text-taupe underline underline-offset-4">
        ดูภาพขนาดเต็ม ↗
      </a>
    </div>
  );
}
