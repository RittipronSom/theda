import type { HeroIngredient } from "@db/schema";
import Reveal from "./Reveal";

export default function Ingredients({ items }: { items: HeroIngredient[] }) {
  return (
    <section id="ingredients" className="relative overflow-hidden bg-espresso py-24 text-cream lg:py-32">
      <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-gold/10 blur-[120px]" />
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="text-center">
          <p className="label-caps text-gold-light">จากธรรมชาติ</p>
          <h2 className="mx-auto mt-5 max-w-2xl font-display text-4xl leading-tight md:text-5xl">
            ส่วนผสมที่บอกเล่า
            <span className="italic text-gold-light">ด้วยตัวมันเอง</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-7 md:grid-cols-3">
          {items.map((ing, i) => (
            <Reveal key={ing.name} delay={i * 130}>
              <article className="group h-full rounded-2xl border border-cream/10 bg-espresso-soft/60 p-9 transition-colors hover:border-gold/40">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 font-display text-2xl italic text-gold-light transition-colors group-hover:bg-gold group-hover:text-espresso">
                  {ing.letter}
                </div>
                <h3 className="mt-6 font-display text-2xl">{ing.name}</h3>
                <p className="mt-1 text-xs tracking-wide text-gold-light/90">{ing.subtitle}</p>
                <p className="mt-5 text-sm leading-relaxed text-cream/70">{ing.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {ing.tags.split(",").map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-cream/15 px-3 py-1 text-[0.65rem] tracking-widest text-cream/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
