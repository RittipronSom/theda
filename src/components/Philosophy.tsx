import Reveal from "./Reveal";

const PILLARS = [
  {
    title: "ปลุกความทรงจำ",
    text: "ทุกเซลล์มีความทรงจำของความงามที่เคยมี THEDA ช่วยปลุกมันขึ้นมาอีกครั้ง",
  },
  {
    title: "คืนความเป็นธรรมชาติ",
    text: "ไม่ใช่การแก้ไข ไม่ใช่การปกปิด แต่เป็นการคืนความเปล่งประกายที่ผิวเคยมี",
  },
  {
    title: "ทวงคืนความอ่อนเยาว์",
    text: "เหมือนดั่งแสงที่ค่อยๆ ส่องสว่าง ผิวของคุณก็สามารถค้นพบความเปล่งประกายที่หายไป",
  },
];

export default function Philosophy() {
  return (
    <section id="philosophy" className="bg-cream py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        {/* editorial quote */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="label-caps text-gold">Our Story</p>
          <p className="mt-8 font-display text-3xl italic leading-snug text-espresso/90 md:text-[2.6rem] md:leading-[1.3]">
            &ldquo;เวลาไม่เคยย้อนกลับ
            <span className="text-gold"> แต่ผิวของคุณทำได้ &rdquo;</span>
          </p>
          <div className="gold-underline mx-auto mt-8 h-px w-24" />
        </Reveal>

        <div className="mt-20 grid gap-12 md:grid-cols-3 md:gap-8">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 130}>
              <div className="border-t border-espresso/15 pt-8">
                <span className="font-display text-5xl italic leading-none text-gold/80">0{i + 1}</span>
                <h3 className="mt-5 font-display text-2xl">{p.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-taupe">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* stats hairline row */}
        <Reveal delay={200}>
          <div className="mt-20 grid grid-cols-1 divide-y divide-espresso/10 border-y border-espresso/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              { n: "98%", t: "ของผู้ใช้รู้สึกผิวดีขึ้น" },
              { n: "2 สัปดาห์", t: "ภายในการใช้ต่อเนื่อง" },
              { n: "30 วัน", t: "รับประกันความพึงพอใจ" },
            ].map((s) => (
              <div key={s.n} className="flex flex-col items-center gap-1.5 px-6 py-10 text-center">
                <span className="font-display text-4xl italic text-espresso">{s.n}</span>
                <span className="text-xs tracking-[0.18em] text-taupe">{s.t}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
