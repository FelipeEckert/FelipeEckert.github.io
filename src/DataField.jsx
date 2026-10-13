import { useEffect, useRef } from "react";

// A field of digits that plots a vehicle coastdown run: speed decaying from
// 100 km/h to 30 km/h as the car rolls freely. The curve draws itself once on
// load, digits near it light up, and the pointer brightens nearby cells.

const CELL_W = 13;
const CELL_H = 18;
const DRAW_MS = 2200;

const INK = [149, 144, 137];
const CREAM = [242, 237, 228];
const SIGNAL = [133, 237, 165];

// Coastdown speed model: F = f0 + f2·v²  →  v(t) = sqrt(f0/f2)·tan(atan(v0·sqrt(f2/f0)) − t·sqrt(f0·f2)/m)
function coastdownCurve(n) {
  const f0 = 120;
  const f2 = 0.42;
  const m = 1500;
  const v0 = 100 / 3.6;
  const a = Math.sqrt(f0 / f2);
  const b = Math.sqrt(f0 * f2) / m;
  const phi = Math.atan(v0 / a);
  const vEnd = 30 / 3.6;
  const tEnd = (phi - Math.atan(vEnd / a)) / b;
  const points = [];
  for (let i = 0; i < n; i += 1) {
    const t = (i / (n - 1)) * tEnd;
    const v = a * Math.tan(phi - b * t);
    points.push((v - vEnd) / (v0 - vEnd));
  }
  return points;
}

function mix(c1, c2, k) {
  return `rgb(${Math.round(c1[0] + (c2[0] - c1[0]) * k)},${Math.round(c1[1] + (c2[1] - c1[1]) * k)},${Math.round(
    c1[2] + (c2[2] - c1[2]) * k,
  )})`;
}

export default function DataField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cols = 0;
    let rows = 0;
    let curve = [];
    let glyphs = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let start = 0;
    let last = 0;
    const pointer = { x: -9999, y: -9999 };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL_W);
      rows = Math.ceil(height / CELL_H);
      curve = coastdownCurve(cols);
      glyphs = Array.from({ length: cols * rows }, () => Math.floor(Math.random() * 10));
    }

    function curveRow(col) {
      const top = rows * 0.12;
      const bottom = rows * 0.86;
      return bottom - curve[col] * (bottom - top);
    }

    function draw(now) {
      if (!start) start = now;
      const progress = reduced ? 1 : Math.min((now - start) / DRAW_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const headCol = eased * cols;

      ctx.clearRect(0, 0, width, height);
      ctx.font = `12px "Geist Mono", ui-monospace, monospace`;
      ctx.textBaseline = "top";

      if (!reduced && now - last > 90) {
        last = now;
        for (let k = 0; k < 40; k += 1) {
          glyphs[Math.floor(Math.random() * glyphs.length)] = Math.floor(Math.random() * 10);
        }
      }

      for (let c = 0; c < cols; c += 1) {
        const drawn = c <= headCol;
        const cr = curveRow(c);
        const x = c * CELL_W;
        for (let r = 0; r < rows; r += 1) {
          const y = r * CELL_H;
          const dist = Math.abs(r - cr);
          let alpha = 0.07;
          let color = INK;
          let tone = 0;

          if (drawn) {
            if (dist < 0.6) {
              alpha = 0.95;
              color = CREAM;
            } else if (dist < 1.6) {
              alpha = 0.38;
            } else if (r > cr) {
              alpha = 0.12 + 0.1 * Math.max(0, 1 - (r - cr) / (rows * 0.6));
            }
          }

          const dx = x + CELL_W / 2 - pointer.x;
          const dy = y + CELL_H / 2 - pointer.y;
          const near = Math.sqrt(dx * dx + dy * dy);
          if (near < 110) {
            const k = 1 - near / 110;
            alpha = Math.max(alpha, 0.2 + k * 0.7);
            color = SIGNAL;
            tone = k;
          }

          if (Math.abs(c - headCol) < 1 && progress < 1 && dist < 0.6) {
            color = SIGNAL;
            alpha = 1;
          }

          ctx.globalAlpha = alpha;
          ctx.fillStyle = color === SIGNAL ? mix(INK, SIGNAL, Math.max(tone, 0.6)) : mix(color, color, 0);
          ctx.fillText(String(glyphs[c * rows + r]), x, y);
        }
      }
      ctx.globalAlpha = 1;

      if (!reduced) frame = requestAnimationFrame(draw);
    }

    function onMove(event) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    }
    function onLeave() {
      pointer.x = -9999;
      pointer.y = -9999;
    }

    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    let observer;
    if (!reduced && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(([entry]) => {
        cancelAnimationFrame(frame);
        if (entry.isIntersecting) frame = requestAnimationFrame(draw);
      });
      observer.observe(canvas);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <figure className="datafield">
      <canvas ref={canvasRef} aria-hidden="true" />
      <figcaption>
        <span>Coastdown run, 100 to 30 km/h</span>
        <span>F = f0 + f2·v²</span>
      </figcaption>
    </figure>
  );
}
