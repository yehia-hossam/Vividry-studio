"use client";
import { useState } from "react";

export interface AccordionItem { title: string; body: string }

/** Accessible accordion; the height animates with a CSS grid-rows transition (no JS measuring). */
export function Accordion({ items, className = "" }: { items: AccordionItem[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className={`acc ${className}`}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.title} className={`acc__item ${isOpen ? "is-open" : ""}`}>
            <button className="acc__row" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
              <span>{it.title}</span><span className="acc__plus" aria-hidden>+</span>
            </button>
            <div className="acc__body" aria-hidden={!isOpen}><div><p>{it.body}</p></div></div>
          </div>
        );
      })}
    </div>
  );
}
