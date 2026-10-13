import { useEffect, useRef } from "react";

// Living dot-matrix backdrop.
// - A fine grid of dots whose brightness drifts with a slow noise field.
// - Two soft "lights" (mint and warm sand) wander across the page and tint the
//   dots they pass over, so the matrix reads as a gradient, not flat grey.
// - A slow diagonal wave sweeps through every few seconds, like a scan.
// - The pointer acts as a soft lamp that warms nearby dots; scrolling shifts the grid slightly
//   slower than the content for depth.
// Everything stays very faint; reduced-motion users get one static frame.

const GAP = 18;
const MINT = [133, 237, 165];
const SAND = [214, 176, 122];
const STONE = [149, 144, 137];

function makeNoise(seed = 11) {
  const perm = new Uint8Array(512);
  const p = Array.from({ length: 256 }, (_, i) => i);
  let s = seed;
  for (let i = 255; i > 0; i -= 1) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i += 1) perm[i] = p[i & 255];
  const grad = (h, x, y) => ((h & 1 ? -x : x) + (h & 2 ? -y : y));
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  return (x, y) => {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);
    const aa = perm[perm[xi] + yi];
    const ab = perm[perm[xi] + yi + 1];
    const ba = perm[perm[xi + 1] + yi];
    const bb = perm[perm[xi + 1] + yi + 1];
    const x1 = grad(aa, xf, yf) + u * (grad(ba, xf - 1, yf) - grad(aa, xf, yf));
    const x2 = grad(ab, xf, yf - 1) + u * (grad(bb, xf - 1, yf - 1) - grad(ab, xf, yf - 1));
    return x1 + v * (x2 - x1);
  };
}

export default function Backdrop() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const noise = makeNoise();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lamp = { x: -9999, y: -9999, tx: -9999, ty: -9999, power: 0, target: 0 };
    let width = 0;
    let height = 0;
    let frame = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function light(t, speed, phase) {
      return [
        width * (0.5 + 0.42 * Math.sin(t * speed + phase)),
        height * (0.5 + 0.38 * Math.sin(t * speed * 1.37 + phase * 2.1)),
      ];
    }

    function draw(ms) {
      const t = ms / 1000;
      lamp.x += (lamp.tx - lamp.x) * 0.08;
      lamp.y += (lamp.ty - lamp.y) * 0.08;
      lamp.power += (lamp.target - lamp.power) * 0.05;
      ctx.clearRect(0, 0, width, height);

      const scroll = window.scrollY * 0.12;
      const offY = -(scroll % GAP);
      const rowShift = Math.floor(scroll / GAP);
      const [mx, my] = light(t, 0.05, 0.4);
      const [sx, sy] = light(t, 0.037, 2.6);
      const reachM = Math.max(width, height) * 0.45;
      const reachS = Math.max(width, height) * 0.4;
      const diag = width + height;
      const sweepPos = ((t * 0.09) % 1.6) * diag - diag * 0.3;

      for (let row = -1; row * GAP < height + GAP; row += 1) {
        const y = row * GAP + offY + GAP / 2;
        for (let col = 0; col * GAP < width + GAP; col += 1) {
          const x = col * GAP + GAP / 2;

          const field = noise(col * 0.07 + t * 0.04, (row + rowShift) * 0.07 - t * 0.03) * 0.5 + 0.5;
          const glowM = Math.max(0, 1 - Math.hypot(x - mx, y - my) / reachM) ** 2;
          const glowS = Math.max(0, 1 - Math.hypot(x - sx, y - sy) / reachS) ** 2;
          const sweep = Math.exp(-(((x + y - sweepPos) / 120) ** 2)) * 0.6;

          const lampDist = Math.hypot(x - lamp.x, y - lamp.y);
          const ripple = lamp.power * Math.max(0, 1 - lampDist / 190) ** 2;

          const vignette = 1 - 0.55 * ((x / width - 0.5) ** 2 + (y / height - 0.5) ** 2) * 2.2;
          const energy = (0.07 + field * 0.13 + glowM * 0.5 + glowS * 0.38 + sweep * 0.22 + ripple * 0.45) * vignette;
          if (energy < 0.03) continue;

          const tintM = Math.min(1, glowM * 1.4 + ripple * 0.9 + sweep * 0.3);
          const tintS = Math.min(1 - tintM, glowS * 1.2);
          const r = STONE[0] + (MINT[0] - STONE[0]) * tintM + (SAND[0] - STONE[0]) * tintS;
          const g = STONE[1] + (MINT[1] - STONE[1]) * tintM + (SAND[1] - STONE[1]) * tintS;
          const b = STONE[2] + (MINT[2] - STONE[2]) * tintM + (SAND[2] - STONE[2]) * tintS;
          const size = 0.9 + field * 0.8 + glowM * 1.3 + glowS * 0.8 + ripple * 1.1;

          ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${Math.min(0.85, energy).toFixed(3)})`;
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }

      if (!reduced) frame = requestAnimationFrame(draw);
    }

    function onPointer(event) {
      if (lamp.x < -9000) {
        lamp.x = event.clientX;
        lamp.y = event.clientY;
      }
      lamp.tx = event.clientX;
      lamp.ty = event.clientY;
      lamp.target = 1;
    }
    function onPointerLeave() {
      lamp.target = 0;
    }

    function onVisibility() {
      cancelAnimationFrame(frame);
      if (!document.hidden && !reduced) frame = requestAnimationFrame(draw);
    }

    resize();
    draw(performance.now());
    if (!reduced) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
    }
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="backdrop" aria-hidden="true" />
      <div className="glow" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
