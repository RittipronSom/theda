// การ์ดตัวอักษรสไตล์ editorial — ใช้แทนภาพถ่ายเมื่อสินค้าไม่มีรูปจริง
// ออกแบบให้ดู "ตั้งใจ" เป็นดีไซน์แบรนด์ ไม่ใช่ภาพขวดปลอม
export default function ProductVisual({
  name,
  note,
  className = "",
  compact = false,
}: {
  name: string;
  note?: string;
  className?: string;
  compact?: boolean;
}) {
  const short = name.replace("THEDA ", "");
  const initial = short.charAt(0).toUpperCase();
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden border border-gold/40 bg-gradient-to-b from-espresso-soft to-espresso text-center ${className}`}
    >
      {/* double ring ornament */}
      <div className="pointer-events-none absolute inset-3 rounded-t-full border border-gold/25" />
      <div className="pointer-events-none absolute inset-5 rounded-t-full border border-gold/15" />

      <span className={`font-display italic leading-none text-gold-light ${compact ? "text-2xl" : "text-5xl"}`}>
        {initial}
      </span>
      <span
        className={`mt-3 font-display leading-snug text-cream ${compact ? "text-[0.6rem] tracking-[0.14em]" : "text-lg"}`}
      >
        {short}
      </span>
      <span className="mt-1 text-[0.55rem] tracking-[0.3em] text-cream/50">THEDA</span>
      {note && !compact && (
        <>
          <span className="mt-4 h-px w-10 bg-gold/50" />
          <span className="mt-3 px-4 text-[0.6rem] leading-relaxed tracking-[0.12em] text-gold-light/80">{note}</span>
        </>
      )}
    </div>
  );
}
