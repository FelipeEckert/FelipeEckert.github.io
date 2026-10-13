import { useEffect, useRef } from "react";

// Page backdrop: faint contour lines of a slowly drifting 2D field, like a
// contour plot that never quite settles. Drawn with marching squares on a
// coarse grid, throttled, and frozen when the user prefers reduced motion.

const LEVELS = [-0.45, -0.3, -0.15, 0, 0.15, 0.3, 0.45];
const CELL = 28;
const FPS = 24;

function makeNoise(seed = 7) {
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
    let cols = 0;
    let rows = 0;
    let field = new Float32Array(0);
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL) + 1;
      rows = Math.ceil(height / CELL) + 1;
      field = new Float32Array(cols * rows);
    }

    function sample(t) {
      const scale = 0.0016;
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const x = c * CELL * scale;
          const y = r * CELL * scale;
          field[r * cols + c] = noise(x + t * 0.05, y - t * 0.03) + 0.5 * noise(x * 2.1 - t * 0.04, y * 2.1 + 3.7);
        }
      }
    }

    function edge(a, b, level) {
      return (level - a) / (b - a);
    }

    function contours() {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      LEVELS.forEach((level, li) => {
        const major = li === 3;
        ctx.strokeStyle = major ? "rgba(133, 237, 165, 0.13)" : "rgba(149, 144, 137, 0.14)";
        ctx.beginPath();
        for (let r = 0; r < rows - 1; r += 1) {
          for (let c = 0; c < cols - 1; c += 1) {
            const tl = field[r * cols + c];
            const tr = field[r * cols + c + 1];
            const br = field[(r + 1) * cols + c + 1];
            const bl = field[(r + 1) * cols + c];
            const idx = (tl > level ? 8 : 0) | (tr > level ? 4 : 0) | (br > level ? 2 : 0) | (bl > level ? 1 : 0);
            if (idx === 0 || idx === 15) continue;
            const x = c * CELL;
            const y = r * CELL;
            const top = [x + edge(tl, tr, level) * CELL, y];
            const right = [x + CELL, y + edge(tr, br, level) * CELL];
            const bottom = [x + edge(bl, br, level) * CELL, y + CELL];
            const left = [x, y + edge(tl, bl, level) * CELL];
            const seg = (a, b) => {
              ctx.moveTo(a[0], a[1]);
              ctx.lineTo(b[0], b[1]);
            };
            switch (idx) {
              case 1: case 14: seg(left, bottom); break;
              case 2: case 13: seg(bottom, right); break;
              case 3: case 12: seg(left, right); break;
              case 4: case 11: seg(top, right); break;
              case 5: seg(left, top); seg(bottom, right); break;
              case 6: case 9: seg(top, bottom); break;
              case 7: case 8: seg(left, top); break;
              case 10: seg(left, bottom); seg(top, right); break;
              default: break;
            }
          }
        }
        ctx.stroke();
      });
    }

    function loop(now) {
      if (now - last > 1000 / FPS) {
        last = now;
        sample(now / 1000);
        contours();
      }
      frame = requestAnimationFrame(loop);
    }

    function onVisibility() {
      cancelAnimationFrame(frame);
      if (!document.hidden && !reduced) frame = requestAnimationFrame(loop);
    }

    resize();
    sample(0);
    contours();
    if (!reduced) frame = requestAnimationFrame(loop);
    const onResize = () => {
      resize();
      sample(performance.now() / 1000);
      contours();
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="backdrop" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
