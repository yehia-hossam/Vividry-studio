import { PY, R, RIN } from "./constants";

/** Camera pose in ring coordinates: angle, radius, yaw (0 = down the passage), height, pitch. */
export interface Pose { th: number; r: number; yaw: number; y: number; pitch: number }
export type Wall = "outer" | "inner";

export const walkPose = (th: number, portrait: boolean): Pose =>
  portrait
    ? { th, r: 15.4, yaw: -0.42, y: 1.9, pitch: -0.1 }
    : { th, r: 15.6, yaw: -0.3, y: 1.92, pitch: -0.12 };

export const focusPose = (th: number, wall: Wall, portrait: boolean): Pose => {
  const d = portrait ? 5.2 : 4.26;
  const y = PY - (portrait ? 1.05 : 0.52);
  return wall === "outer"
    ? { th, r: R - d, yaw: Math.PI / 2, y, pitch: 0 }
    : { th, r: RIN + d, yaw: -Math.PI / 2, y, pitch: 0 };
};

const easeOut = (t: number, power: number) => 1 - Math.pow(1 - t, power);

/** Travel (th) leads with a quartic ease, the turn (yaw) lags with a quadratic one. */
export const interpPose = (a: Pose, b: Pose, t: number): Pose => {
  const e3 = easeOut(t, 3);
  const mix = (x: number, y: number, e: number) => x + (y - x) * e;
  return {
    th: mix(a.th, b.th, easeOut(t, 4)),
    yaw: mix(a.yaw, b.yaw, easeOut(t, 2)),
    r: mix(a.r, b.r, e3),
    y: mix(a.y, b.y, e3),
    pitch: mix(a.pitch, b.pitch, e3),
  };
};
