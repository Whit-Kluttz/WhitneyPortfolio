// CircleBackground.jsx
import { useEffect, useRef } from "react";

/* ============================================================
   SETTINGS: edit these to tune the effect
   ============================================================ */

/* ---- SPAWNING (front dots): how many, how often, how long they live ---- */
const MAX_CIRCLES = 120;          // cap on front dots alive at once
const SPAWN_EVERY_MS = 150;       // how often a new front dot tries to appear (lower = denser)
const LIFETIME_MS = [4000, 8000]; // [min, max] fade in/out duration per dot (both layers)

/* ---- SPACING (front dots) ---- */
const MIN_GAP = 20;               // min px between dot edges when they spawn
const GRID_SIZE = 60;             // cell size used to spread dots evenly

/* ---- DOT SIZE (front dots) ---- */
const RADIUS_MEAN = 6;            // average dot radius (px)
const RADIUS_SD = 2;              // how much radii vary
const RADIUS_MIN = 2;             // smallest allowed radius
const RADIUS_MAX = 14;            // largest allowed radius

/* ---- BACKGROUND DOTS: small, unconnected, not reactive to the mouse, further behind ---- */
const FAR_MAX_CIRCLES = 30;       // cap on background dots alive at once
const FAR_SPAWN_EVERY_MS = 200;   // how often a new background dot tries to appear
const FAR_MIN_GAP = 12;           // min px between background dot edges
const FAR_GRID_SIZE = 45;         // cell size for spreading background dots
const FAR_RADIUS_MEAN = 2;        // average background dot radius (px)
const FAR_RADIUS_SD = 1;
const FAR_RADIUS_MIN = 1;
const FAR_RADIUS_MAX = 5;
const FAR_PARALLAX = 0.01;        // keep this LOWER than PARALLAX so they look further away
const FAR_ALPHA_SCALE = 0.5;      // background dots' opacity as a fraction of front dots (0-1)
const FAR_PALETTE_COUNT = 9;      // background dots only use the first N entries of PALETTE (9 = the Cool core)

/* ---- COLOR PALETTE (cyan theme) ----
   Each entry is a hue range in degrees (0-360) plus a weight.
   A dot picks an entry in proportion to its weight, then a random hue inside the range.
   Hue guide: 0 red, 30 orange, 60 yellow, 120 green, 180 cyan, 240 blue, 280 purple.
   Set a weight to 0 to switch that group off. */
const PALETTE = [
  /* -- Cool core: the cyan family (most of the look) -- */
  { name: "cyan",         hue: [180, 200], weight: 5   }, // your main theme color
  { name: "bright cyan",  hue: [184, 194], weight: 0   }, // tighter band right on cyan
  { name: "aqua/teal",    hue: [160, 180], weight: 2   },
  { name: "seafoam",      hue: [148, 165], weight: .5   }, // greener, softer
  { name: "mint",         hue: [130, 150], weight: 0.5 }, // fresh green-leaning
  { name: "sky",          hue: [200, 212], weight: 2   },
  { name: "azure",        hue: [212, 225], weight: 1   },
  { name: "blue",         hue: [225, 240], weight: 1   },
  { name: "cobalt",       hue: [235, 248], weight: .5   }, // deep, saturated blue

  /* -- Cool-to-purple: still harmonious with cyan -- */
  { name: "indigo",       hue: [240, 265], weight: 2   },
  { name: "violet",       hue: [265, 285], weight: 0.5 },
  { name: "purple",       hue: [285, 305], weight: .75   },
  { name: "orchid",       hue: [300, 320], weight: .4  },

  /* -- Warm accents: use sparingly, they pop against cyan -- */
  { name: "magenta",      hue: [320, 335], weight: .5   },
  { name: "pink",         hue: [335, 350], weight: .5   },
  { name: "rose",         hue: [350, 360], weight: .5   },
  { name: "red",          hue: [0, 12],    weight: 0   },
  { name: "coral",        hue: [8, 28],    weight: 0.4 }, // cyan's opposite; rare spark
  { name: "orange",       hue: [20, 40],   weight: 0.4   },
  { name: "amber/gold",   hue: [40, 55],   weight: 0   },
  { name: "yellow",       hue: [55, 70],   weight: 0   },
  { name: "lime",         hue: [75, 100],  weight: 0   },
  { name: "green",        hue: [100, 130], weight: .12   },
];
const SATURATION_RANGE = [65, 90];  // [min, max] 0-100, picked per dot
const LIGHTNESS_RANGE = [55, 70];   // [min, max] 0-100, picked per dot

