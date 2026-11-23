/**
 * Single source of truth for colours.
 * `colors` become CSS variables (see lib/theme.ts); `scene` feeds the three.js room.
 * Change a value here and both the UI and the 3D gallery update.
 */
export const theme: { colors: Record<string, string>; scene: SceneTheme } = {
  colors: {
    wall: "#F4EEFF",
    ink: "#1B1340",
    accent: "#ffbe4fff",
    accent2: "#FFC93C",
    accent3: "#22D3A6",
    accent4: "#4F46FF",
    chipOn: "#FFE27A",
    drawer: "#FFE3EC",
    page: "#FBF8FF",
    band: "#EFE6FF",
    mat: "#FFFFFF",
  },
  scene: {
    fog: "#F4EEFF",
    // Vertical gradients, stops go from floor (0) to ceiling (1).
    outerWall: [[0, "#E4D6FF"], [0.2, "#F1E9FF"], [0.6, "#F1E9FF"], [0.86, "#E9DDFF"], [1, "#D9C7FF"]],
    innerWall: [[0, "#FFD6E3"], [0.3, "#FFEEF3"], [0.8, "#FFE6EE"], [1, "#FFC9DA"]],
    floor: [[0, "#FFD76A"], [0.55, "#FFE7A3"], [1, "#FFD98A"]],
    ceiling: "#F8F4FF",
    frame: "#1B1340",
    shadow: "rgba(60,40,120,0.30)",
    labelInk: "#1B1340",
  },
};

export type GradientStops = ReadonlyArray<readonly [number, string]>;

export interface SceneTheme {
  fog: string;
  outerWall: GradientStops;
  innerWall: GradientStops;
  floor: GradientStops;
  ceiling: string;
  frame: string;
  shadow: string;
  labelInk: string;
}
