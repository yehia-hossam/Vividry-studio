import * as THREE from "three";
import type { SceneTheme } from "@/config/theme";
import {
  DRAG_RATE, DRAG_RATE_SMALL, FOLLOW_TAU, GLIDE_SECONDS, H, INNER_COUNT, INTRO_MS,
  OUTER_COUNT, PH, PW, PY, R, RIN, SMALL_QUERY, STEP,
} from "./constants";
import { focusPose, interpPose, walkPose, type Pose, type Wall } from "./poses";
import { floorTexture, labelTexture, radialBlob, verticalGradient, type LabelFonts } from "./textures";

export interface EngineProduct { title: string; artist: string; year: number | string; image: string }

export interface EngineCallbacks {
  /** product index (or null when stepping back); `settled` is true once the glide has finished. */
  onFocusChange?: (product: number | null, settled: boolean) => void;
  /** The focused print was clicked — open its product page. */
  onOpen?: (product: number) => void;
  /** Pointer moved: whether it is over the focused print, plus its position. */
  onHover?: (overFocused: boolean, x: number, y: number) => void;
}

export interface EngineOptions {
  container: HTMLElement;
  products: EngineProduct[];
  theme: SceneTheme;
  fonts: LabelFonts;
  reducedMotion: boolean;
  callbacks: EngineCallbacks;
}

interface PrintData { key: string; product: number; wall: Wall; angle: number; mesh: THREE.Mesh }
interface Glide { from: Pose; to: Pose; start: number | null; dur: number; toFocus: boolean }
type Mode = "walk" | "glide" | "focus";

const TAU = Math.PI * 2;

/**
 * Imperative three.js engine for the curved gallery.
 * React only creates it, forwards input (next/prev/scroll) and reacts to callbacks.
 * The room never moves — only the camera travels along the ring.
 */
export class GalleryEngine {
  private o: EngineOptions;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(56, 1, 0.05, 100);
  private raycaster = new THREE.Raycaster();
  private pickables: THREE.Mesh[] = [];
  private printMats: THREE.MeshBasicMaterial[] = [];
  private disposables: { dispose(): void }[] = [];

  private pose: Pose = walkPose(0, false);
  private base = 0; // walk angle driven by drag / arrows
  private scrollTh = 0; // walk angle driven by page scroll
  private mode: Mode = "walk";
  private glide: Glide | null = null;
  private focus: PrintData | null = null;
  private introStart: number | null | "off" = null; // null = waiting, number = running
  private raf = 0;
  private last = 0;
  private active = true;
  private disposed = false;
  private portrait = false;
  private small = false;
  private drag: { x: number; y: number; base: number; moved: boolean; id: number } | null = null;
  private ro: ResizeObserver;

  constructor(options: EngineOptions) {
    this.o = options;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;
    const el = this.renderer.domElement;
    el.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";
    options.container.appendChild(el);

    this.scene.background = new THREE.Color(options.theme.fog);
    this.scene.fog = new THREE.Fog(options.theme.fog, 10, 46);

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(options.container);
    this.resize();

    el.addEventListener("pointerdown", this.onDown);
    el.addEventListener("pointermove", this.onMove);
    el.addEventListener("pointerup", this.onUp);
    el.addEventListener("pointercancel", this.onCancel);
    el.addEventListener("wheel", this.onWheel, { passive: true });
  }

  /* ------------------------------------------------------------------ setup */

  /** Builds the room and loads textures. Resolves when everything has loaded (or failed gracefully). */
  async init(): Promise<void> {
    const { fonts } = this.o;
    await Promise.all([
      document.fonts.load(`500 58px ${fonts.serif}`),
      document.fonts.load(`italic 400 54px ${fonts.serif}`),
      document.fonts.load(`400 30px ${fonts.mono}`),
    ]).catch(() => undefined);
    if (this.disposed) return;
    this.buildRoom();
    this.buildPrints();
    this.pose = walkPose(this.walkOffset, this.portrait);
    this.base = this.walkOffset;
    this.start();
    await this.loadArt();
  }

  private track<T extends { dispose(): void }>(x: T): T { this.disposables.push(x); return x; }
  private basic(params: THREE.MeshBasicMaterialParameters) { return this.track(new THREE.MeshBasicMaterial(params)); }

