"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

export default function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(96, Math.max(4, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) updateFromClientX(e.clientX);
  };
  const stop = () => (dragging.current = false);

  return (
    <section id="results" className="bg-ivory py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <div className="text-center">
          <p className="label-caps text-gold">ผลลัพธ์จริงจากผู้ใช้จริง</p>
          <h2 className="mx-auto mt-5 max-w-xl font-display text-4xl leading-tight md:text-5xl">
            ผิวที่เปลี่ยนไป
            <span className="italic text-taupe"> พิสูจน์ได้ด้วยตา</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-taupe">
            ลากเส้นเพื่อเปรียบเทียบผลลัพธ์ก่อนและหลังการใช้ THEDA
            สัมผัสความเปลี่ยนแปลงที่เห็นได้ชัดด้วยตาคุณเอง
          </p>
        </div>

        <div
          ref={ref}
          className="ba-slider mx-auto mt-12 aspect-square max-w-xl cursor-ew-resize select-none rounded-2xl border border-espresso/10 shadow-xl shadow-espresso/10"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={stop}
          onPointerLeave={stop}
        >
          <Image
            src="/images/before-after/after-v3.png"
            alt="หลังใช้ — ผิวกระจ่างใสขึ้นอย่างเห็นได้ชัด"
            fill
            quality={100}
            sizes="(max-width: 768px) 92vw, 576px"
            className="object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
            <div className="relative h-full w-full" style={{ width: `${(100 / pos) * 100}%`, maxWidth: "none" }}>
              <Image
                src="/images/before-after/before-v3.png"
                alt="ก่อนใช้"
                fill
                quality={100}
                sizes="(max-width: 768px) 92vw, 576px"
                className="object-cover"
                draggable={false}
              />
            </div>
          </div>
          <span className="absolute left-4 top-4 rounded-full bg-espresso/70 px-4 py-1.5 text-xs tracking-widest text-cream">
            ก่อนใช้
          </span>
          <span className="absolute right-4 top-4 rounded-full bg-gold px-4 py-1.5 text-xs tracking-widest text-white">
            หลังใช้ 2 สัปดาห์
          </span>
          <div className="ba-handle" style={{ left: `${pos}%` }} />
        </div>

        <p className="mt-6 text-center text-xs text-taupe">
          ผิวกระจ่างใสขึ้นอย่างเห็นได้ชัด — ใช้ THEDA Glow Serum ต่อเนื่อง 2 สัปดาห์
        </p>
      </div>
    </section>
  );
}
