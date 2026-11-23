import * as THREE from "three";
import type { GradientStops } from "@/config/theme";

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  return c;
};

const finish = (c: HTMLCanvasElement) => {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

/** Vertical gradient texture, stop 0 = bottom edge. */
export function verticalGradient(stops: GradientStops): THREE.CanvasTexture {
  const c = canvas(4, 256);
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 256, 0, 0);
  stops.forEach(([o, col]) => g.addColorStop(o, col));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 4, 256);
  return finish(c);
}

/** Floor: a radial gradient that only spans the walkable ring. */
export function floorTexture(stops: GradientStops, innerRatio: number): THREE.CanvasTexture {
  const c = canvas(1024, 1024);
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(512, 512, 512 * innerRatio, 512, 512, 512);
  stops.forEach(([o, col]) => g.addColorStop(o, col));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 1024);
  return finish(c);
}

/** Soft radial blob used for the glow behind each print and the drop shadow. */
export function radialBlob(color: string, solidUntil: number): THREE.CanvasTexture {
  const c = canvas(256, 256);
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, color);
  g.addColorStop(solidUntil, color);
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return finish(c);
}

export interface LabelFonts { serif: string; mono: string }

/** Wall label: artist, title and a small meta line on a transparent canvas. */
export function labelTexture(
  artist: string, title: string, meta: string, ink: string, fonts: LabelFonts,
): THREE.CanvasTexture {
  const c = canvas(640, 260);
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = ink;
  ctx.textBaseline = "alphabetic";
  const fit = (text: string, weight: string, size: number, family: string, y: number) => {
    let s = size;
    do { ctx.font = `${weight} ${s}px ${family}`; s -= 2; } while (ctx.measureText(text).width > 590 && s > 24);
    ctx.fillText(text, 30, y);
  };
  fit(artist, "500", 58, fonts.serif, 82);
  fit(title, "italic 400", 54, fonts.serif, 150);
  ctx.globalAlpha = 0.7;
  ctx.font = `400 30px ${fonts.mono}`;
  ctx.fillText(meta, 30, 215);
  return finish(c);
}