  private buildRoom() {
    const t = this.o.theme;
    const outer = new THREE.Mesh(
      this.track(new THREE.CylinderGeometry(R, R, H, 160, 1, true)),
      this.basic({ map: this.track(verticalGradient(t.outerWall)), side: THREE.BackSide }),
    );
    outer.position.y = H / 2;
    const inner = new THREE.Mesh(
      this.track(new THREE.CylinderGeometry(RIN, RIN, H, 120, 1, true)),
      this.basic({ map: this.track(verticalGradient(t.innerWall)) }),
    );
    inner.position.y = H / 2;
    const floor = new THREE.Mesh(
      this.track(new THREE.CircleGeometry(R, 160)),
      this.basic({ map: this.track(floorTexture(t.floor, RIN / R)) }),
    );
    floor.rotation.x = -Math.PI / 2;
    const ceiling = new THREE.Mesh(
      this.track(new THREE.CircleGeometry(R, 160)),
      this.basic({ color: t.ceiling, side: THREE.BackSide }),
    );
    ceiling.rotation.x = -Math.PI / 2;
    ceiling.position.y = H;
    this.scene.add(outer, inner, floor, ceiling);
  }

  private buildPrints() {
    const { products, theme: t, fonts } = this.o;
    const plane = (w: number, h: number) => this.track(new THREE.PlaneGeometry(w, h));
    const halo = this.track(radialBlob("rgba(255,255,255,0.95)", 0.35));
    const shadow = this.track(radialBlob(t.shadow, 0.25));
    const haloGeo = plane(2.1 * PW, 1.75 * PH);
    const shadowGeo = plane(1.25 * PW, 1.18 * PH);
    const frameGeo = this.track(new THREE.BoxGeometry(PW + 0.07, PH + 0.07, 0.06));
    const printGeo = plane(PW, PH);
    const labelW = 0.92, labelGeo = plane(labelW, (labelW * 260) / 640);
    const haloMat = this.basic({ map: halo, transparent: true, depthWrite: false });
    const shadowMat = this.basic({ map: shadow, transparent: true, depthWrite: false });
    const frameMat = this.basic({ color: t.frame });

    this.printMats = products.map(() => this.basic({ color: "#ECE4FA" }));
    const labelMats = products.map((p) =>
      this.basic({
        map: this.track(labelTexture(p.artist, p.title, `${p.year} · PRINT`, t.labelInk, fonts)),
        transparent: true, depthWrite: false,
      }),
    );

    const addGroup = (wall: Wall, i: number, angle: number, product: number) => {
      const g = new THREE.Group();
      const radius = wall === "outer" ? R - 0.02 : RIN + 0.02;
      g.position.set(radius * Math.cos(angle), 0, radius * Math.sin(angle));
      if (wall === "outer") g.lookAt(0, 0, 0); // faces the centre
      else g.lookAt(2 * g.position.x, 0, 2 * g.position.z); // faces outward

      const h = new THREE.Mesh(haloGeo, haloMat); h.position.set(0, PY + 0.05, 0.005);
      const s = new THREE.Mesh(shadowGeo, shadowMat); s.position.set(0.05, PY - 0.06, 0.01);
      const f = new THREE.Mesh(frameGeo, frameMat); f.position.set(0, PY, 0.045);
      const p = new THREE.Mesh(printGeo, this.printMats[product]); p.position.set(0, PY, 0.077);
      const l = new THREE.Mesh(labelGeo, labelMats[product]);
      l.position.set(-PW / 2 + labelW / 2, PY - PH / 2 - 0.42, 0.02);
      p.userData = { key: `${wall}-${i}`, product, wall, angle, mesh: p } satisfies PrintData;
      g.add(h, s, f, p, l);
      this.scene.add(g);
      this.pickables.push(p);
    };

    const n = products.length;
    for (let s = 0; s < OUTER_COUNT; s++) addGroup("outer", s, (s * TAU) / OUTER_COUNT, s % n);
    for (let k = 0; k < INNER_COUNT; k++) addGroup("inner", k, ((k + 0.5) * TAU) / INNER_COUNT, (k + 4) % n);
  }

  private async loadArt() {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    const aniso = this.renderer.capabilities.getMaxAnisotropy();
    await Promise.all(
      this.o.products.map(async (p, i) => {
        try {
          const tex = await loader.loadAsync(p.image);
          if (this.disposed) { tex.dispose(); return; }
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = aniso;
          this.track(tex);
          this.printMats[i].map = tex;
          this.printMats[i].color.set(0xffffff);
          this.printMats[i].needsUpdate = true;
        } catch { /* keep the placeholder colour if an image fails */ }
      }),
    );
  }

