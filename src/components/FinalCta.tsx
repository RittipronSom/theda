import Link from "next/link";
import Reveal from "./Reveal";

const TRUST = ["ผ่านการทดสอบทางผิวหนัง", "ไม่ทดสอบกับสัตว์", "รับประกัน 30 วัน"];

export default function FinalCta() {
  return (
    <section id="story" className="bg-cream py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-espresso px-8 py-20 text-center text-cream md:px-16">
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gold/15 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gold-light/10 blur-[100px]" />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-8 select-none text-center font-display text-[7rem] leading-none tracking-[0.3em] text-cream/[0.04] md:text-[9rem]"
            >
              THEDA
            </span>
            <div className="relative">
              <p className="label-caps text-gold-light">เริ่มต้นวันนี้</p>
              <h2 className="mx-auto mt-5 max-w-2xl font-display text-4xl leading-tight md:text-5xl">
                ค้นพบเวลาที่หายไป
                <br />
                <span className="italic text-gold-light">ให้ผิวได้รับสิ่งที่ดีที่สุด</span>
              </h2>
              <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-cream/70">
                ทุกออเดอร์คือการเดินทางกลับสู่ความอ่อนเยาว์ สัมผัสประสบการณ์ที่ THEDA
                คัดสรรมาเพื่อผิวของคุณโดยเฉพาะ
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href="/#products"
                  className="rounded-full bg-gold px-9 py-3.5 text-sm font-semibold tracking-widest text-white transition-colors hover:bg-[#b01f25]"
                >
                  สำรวจผลิตภัณฑ์
                </Link>
                <Link
                  href="mailto:hello@theda.co"
                  className="rounded-full border border-cream/25 px-9 py-3.5 text-sm tracking-widest text-cream/85 transition-colors hover:border-gold hover:text-gold-light"
                >
                  ติดต่อผู้เชี่ยวชาญ
                </Link>
              </div>
              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs tracking-wide text-cream/50">
                {TRUST.map((t) => (
                  <span key={t} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-gold" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