/* ---- OPACITY & LINES ---- */
const DOT_MAX_ALPHA = 0.55;       // peak front-dot opacity (0-1)
const LINK_ALPHA = 0.5;           // line opacity relative to the dots (0-1)
const LINE_WIDTH = 1;             // line thickness (px)
const REDUCED_MOTION_ALPHA = 0.35; // dot opacity for people with reduced motion on

/* ---- PARALLAX (front dots) ---- */
const PARALLAX = 0.3;             // 0 = fixed to screen, 1 = scrolls exactly with content

/* ---- CONNECTIONS (front dots only) ---- */
const LINKS_MIN = 1;              // fewest links a dot aims for (0 allowed)
const LINKS_MAX = 4;              // most links a dot aims for
                                  // each dot picks a whole number between these, inclusive.
                                  // set both equal for a fixed count
const LINK_RANGE = 240;           // px: only dots this close can be linked
const LINK_POOL = 5;              // links are picked at random from this many nearest dots
                                  // (if LINKS_MAX is bigger, the pool grows to match)

/* ---- MOUSE GRAVITY (front dots only) ---- */
const PULL_RADIUS = 160;          // px: dots within this distance of the mouse get pulled
const MAX_PULL = 30;              // px: the most a front dot can move toward the mouse
const PULL_EASE = 0.08;           // 0-1: how fast dots move (lower = floatier, higher = snappier)

/* ---- MOUSE GROW: front dots get bigger as the mouse gets nearer ---- */
const GROW_AMOUNT = 0.6;          // extra size at full effect (0.6 = 60% bigger, 1 = double, 0 = off)
const GROW_RADIUS = 160;          // px: dots within this distance of the mouse start to grow
const GROW_EASE = 0.1;            // 0-1: how fast dots grow and shrink (lower = softer)

/* ---- INTERNAL (rarely needs changing) ---- */
const CULL_MARGIN = LINK_RANGE + 40; // keeps linked front dots alive just off-screen
const FAR_CULL_MARGIN = 40;          // same, for background dots (they have no links)

/* ============================================================
   CODE
   ============================================================ */

// Per-layer settings gathered in one place. "near" = front dots, "far" = background dots.
const LAYERS = {
  near: {
    palette: PALETTE, max: MAX_CIRCLES, every: SPAWN_EVERY_MS, gap: MIN_GAP, grid: GRID_SIZE,
    rMean: RADIUS_MEAN, rSd: RADIUS_SD, rMin: RADIUS_MIN, rMax: RADIUS_MAX,
    parallax: PARALLAX, alphaScale: 1, reactive: true,
    cullMargin: CULL_MARGIN, linked: true,
  },
  far: {
    palette: PALETTE.slice(0, FAR_PALETTE_COUNT), max: FAR_MAX_CIRCLES, every: FAR_SPAWN_EVERY_MS, gap: FAR_MIN_GAP, grid: FAR_GRID_SIZE,
    rMean: FAR_RADIUS_MEAN, rSd: FAR_RADIUS_SD, rMin: FAR_RADIUS_MIN, rMax: FAR_RADIUS_MAX,
    parallax: FAR_PARALLAX, alphaScale: FAR_ALPHA_SCALE, reactive: false,
    cullMargin: FAR_CULL_MARGIN, linked: false,
  },
};
const LAYER_NAMES = Object.keys(LAYERS);