  /* --------------------------------------------------------------- public API */

  /** Plays the camera step-forward intro (called once the DOM intro starts). */
  startIntro() { this.introStart = this.o.reducedMotion ? "off" : performance.now(); }

  setActive(on: boolean) {
    if (on === this.active || this.disposed) return;
    this.active = on;
    if (on) this.start(); else cancelAnimationFrame(this.raf);
  }

  /** Page-scroll driven walk angle in radians (negative = forward). */
  setScroll(th: number) { this.scrollTh = th; }

  get isFocused() { return this.focus !== null; }

  next() { this.snap(+1); }
  prev() { this.snap(-1); }

  stepBack() {
    if (!this.focus) return;
    const th = this.pose.th;
    this.focus = null;
    this.base = th + this.walkOffset - this.scrollTh;
    this.startGlide(walkPose(th + this.walkOffset, this.portrait), false);
    this.o.callbacks.onFocusChange?.(null, false);
  }

  /** Glides to the outer-wall copy of `product` that is nearest to the camera. */
  focusProduct(product: number) {
    let best: PrintData | null = null, bestD = Infinity;
    for (const m of this.pickables) {
      const d = m.userData as PrintData;
      if (d.wall !== "outer" || d.product !== product) continue;
      const diff = Math.abs(this.wrap(this.pose.th - d.angle));
      if (diff < bestD) { bestD = diff; best = d; }
    }
    if (best) this.focusOn(best);
  }

