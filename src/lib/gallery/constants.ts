/** Geometry of the curved gallery. All units are metres; the ring's centre is the origin. */
export const R = 18; // outer wall radius
export const RIN = 12.2; // inner pillar radius
export const H = 6.2; // wall height
export const PW = 1.36; // print width
export const PH = PW * 1.35; // print height (artwork ratio 800 × 1080)
export const PY = 1.95; // print centre height
export const OUTER_COUNT = 36;
export const INNER_COUNT = 24;
export const STEP = (Math.PI * 2) / OUTER_COUNT; // one "slot" along the passage

export const GLIDE_SECONDS = 0.95;
export const INTRO_MS = 1400;
export const FOLLOW_TAU = 0.36; // smoothing time constant of the walk (seconds)
export const WHEEL_RATE = 0.0016; // radians per scrolled pixel
export const DRAG_RATE = 0.0022;
export const DRAG_RATE_SMALL = 0.0042;

/** Mirrors the CSS small-screen media query. Keep both in sync. */
export const SMALL_QUERY =
  "(max-width: 819px), (orientation: portrait) and (max-width: 1100px), (orientation: landscape) and (max-height: 500px)";