function gaussian(mean = 0, sd = 1) {
  const u = 1 - Math.random();
  const v = Math.random();
  return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

// Random decimal between a and b
const randBetween = (a, b) => a + Math.random() * (b - a);

// Random whole number between a and b, inclusive (a and b may be given in either order)
const randInt = (a, b) => {
  const lo = Math.ceil(Math.min(a, b));
  const hi = Math.floor(Math.max(a, b));
  return lo + Math.floor(Math.random() * (hi - lo + 1));
};

// Picks a hue from the given palette, favoring entries with higher weights
function pickHue(palette) {
  const total = palette.reduce((sum, p) => sum + p.weight, 0);
  let roll = Math.random() * total;
  for (const p of palette) {
    roll -= p.weight;
    if (roll <= 0) return randBetween(p.hue[0], p.hue[1]);
  }
  return randBetween(palette[0].hue[0], palette[0].hue[1]); // safety net
}

// Turns a straight 0-1 value into an eased one, so the pull and grow feel smooth
const smooth = (t) => t * t * (3 - 2 * t);

// 0 at the edge of the radius, rising smoothly to 1 at the center
const falloff = (dist, radius) => smooth(clamp(1 - dist / radius, 0, 1));

// Builds a color string from a dot's own hue, saturation, and lightness
const colorOf = (c, alpha) => `hsla(${c.hue}, ${c.sat}%, ${c.light}%, ${alpha})`;

export default function CircleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let circles = [];
    let nextId = 0;
    let width = 0;
    let height = 0;
    let rafId;
    const lastSpawn = { near: 0, far: 0 };

    // Raw page scroll. Each dot shifts by scroll * its own parallax factor,
    // which is what makes background dots move slower than front dots.
    let scroll = reduceMotion ? 0 : window.scrollY;

    // Mouse position in screen coordinates; active is false until the mouse
    // moves, and again after it leaves the window.
    const mouse = { x: 0, y: 0, active: false };

    const onScroll = () => {
      scroll = window.scrollY;
    };

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const alphaOf = (c, now) =>
      Math.sin(Math.PI * Math.min(1, (now - c.born) / c.life)) * DOT_MAX_ALPHA;

    // A dot's on-screen y when sitting at its home position (no pull applied)
    const homeScreenY = (c) => c.y - scroll * c.parallax;

    // Updates each front dot's pull offset (px, py) and grow amount.
    // Both are measured from the dot's home position, so they don't feed back on themselves.
    const updateMouseEffects = () => {
      for (const c of circles) {
        // Background dots ignore the mouse entirely
        if (!c.reactive) continue;

        let targetX = 0;
        let targetY = 0;
        let targetGrow = 0;

        if (mouse.active) {
          const dx = mouse.x - c.x;
          const dy = mouse.y - homeScreenY(c);
          const dist = Math.hypot(dx, dy);

          if (dist > 0 && dist < PULL_RADIUS) {
            // Never pull a dot past the mouse itself
            const pull = Math.min(MAX_PULL * falloff(dist, PULL_RADIUS), dist);
            targetX = (dx / dist) * pull;
            targetY = (dy / dist) * pull;
          }
          targetGrow = falloff(dist, GROW_RADIUS);
        }

        c.px += (targetX - c.px) * PULL_EASE;
        c.py += (targetY - c.py) * PULL_EASE;
        c.grow += (targetGrow - c.grow) * GROW_EASE;
      }
    };

    const drawDot = (c, alpha) => {
      ctx.beginPath();
      ctx.arc(
        c.x + c.px,
        homeScreenY(c) + c.py,
        c.r * (1 + GROW_AMOUNT * c.grow),
        0,
        Math.PI * 2
      );
      ctx.fillStyle = colorOf(c, alpha * c.alphaScale);
      ctx.fill();
    };

    // Draw order, back to front: background dots, lines, front dots.
    // alphaFor(c) gives a dot's current opacity before its layer scale is applied.
    const draw = (alphaFor) => {
      ctx.clearRect(0, 0, width, height);

      for (const c of circles) {
        if (c.layer === "far") drawDot(c, alphaFor(c));
      }

      ctx.lineWidth = LINE_WIDTH;
      for (const a of circles) {
        for (const b of a.links) {
          // If both dots link to each other, draw that line only once
          if (b.links.includes(a) && b.id < a.id) continue;

          // Lines attach to the dots' current (pulled) positions
          const ax = a.x + a.px;
          const ay = homeScreenY(a) + a.py;
          const bx = b.x + b.px;
          const by = homeScreenY(b) + b.py;

          const alpha = Math.min(alphaFor(a), alphaFor(b)) * LINK_ALPHA;
          const grad = ctx.createLinearGradient(ax, ay, bx, by);
          grad.addColorStop(0, colorOf(a, alpha));
          grad.addColorStop(1, colorOf(b, alpha));
          ctx.strokeStyle = grad;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
      }

      for (const c of circles) {
        if (c.layer === "near") drawDot(c, alphaFor(c));
      }
    };

    const trySpawn = (now, layer) => {
      const L = LAYERS[layer];
      const sameLayer = circles.filter((c) => c.layer === layer);
      if (sameLayer.length >= L.max) return;

      for (let attempt = 0; attempt < 10; attempt++) {
        const cols = Math.ceil(width / L.grid);
        const rows = Math.ceil(height / L.grid);
        const cx = (Math.floor(Math.random() * cols) + 0.5) * L.grid;
        const cy = (Math.floor(Math.random() * rows) + 0.5) * L.grid;
        const jitter = L.grid / 6; // Gaussian jitter around each cell center (higher = messier)

        const r = clamp(gaussian(L.rMean, L.rSd), L.rMin, L.rMax);
        const x = clamp(gaussian(cx, jitter), r, width - r);
        // Pick a spot on screen, then convert to this layer's world space
        const y = clamp(gaussian(cy, jitter), r, height - r) + scroll * L.parallax;

        // Spacing is only checked against dots in the same layer
        const tooClose = sameLayer.some((c) => {
          const dx = c.x - x;
          const dy = c.y - y;
          return Math.hypot(dx, dy) < c.r + r + L.gap;
        });
        if (tooClose) continue;

        const circle = {
          id: nextId++,
          layer,
          x,              // home position (never changes)
          y,
          px: 0,          // current pull offset from home
          py: 0,
          grow: 0,        // current grow amount (0-1, eased)
          r,
          alphaScale: L.alphaScale,
          reactive: L.reactive,
          hue: pickHue(L.palette),
          sat: randBetween(SATURATION_RANGE[0], SATURATION_RANGE[1]),
          light: randBetween(LIGHTNESS_RANGE[0], LIGHTNESS_RANGE[1]),
          born: now,
          life: randBetween(LIFETIME_MS[0], LIFETIME_MS[1]),
          linkTarget: L.linked ? randInt(LINKS_MIN, LINKS_MAX) : 0, // background dots get none
          links: [],
          dead: false,
          parallax: r * FAR_PARALLAX,
        };

        if (L.linked) {
          // Candidates: the nearest few front dots within range
          const pool = sameLayer
            .map((c) => ({ c, d: Math.hypot(c.x - x, c.y - y) }))
            .filter((o) => o.d <= LINK_RANGE)
            .sort((p, q) => p.d - q.d)
            .slice(0, Math.max(LINK_POOL, LINKS_MAX))
            .map((o) => o.c);

          // Pick this dot's own number of links from them at random
          while (circle.links.length < circle.linkTarget && pool.length > 0) {
            const i = Math.floor(Math.random() * pool.length);
            circle.links.push(pool.splice(i, 1)[0]);
          }

          // Older front dots that are below their own target reach for the newcomer
          for (const c of sameLayer) {
            if (
              c.links.length < c.linkTarget &&
              Math.hypot(c.x - x, c.y - y) <= LINK_RANGE
            ) {
              c.links.push(circle);
            }
          }
        }

        circles.push(circle);
        return;
      }
    };

    const frame = (now) => {
      for (const layer of LAYER_NAMES) {
        if (now - lastSpawn[layer] > LAYERS[layer].every) {
          trySpawn(now, layer);
          lastSpawn[layer] = now;
        }
      }

      circles = circles.filter((c) => {
        const off = scroll * c.parallax;
        const margin = LAYERS[c.layer].cullMargin;
        const alive =
          now - c.born < c.life &&
          c.y + c.r > off - margin &&
          c.y - c.r < off + height + margin;
        if (!alive) c.dead = true;
        return alive;
      });
      // Drop links to dots that just disappeared
      for (const c of circles) {
        if (c.links.length) c.links = c.links.filter((l) => !l.dead);
      }

      updateMouseEffects();
      draw((c) => alphaOf(c, now));
      rafId = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) {
      // Static snapshot: no animation, no parallax, no gravity, no grow
      const now = performance.now();
      for (let i = 0; i < 60; i++) trySpawn(now, "near");
      for (let i = 0; i < 60; i++) trySpawn(now, "far");
      draw(() => REDUCED_MOTION_ALPHA);
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", onMouseLeave);
      rafId = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
}