  /** Screen rectangle (viewport pixels) of the focused print, used for the fly-in animation. */
  getFocusRect(): { left: number; top: number; width: number; height: number } | null {
    if (!this.focus) return null;
    this.camera.updateMatrixWorld();
    const box = this.renderer.domElement.getBoundingClientRect();
    const xs: number[] = [], ys: number[] = [];
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const v = new THREE.Vector3((sx * PW) / 2, (sy * PH) / 2, 0);
      this.focus.mesh.localToWorld(v);
      v.project(this.camera);
      xs.push(box.left + ((v.x + 1) / 2) * box.width);
      ys.push(box.top + ((1 - v.y) / 2) * box.height);
    }
    const left = Math.min(...xs), top = Math.min(...ys);
    return { left, top, width: Math.max(...xs) - left, height: Math.max(...ys) - top };
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    const el = this.renderer.domElement;
    el.removeEventListener("pointerdown", this.onDown);
    el.removeEventListener("pointermove", this.onMove);
    el.removeEventListener("pointerup", this.onUp);
    el.removeEventListener("pointercancel", this.onCancel);
    el.removeEventListener("wheel", this.onWheel);
    this.disposables.forEach((d) => d.dispose());
    this.renderer.dispose();
    el.remove();
  }

  /* -------------------------------------------------------------- internals */

  private get walkOffset() { return this.portrait ? 0.14 + 0.9 * STEP : 0.14; }
  private wrap(a: number) { return a - TAU * Math.round(a / TAU); }

  private resize() {
    const { clientWidth: w, clientHeight: h } = this.o.container;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.portrait = w < h;
    this.camera.fov = this.portrait ? 70 : 56;
    this.camera.updateProjectionMatrix();
    this.small = window.matchMedia(SMALL_QUERY).matches;
  }

  private start() {
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  private snap(dir: 1 | -1) {
    if (this.focus) { this.stepBack(); return; }
    if (this.mode === "glide") return;
    const t = this.base + this.scrollTh;
    const snapped = (Math.round((t - this.walkOffset) / STEP) - dir) * STEP + this.walkOffset;
    this.base = snapped - this.scrollTh;
  }

  private startGlide(to: Pose, toFocus: boolean) {
    this.glide = { from: { ...this.pose }, to, start: null, dur: this.o.reducedMotion ? 0 : GLIDE_SECONDS, toFocus };
    this.mode = "glide";
  }

  private focusOn(hit: PrintData) {
    const a = hit.angle + TAU * Math.round((this.pose.th - hit.angle) / TAU); // shortest way round
    this.focus = hit;
    this.startGlide(focusPose(a, hit.wall, this.portrait), true);
    this.o.callbacks.onFocusChange?.(hit.product, false);
  }

  private tick = (now: number) => {
    if (this.disposed || !this.active) return;
    this.raf = requestAnimationFrame(this.tick);
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;

    if (this.mode === "glide" && this.glide) {
      const g = this.glide;
      if (g.start === null) g.start = now;
      const t = g.dur <= 0 ? 1 : Math.min(1, (now - g.start) / (g.dur * 1000));
      this.pose = interpPose(g.from, g.to, t);
      if (t >= 1) {
        this.glide = null;
        if (g.toFocus) { this.mode = "focus"; this.o.callbacks.onFocusChange?.(this.focus!.product, true); }
        else { this.mode = "walk"; this.base = this.pose.th - this.scrollTh; }
      }
    } else if (this.mode === "walk") {
      const target = this.base + this.scrollTh;
      const th = this.o.reducedMotion ? target : this.pose.th + (target - this.pose.th) * (1 - Math.exp(-dt / FOLLOW_TAU));
      this.pose = walkPose(th, this.portrait);
    }

    // Opening step: start slightly behind and further out, then ease into the passage.
    let offTh = 0, offR = 0;
    if (this.introStart !== "off") {
      let e = 0;
      if (typeof this.introStart === "number") {
        const p = Math.min(1, (now - this.introStart) / INTRO_MS);
        e = p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);
        if (p >= 1) this.introStart = "off";
      }
      offTh = 0.16 * (1 - e); offR = -0.35 * (1 - e);
    }

    const { th, r, yaw, y, pitch } = this.pose;
    const a = th + offTh, rr = r + offR;
    const px = rr * Math.cos(a), pz = rr * Math.sin(a);
    const tx = Math.sin(a), tz = -Math.cos(a); // tangent (forward)
    const nx = Math.cos(a), nz = Math.sin(a); // outward normal
    this.camera.position.set(px, y, pz);
    this.camera.lookAt(px + Math.cos(yaw) * tx + Math.sin(yaw) * nx, y + pitch, pz + Math.cos(yaw) * tz + Math.sin(yaw) * nz);
    this.renderer.render(this.scene, this.camera);
  };

  /* ------------------------------------------------------------------ input */

  private pick(clientX: number, clientY: number): PrintData | null {
    const box = this.renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(((clientX - box.left) / box.width) * 2 - 1, -((clientY - box.top) / box.height) * 2 + 1);
    this.camera.updateMatrixWorld();
    this.raycaster.setFromCamera(ndc, this.camera);
    const hit = this.raycaster.intersectObjects(this.pickables, false)[0];
    return hit ? (hit.object.userData as PrintData) : null;
  }

  private onDown = (e: PointerEvent) => {
    this.drag = { x: e.clientX, y: e.clientY, base: this.base, moved: false, id: e.pointerId };
  };

  private onMove = (e: PointerEvent) => {
    const d = this.drag;
    const el = this.renderer.domElement;
    if (d && d.id === e.pointerId) {
      const dx = e.clientX - d.x, dy = e.clientY - d.y;
      if (!d.moved && Math.hypot(dx, dy) > 6) {
        d.moved = true;
        el.setPointerCapture(e.pointerId);
        el.style.cursor = "grabbing";
        if (this.focus) this.stepBack();
      }
      if (d.moved && !this.focus && this.mode === "walk") {
        const touch = e.pointerType === "touch"; // vertical touch swipes scroll the page instead
        const delta = touch || Math.abs(dx) > Math.abs(dy) ? dx : dy;
        this.base = d.base + delta * (this.small ? DRAG_RATE_SMALL : DRAG_RATE);
      }
      return;
    }
    if (e.pointerType !== "mouse") return;
    const hit = this.pick(e.clientX, e.clientY);
    el.style.cursor = hit ? "pointer" : "grab";
    this.o.callbacks.onHover?.(!!hit && !!this.focus && hit.key === this.focus.key && this.mode === "focus", e.clientX, e.clientY);
  };

  private onUp = (e: PointerEvent) => {
    const d = this.drag;
    this.drag = null;
    const el = this.renderer.domElement;
    el.style.cursor = "grab";
    if (!d || d.moved) return;
    const hit = this.pick(e.clientX, e.clientY);
    if (this.focus) {
      if (hit && hit.key === this.focus.key) { if (this.mode === "focus") this.o.callbacks.onOpen?.(hit.product); }
      else if (hit) this.focusOn(hit);
      else this.stepBack();
    } else if (hit) this.focusOn(hit);
  };

  private onCancel = () => { this.drag = null; this.renderer.domElement.style.cursor = "grab"; };
  private onWheel = () => { if (this.focus) this.stepBack(); };
}
