// Isometric "exploded view" of an analytics stack. Bottom to top:
// raw test data → validation → analysis → report. The active layer lifts and
// lights up with its callouts; `explode` (0..1) separates the layers.

const W = 300;
const D = 200;
const T = 10;
const COS = 0.866;
const SIN = 0.5;
const OX = 300;

const iso = (x, y) => [OX + (x - y) * COS, (x + y) * SIN];
const pts = (list) => list.map(([x, y]) => iso(x, y).join(",")).join(" ");
const ISO_MATRIX = `matrix(${COS} ${SIN} ${-COS} ${SIN} ${OX} 0)`;

function Slab({ children }) {
  const [ax, ay] = iso(0, D);
  const [bx, by] = iso(W, D);
  const [cx, cy] = iso(W, 0);
  return (
    <>
      <polygon className="slab-side" points={`${ax},${ay} ${bx},${by} ${bx},${by + T} ${ax},${ay + T}`} />
      <polygon className="slab-side slab-side-r" points={`${bx},${by} ${cx},${cy} ${cx},${cy + T} ${bx},${by + T}`} />
      <polygon className="slab-top" points={pts([[0, 0], [W, 0], [W, D], [0, D]])} />
      <g className="slab-content" transform={ISO_MATRIX}>{children}</g>
    </>
  );
}

function RawLayer() {
  const rows = Array.from({ length: 9 }, (_, r) => r);
  const cols = [14, 74, 134, 194, 244];
  const widths = [48, 50, 46, 40, 40];
  const odd = new Set(["2-3", "6-1", "7-4"]);
  return (
    <Slab>
      {rows.map((r) =>
        cols.map((x, c) => (
          <rect
            key={`${r}-${c}`}
            className={odd.has(`${r}-${c}`) ? "ink-warn" : "ink"}
            x={x}
            y={16 + r * 20}
            width={widths[c] - ((r * 7 + c * 13) % 18)}
            height={6}
            rx={1}
          />
        )),
      )}
    </Slab>
  );
}

function ValidateLayer() {
  const rows = Array.from({ length: 7 }, (_, r) => r);
  const rejected = new Set([2, 5]);
  return (
    <Slab>
      {rows.map((r) => {
        const y = 18 + r * 25;
        const bad = rejected.has(r);
        return (
          <g key={r}>
            <rect className={bad ? "box-warn" : "box-ok"} x={16} y={y} width={12} height={12} rx={2} />
            <rect className={bad ? "ink-dim" : "ink"} x={40} y={y + 3} width={180 - ((r * 29) % 70)} height={6} rx={1} />
            {bad ? <line className="strike" x1={36} x2={236} y1={y + 6} y2={y + 6} /> : null}
          </g>
        );
      })}
      <rect className="ink-signal" x={250} y={18} width={34} height={160} rx={3} opacity="0.18" />
      <rect className="ink-signal" x={250} y={74} width={34} height={104} rx={3} />
    </Slab>
  );
}

function AnalyzeLayer() {
  const curve = Array.from({ length: 40 }, (_, i) => {
    const u = i / 39;
    const v = 1 / (1 + 2.2 * u);
    return [24 + u * 256, 30 + (1 - (v - 0.31) / 0.69) * 140];
  });
  const dots = curve.filter((_, i) => i % 2 === 0).map(([x, y], i) => [x, y + (((i * 37) % 11) - 5) * 1.6]);
  return (
    <Slab>
      <line className="axis" x1={20} y1={180} x2={286} y2={180} />
      <line className="axis" x1={20} y1={180} x2={20} y2={20} />
      {dots.map(([x, y]) => (
        <circle key={`${x}`} className="dot" cx={x} cy={y} r={3} />
      ))}
      <polyline className="fit" points={curve.map((p) => p.join(",")).join(" ")} />
    </Slab>
  );
}

function ReportLayer() {
  const bars = [62, 88, 54, 104, 76, 120];
  return (
    <Slab>
      <rect className="ink" x={16} y={14} width={90} height={8} rx={1} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect className="tile" x={16 + i * 92} y={34} width={82} height={44} rx={4} />
          <rect className={i === 1 ? "ink-signal" : "ink"} x={26 + i * 92} y={46} width={40} height={10} rx={1} />
          <rect className="ink-dim" x={26 + i * 92} y={62} width={56} height={5} rx={1} />
        </g>
      ))}
      {bars.map((h, i) => (
        <rect key={i} className={i === 5 ? "ink-signal" : "ink"} x={22 + i * 30} y={186 - h * 0.85} width={18} height={h * 0.85} rx={1} />
      ))}
      <rect className="tile" x={208} y={92} width={76} height={94} rx={4} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} className="ink-dim" x={218} y={106 + i * 18} width={56 - i * 8} height={5} rx={1} />
      ))}
    </Slab>
  );
}

const LAYERS = [
  { key: "collect", Comp: RawLayer, callouts: ["CAN and CSV test logs", "Weather station data"] },
  { key: "validate", Comp: ValidateLayer, callouts: ["ABNT NBR 10312 checks", "Outliers flagged and removed"] },
  { key: "analyze", Comp: AnalyzeLayer, callouts: ["pandas and NumPy", "F = f0 + f2·v²"] },
  { key: "report", Comp: ReportLayer, callouts: ["Streamlit dashboard", "Standardized PDF report"] },
];

export default function StackVisual({ active = 0, explode = 1 }) {
  const gap = 34 + explode * 84;
  const base = 420;
  const [lx, ly] = iso(0, D);
  const [rx, ry] = iso(W, D);

  return (
    <svg className="stack-visual" viewBox="-170 -40 880 730" role="img" aria-label="Layers of a data analysis workflow: raw data, validation, analysis and report">
      {LAYERS.map(({ key, Comp, callouts }, index) => {
        const isActive = index === active;
        const y = base - index * gap - (isActive ? 22 : 0);
        return (
          <g
            key={key}
            className={`stack-layer${isActive ? " is-active" : ""}${index < active ? " is-below" : ""}`}
            style={{ transform: `translateY(${y}px)` }}
          >
            <Comp />
            <g className="callouts">
              <line className="leader" x1={lx + 30} y1={ly - 20} x2={lx - 10} y2={ly - 60} />
              <circle className="callout-dot" cx={lx - 10} cy={ly - 60} r={3.5} />
              <text className="callout" x={lx - 18} y={ly - 72} textAnchor="end">
                {callouts[0]}
              </text>
              <line className="leader" x1={rx + 20} y1={ry - 4} x2={rx + 64} y2={ry + 26} />
              <circle className="callout-dot" cx={rx + 64} cy={ry + 26} r={3.5} />
              <text className="callout" x={rx + 74} y={ry + 31}>
                {callouts[1]}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
