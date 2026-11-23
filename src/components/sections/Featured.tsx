"use client";
import { products } from "@/config/products";
import { site } from "@/config/site";
import { useStore } from "@/components/providers/StoreProvider";
import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal } from "@/components/ui/Reveal";

export default function Featured() {
  const { openList } = useStore();
  const picks = site.featured.ids.map((id) => products.findIndex((p) => p.id === id)).filter((i) => i >= 0);
  return (
    <section id="featured" className="section featured">
      <Reveal className="section__head">
        <div>
          <h2 className="h2">{site.featured.title}</h2>
          <p className="lead">{site.featured.text}</p>
        </div>
        <button className="btn btn--ink" onClick={openList}>{site.featured.cta}</button>
      </Reveal>
      <div className="featured__grid">
        {picks.map((i, n) => (
          <Reveal key={products[i].id} delay={n * 80}>
            <ProductCard product={products[i]} index={i} source="section" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
