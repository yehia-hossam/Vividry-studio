/* eslint-disable @next/next/no-img-element */
import type { Product } from "@/config/products";

/** Artwork thumbnail with the correct ratio (no layout shift). Swap for next/image if you host on a supported CDN. */
export function ArtImage({ product, className = "", priority = false }: { product: Product; className?: string; priority?: boolean }) {
  return (
    <img
      src={product.image}
      alt={`${product.title} by ${product.artist}`}
      width={800}
      height={1080}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      className={`art ${className}`}
    />
  );
}
