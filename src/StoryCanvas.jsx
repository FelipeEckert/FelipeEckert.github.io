import { useEffect, useRef } from "react";

// Scroll-driven story of one coastdown dataset.
// progress 0→1: raw samples with noise and outliers
// progress 1→2: validation removes the outliers and tightens the noise
// progress 2→3: the road-load model is fitted and drawn through the points
// progress 3→4: the result becomes a small report (variability vs the 10% limit)

const STONE = "149,144,137";
const CREAM = "242,237,228";
const SIGNAL = "133,237,165";
const WARN = "232,140,110";

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function speedAt(u) {
  const f0 = 120;
  const f2 = 0.42;
  const m = 1500;
  const a = Math.sqrt(f0 / f2);
  const b = Math.sqrt(f0 * f2) / m;
  const v0 = 100 / 3.6;
  const phi = Math.atan(v0 / a);
  const tEnd = (phi - Math.atan(30 / 3.6 / a)) / b;
  return (a * Math.tan(phi - b * u * tEnd)) * 3.6;
}

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function StoryCanvas({ progressRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rand = seeded(42);
    const samples = Array.from({ length: 70 }, (_, i) => {
      const u = i / 69;
      const outlier = rand() < 0.11;
      return {
        u,
        noise: (rand() - 0.5) * 14,
        spike: outlier ? (rand() < 0.5 ? -1 : 1) * (14 + rand() * 18) : 0,
        jitter: (rand() - 0.5) * 0.01,
        outlier,
      };
    });

    let width = 0;
    let height = 0;
    let frame = 0;
    let shown = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      const target = progressRef.current ?? 0;
      shown += (target - shown) * 0.12;
      const p = shown;

      const clean = ease(clamp(p - 1));
      const fit = ease(clamp(p - 2));
      const report = ease(clamp(p - 3));

      ctx.clearRect(0, 0, width, height);
      ctx.font = `12px "Geist Mono", ui-monospace, monospace`;

      const pad = { l: 46, r: 16, t: 24, b: 34 };
      const narrow = width < 520;
      const chartW = (width - pad.l - pad.r) * (1 - report * (narrow ? 0.5 : 0.42));
      const chartH = height - pad.t - pad.b;
      const x = (u) => pad.l + u * chartW;
      const y = (v) => pad.t + (1 - (v - 20) / (110 - 20)) * chartH;

      // grid and axis labels
      ctx.strokeStyle = `rgba(${STONE},0.14)`;
      ctx.lineWidth = 1;
      ctx.fillStyle = `rgba(${STONE},0.8)`;
      [30, 50, 70, 90, 110].forEach((v) => {
        ctx.beginPath();
        ctx.moveTo(pad.l, y(v));
        ctx.lineTo(pad.l + chartW, y(v));
        ctx.stroke();
        ctx.fillText(String(v), 8, y(v) + 4);
      });
      ctx.fillText("km/h", 8, pad.t - 8);
      ctx.fillText("time →", pad.l + chartW - 52, height - 10);

      // samples
      samples.forEach((s) => {
        const truth = speedAt(s.u);
        const noise = s.noise * (1 - clean * 0.8);
        const v = truth + noise + (s.outlier ? s.spike : 0);
        const px = x(s.u + s.jitter * (1 - clean));
        let alpha = 0.9;
        let color = CREAM;
        let r = 2.6 - fit * 0.8;
        if (s.outlier) {
          color = WARN;
          alpha = p < 1 ? clamp(p * 2) * 0.9 + 0.1 : 0.9 * (1 - clean);
          r = 3 + (1 - clean) * 0.6;
        }
        if (alpha <= 0.01) return;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgb(${color})`;
        ctx.beginPath();
        ctx.arc(px, y(v), r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // fitted curve
      if (fit > 0) {
        ctx.strokeStyle = `rgb(${SIGNAL})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        const steps = 120;
        for (let i = 0; i <= steps * fit; i += 1) {
          const u = i / steps;
          const px = x(u);
          const py = y(speedAt(u));
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.globalAlpha = fit;
        ctx.fillStyle = `rgb(${SIGNAL})`;
        ctx.fillText("F = f0 + f2·v²", x(0.5), y(speedAt(0.5)) - 18);
        ctx.globalAlpha = 1;
      }

      // report panel
      if (report > 0) {
        const left = pad.l + chartW + 28;
        const w = width - left - pad.r;
        ctx.globalAlpha = report;
        ctx.fillStyle = `rgba(${STONE},0.9)`;
        ctx.fillText(narrow ? "Variability" : "Run-to-run variability", left, pad.t + 4);

        const barTop = pad.t + 30;
        const barH = chartH - 60;
        const scale = (cv) => barTop + barH - (cv / 12) * barH;
        const limitY = scale(10);
        const bw = Math.min(56, (w - 18) / 2);

        ctx.fillStyle = `rgba(${STONE},0.55)`;
        const beforeH = (barTop + barH - scale(9)) * report;
        ctx.fillRect(left, barTop + barH - beforeH, bw, beforeH);
        ctx.fillStyle = `rgb(${SIGNAL})`;
        const afterH = (barTop + barH - scale(4.5)) * report;
        ctx.fillRect(left + bw + 18, barTop + barH - afterH, bw, afterH);

        ctx.strokeStyle = `rgba(${WARN},0.9)`;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(left - 6, limitY);
        ctx.lineTo(left + bw * 2 + 24, limitY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = `rgba(${WARN},0.95)`;
        ctx.fillText("10% limit", left, limitY - 8);

        ctx.fillStyle = `rgba(${STONE},0.9)`;
        ctx.fillText("before", left, barTop + barH + 18);
        ctx.fillStyle = `rgb(${SIGNAL})`;
        ctx.fillText(narrow ? "< 5%" : "after < 5%", left + bw + 18, barTop + barH + 18);
        ctx.globalAlpha = 1;
      }

      frame = requestAnimationFrame(draw);
    }

    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [progressRef]);

  return <canvas ref={canvasRef} className="story-canvas" aria-hidden="true" />;
}
