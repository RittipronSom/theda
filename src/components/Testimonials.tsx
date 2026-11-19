import type { Testimonial } from "@db/schema";
import Reveal from "./Reveal";

export default function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <section id="testimonials" className="bg-cream py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="text-center">
          <p className="label-caps text-gold">เสียงจากผู้ได้สัมผัส</p>
          <h2 className="mt-5 font-display text-4xl leading-tight md:text-5xl">
            ผิวที่เปล่งประกาย<span className="italic text-taupe">บอกเล่าด้วยตัวเอง</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {items.map((t, i) => (
            <Reveal key={t.id} delay={i * 130}>
              <figure className="border-t border-espresso/15 pt-8">
                <div className="tracking-[0.35em] text-gold">★★★★★</div>
                <blockquote className="mt-5 font-display text-lg italic leading-relaxed text-espresso/85">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 font-display text-base italic text-gold">
                    {t.initial}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-taupe">
                      อายุ {t.age} ปี, {t.location}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
