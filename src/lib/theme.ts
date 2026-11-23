import type { CSSProperties } from "react";
import { theme } from "@/config/theme";

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/** Converts config/theme.ts into CSS custom properties applied on <html>. */
export function themeCssVars(): CSSProperties {
  const c = theme.colors;
  const vars: Record<string, string> = {
    "--wall": c.wall, "--ink": c.ink,
    "--ink-60": rgba(c.ink, 0.62), "--ink-35": rgba(c.ink, 0.35), "--ink-15": rgba(c.ink, 0.15),
    "--accent": c.accent, "--accent-2": c.accent2, "--accent-3": c.accent3, "--accent-4": c.accent4,
    "--chip-on": c.chipOn, "--drawer": c.drawer, "--page": c.page, "--band": c.band, "--mat": c.mat,
  };
  return vars as CSSProperties;
}
