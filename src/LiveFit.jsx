import { useEffect, useRef } from "react";

// Hero visual: a model being fitted live.
// Measured points from a coastdown run arrive one by one, a straight-line
// first guess bends into the fitted road-load curve, residuals shrink and R²
// climbs. Then it holds, fades and runs again. Hovering reads the model value.

const CREAM = "242,237,228";
const STONE = "149,144,137";
const SIGNAL = "133,237,165";
const LOOP = 11;

function speedAt(u) {
  const f0 = 120;
  const f2 = 0.42;
  const m = 1500;
  const a = Math.sqrt(f0 / f2);
  const b = Math.sqrt(f0 * f2) / m;
  const v0 = 100 / 3.6;
  const phi = Math.atan(v0 / a);
  const tEnd = (phi - Math.atan(30 / 3.6 / a)) / b;
  return a * Math.tan(phi - b * u * tEnd) * 3.6;
}
const DURATION_S = 38;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

export default function LiveFit() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const points = Array.from({ length: 34 }, (_, i) => {
      const u = i / 33;
      const noise = Math.sin(i * 7.31) * 2.2 + Math.cos(i * 3.17) * 1.4;
      return { u, v: speedAt(u) + noise };
    });
    const hover = { x: -1, y: -1, on: false };
    let width = 0;
    let height = 0;
    let frame = 0;
    let start = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(now) {
      if (!start) start = now;
      const t = reduced ? 8 : ((now - start) / 1000) % LOOP;

      const pad = { l: 52, r: 24, t: 56, b: 44 };
      const w = width - pad.l - pad.r;
      const h = height - pad.t - pad.b;
      const X = (u) => pad.l + u * w;
      const Y = (v) => pad.t + (1 - (v - 20) / 90) * h;

      const arrive = clamp(t / 2.6);
      const fit = easeOut(clamp((t - 2.8) / 2.8));
      const fadeOut = clamp((t - (LOOP - 0.9)) / 0.9);
      const alpha = 1 - fadeOut;

      ctx.clearRect(0, 0, width, height);
      ctx.font = `12px "Geist Mono", ui-monospace, monospace`;

      // grid
      ctx.lineWidth = 1;
      [30, 50, 70, 90, 110].forEach((v) => {
        ctx.strokeStyle = `rgba(${STONE},0.12)`;
        ctx.beginPath();
        ctx.moveTo(pad.l, Y(v));
        ctx.lineTo(pad.l + w, Y(v));
        ctx.stroke();
        ctx.fillStyle = `rgba(${STONE},0.75)`;
        ctx.fillText(String(v), pad.l - 30, Y(v) + 4);
      });
      [0, 10, 20, 30].forEach((s) => {
        ctx.fillStyle = `rgba(${STONE},0.75)`;
        ctx.fillText(`${s}s`, X(s / DURATION_S) - 6, pad.t + h + 22);
      });
      ctx.fillText("speed, km/h", pad.l - 30, pad.t - 22);

      ctx.globalAlpha = alpha;

      // model: straight first guess bending into the fitted curve
      const model = (u) => {
        const guess = 100 - 70 * u;
        return guess + (speedAt(u) - guess) * fit;
      };

      // residuals
      const shown = Math.floor(arrive * points.length);
      if (fit > 0) {
        ctx.strokeStyle = `rgba(${STONE},${0.35 * (1 - fit * 0.6)})`;
        for (let i = 0; i < shown; i += 1) {
          const p = points[i];
          ctx.beginPath();
          ctx.moveTo(X(p.u), Y(p.v));
          ctx.lineTo(X(p.u), Y(model(p.u)));
          ctx.stroke();
        }
      }

      // points
      for (let i = 0; i < shown; i += 1) {
        const p = points[i];
        const age = clamp(arrive * points.length - i);
        ctx.fillStyle = `rgba(${CREAM},${0.9 * age})`;
        ctx.beginPath();
        ctx.arc(X(p.u), Y(p.v), 2.2 + (1 - age) * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // model line
      if (t > 2.6) {
        ctx.strokeStyle = `rgb(${SIGNAL})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 120; i += 1) {
          const u = i / 120;
          if (i === 0) ctx.moveTo(X(u), Y(model(u)));
          else ctx.lineTo(X(u), Y(model(u)));
        }
        ctx.stroke();
        ctx.lineWidth = 1;
      }

      // readout
      const sse = points.reduce((acc, p) => acc + (p.v - model(p.u)) ** 2, 0);
      const mean = points.reduce((acc, p) => acc + p.v, 0) / points.length;
      const sst = points.reduce((acc, p) => acc + (p.v - mean) ** 2, 0);
      const r2 = t > 2.6 ? clamp(1 - sse / sst) : 0;
      ctx.textAlign = "right";
      ctx.fillStyle = t > 2.6 ? `rgb(${SIGNAL})` : `rgba(${STONE},0.6)`;
      ctx.font = `500 15px "Geist Mono", ui-monospace, monospace`;
      ctx.fillText(t > 2.6 ? `R² ${r2.toFixed(3)}` : "R² —", pad.l + w, pad.t - 22);
      ctx.font = `12px "Geist Mono", ui-monospace, monospace`;
      ctx.fillStyle = `rgba(${STONE},0.8)`;
      const status = t < 2.6 ? "collecting samples" : fit < 0.98 ? "fitting model" : "model converged";
      ctx.fillText(status, pad.l + w, pad.t - 4);
      ctx.textAlign = "left";

      // hover readout
      if (hover.on && fit > 0.9) {
        const u = clamp((hover.x - pad.l) / w);
        const v = model(u);
        ctx.strokeStyle = `rgba(${STONE},0.4)`;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(X(u), pad.t);
        ctx.lineTo(X(u), pad.t + h);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = `rgb(${SIGNAL})`;
        ctx.beginPath();
        ctx.arc(X(u), Y(v), 4, 0, Math.PI * 2);
        ctx.fill();
        const label = `${(u * DURATION_S).toFixed(1)}s · ${v.toFixed(1)} km/h`;
        const right = X(u) > pad.l + w - 150;
        ctx.textAlign = right ? "right" : "left";
        ctx.fillStyle = `rgb(${CREAM})`;
        ctx.fillText(label, X(u) + (right ? -10 : 10), Y(v) - 10);
        ctx.textAlign = "left";
      }

      ctx.globalAlpha = 1;
      if (!reduced) frame = requestAnimationFrame(draw);
    }

    function onMove(event) {
      const rect = canvas.getBoundingClientRect();
      hover.x = event.clientX - rect.left;
      hover.y = event.clientY - rect.top;
      hover.on = true;
      if (reduced) draw(performance.now());
    }
    function onLeave() {
      hover.on = false;
      if (reduced) draw(performance.now());
    }

    resize();
    frame = requestAnimationFrame(draw);
    const onResize = () => {
      resize();
      if (reduced) draw(performance.now());
    };
    window.addEventListener("resize", onResize);
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
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <figure className="livefit">
      <canvas ref={canvasRef} aria-hidden="true" />
      <figcaption>
        <span>Coastdown run, road-load model fitted to measured speed</span>
        <span>F = f0 + f2·v²</span>
      </figcaption>
    </figure>
  );
}
