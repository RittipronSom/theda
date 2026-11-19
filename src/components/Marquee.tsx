export default function Marquee() {
  const words = [
    "Niacinamide 10%",
    "Sodium Hyaluronate",
    "Snow Mushroom",
    "Encapsulated Retinol",
    "Ceramide Complex",
    "Centella Asiatica",
    "Pearl Extract",
    "4D Hyaluronic",
  ];
  const row = [...words, ...words];
  return (
    <div className="overflow-hidden border-y border-espresso/10 bg-ivory py-4">
      <div className="flex w-max animate-[marquee_36s_linear_infinite] items-center gap-10 whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-display text-sm italic tracking-[0.14em] text-espresso/70">{w}</span>
            <span className="h-1 w-1 rounded-full bg-gold" />
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
