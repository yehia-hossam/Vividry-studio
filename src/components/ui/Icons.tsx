import type { SVGProps } from "react";

const base = { width: "1em", height: "1em", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;
type P = SVGProps<SVGSVGElement>;

export const ArrowLeft = (p: P) => <svg {...base} {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
export const ArrowRight = (p: P) => <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
export const ArrowDown = (p: P) => <svg {...base} {...p}><path d="M12 5v14M6 13l6 6 6-6" /></svg>;
export const Bag = (p: P) => <svg {...base} {...p}><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>;
export const Close = (p: P) => <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>;
export const Menu = (p: P) => <svg {...base} {...p}><path d="M4 8h16M4 16h16" /></svg>;
export const Trash = (p: P) => <svg {...base} {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>;
export const Cube = (p: P) => <svg {...base} {...p}><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 9 8-4.5M12 12v9M12 12 4 7.5" /></svg>;
export const Bookmark = (p: P) => <svg {...base} {...p}><path d="M7 4h10v16l-5-3.5L7 20V4Z" /></svg>;
export const Drop = (p: P) => <svg {...base} {...p}><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" /></svg>;
export const Spark = (p: P) => <svg {...base} {...p}><path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" /></svg>;
export const Box = (p: P) => <svg {...base} {...p}><path d="m12 3 8 4v10l-8 4-8-4V7l8-4Zm0 8 8-4M12 11v10M12 11 4 7" /></svg>;
export const Heart = (p: P) => <svg {...base} {...p}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></svg>;
export const Star = (p: P) => <svg {...base} fill="currentColor" stroke="none" {...p}><path d="m12 2 2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1L12 2Z" /></svg>;

export const featureIcons = { drop: Drop, spark: Spark, box: Box, heart: Heart };
