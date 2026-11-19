"use client";

import { useState } from "react";

export default function Accordion({
  items,
}: {
  items: { title: string; body: React.ReactNode }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-espresso/12 border-y border-espresso/12">
      {items.map((it, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between py-5 text-left"
          >
            <span className="text-[0.78rem] font-semibold tracking-[0.22em]">{it.title}</span>
            <span
              className={`font-display text-lg text-gold transition-transform duration-300 ${
                open === i ? "rotate-45" : ""
              }`}
            >
              +
            </span>
          </button>
          <div
            className={`grid transition-all duration-400 ${
              open === i ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden text-sm leading-relaxed text-taupe">{it.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
