export default function AnnouncementBar() {
  return (
    <div className="bg-espresso text-cream/80">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-5 py-2.5 text-center">
        <span className="h-1 w-1 rounded-full bg-gold" />
        <p className="text-[0.68rem] tracking-[0.28em] uppercase">
          ผ่านการทดสอบทางผิวหนัง · ไม่ทดสอบกับสัตว์ · รับประกัน 30 วัน
        </p>
        <span className="h-1 w-1 rounded-full bg-gold" />
      </div>
    </div>
  );
}
