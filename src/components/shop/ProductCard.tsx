"use client";
import type { MouseEvent } from "react";
import { productOptions, type Product } from "@/config/products";
import { money } from "@/lib/format";
import { useStore } from "@/components/providers/StoreProvider";
import { ArtImage } from "@/components/ui/ArtImage";
import type { Source } from "@/components/providers/StoreProvider";

/** Card used by the featured grid, the list view and the collection band. */
export function ProductCard({ product, index, source, className = "" }: { product: Product; index: number; source: Source; className?: string }) {
  const { openProduct } = useStore();
  const open = (e: MouseEvent<HTMLButtonElement>) => {
    const img = e.currentTarget.querySelector("img");
    const r = (img ?? e.currentTarget).getBoundingClientRect();
    openProduct(index, { left: r.left, top: r.top, width: r.width, height: r.height }, source);
  };
  return (
    <button className={`card ${className}`} onClick={open} aria-label={`Open ${product.title}`}>
      <span className="card__mat">
        <ArtImage product={product} />
        {product.tag && <span className="card__tag">{product.tag}</span>}
      </span>
      <span className="card__title">{product.title}</span>
      <span className="card__artist">{product.artist}</span>
      <span className="card__price">{money(product.price + productOptions.size[0].delta)}</span>
    </button>
  );
}
