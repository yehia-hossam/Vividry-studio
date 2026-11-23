"use client";
import { useEffect, useRef } from "react";
import { products } from "@/config/products";
import { site } from "@/config/site";
import { useStore } from "@/components/providers/StoreProvider";
import { ProductCard } from "./ProductCard";

/** "List" view: every print as a card. */
export default function ProductList() {
  const { view } = useStore();
  const ref = useRef<HTMLElement>(null);
  const open = view === "list";
  useEffect(() => { ref.current?.toggleAttribute("inert", !open); if (open) ref.current?.scrollTo({ top: 0 }); }, [open]);
  return (
    <section ref={ref} className={`list ${open ? "is-open" : ""}`} aria-label="All prints" aria-hidden={!open}>
      <h2 className="list__title">{site.hero.headline} — all prints</h2>
      <div className="list__grid">
        {products.map((p, i) => (<ProductCard key={p.id} product={p} index={i} source="list" />))}
      </div>
    </section>
  );
}
