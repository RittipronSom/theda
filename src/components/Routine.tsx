import Link from "next/link";
import type { RoutineStep } from "@db/schema";
import Reveal from "./Reveal";

export default function Routine({ steps }: { steps: RoutineStep[] }) {
  return (
    <section id="routine" className="bg-cream py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <Reveal className="text-center">
          <p className="label-caps text-gold">ขั้นตอนการดูแล</p>
          <h2 className="mt-5 font-display text-4xl leading-tight md:text-5xl">
            ศิลปะแห่งการ<span className="italic text-taupe">ดูแลตัวเอง</span>
          </h2>
        </Reveal>

        <ol className="mt-16 space-y-0">
          {steps.map((s, i) => (
            <Reveal key={s.stepNo} delay={i * 110}>
              <li className="relative grid grid-cols-[auto_1fr] gap-6 border-l border-espresso/15 pb-12 pl-10 last:pb-0 md:grid-cols-[auto_1fr_auto]">
                <span className="absolute -left-[1.35rem] top-1 flex h-10 w-10 items-center justify-center rounded-full bg-espresso font-display text-sm italic text-gold-light">
                  {String(s.stepNo).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-2xl">{s.title}</h3>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-taupe">{s.instruction}</p>
                </div>
                <div className="content-start md:justify-self-end">
                  <span className="whitespace-nowrap rounded-full border border-gold/50 px-4 py-1.5 text-xs tracking-widest text-taupe">
                    {s.timing}
                  </span>
                  <Link
                    href={`/products/${s.productSlug}`}
                    className="mt-3 block text-xs text-gold underline-offset-4 hover:underline"
                  >
                    ดูผลิตภัณฑ์ →
                  </Link>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
