const canvas = document.getElementById("vehicle-data-canvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let deviceScale = 1;
let animationFrame = 0;

const traces = [
  { color: "rgba(125, 211, 199, 0.82)", amplitude: 42, speed: 0.012, offset: 0 },
  { color: "rgba(94, 146, 217, 0.72)", amplitude: 30, speed: 0.017, offset: 80 },
  { color: "rgba(246, 185, 108, 0.62)", amplitude: 24, speed: 0.021, offset: 160 },
];

function resizeCanvas() {
  const bounds = canvas.getBoundingClientRect();
  deviceScale = Math.min(window.devicePixelRatio || 1, 2);
  width = bounds.width;
  height = bounds.height;
  canvas.width = Math.floor(width * deviceScale);
  canvas.height = Math.floor(height * deviceScale);
  ctx.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
}

function drawGrid() {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;

  for (let x = 0; x < width; x += 72) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y < height; y += 72) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function drawTrace(trace, time) {
  const baseline = height * 0.56 + trace.offset * 0.38;
  ctx.beginPath();

  for (let x = -20; x <= width + 20; x += 8) {
    const waveA = Math.sin(x * 0.012 + time * trace.speed);
    const waveB = Math.cos(x * 0.024 + time * trace.speed * 0.64);
    const y = baseline + waveA * trace.amplitude + waveB * trace.amplitude * 0.32;

    if (x === -20) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.strokeStyle = trace.color;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawDataPoints(time) {
  const points = 22;

  for (let index = 0; index < points; index += 1) {
    const progress = index / points;
    const x = width * (0.42 + progress * 0.55);
    const y =
      height * 0.28 +
      Math.sin(time * 0.018 + index * 0.9) * 22 +
      (index % 5) * 36;
    const radius = 2 + (index % 3);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = index % 4 === 0 ? "rgba(246, 185, 108, 0.9)" : "rgba(125, 211, 199, 0.75)";
    ctx.fill();
  }
}

function drawVehicleSilhouette() {
  const carWidth = Math.min(width * 0.34, 430);
  const carHeight = carWidth * 0.28;
  const x = width - carWidth - width * 0.08;
  const y = height * 0.67;

  ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + carWidth * 0.18, y - carHeight * 0.58);
  ctx.lineTo(x + carWidth * 0.42, y - carHeight * 0.82);
  ctx.lineTo(x + carWidth * 0.64, y - carHeight * 0.58);
  ctx.lineTo(x + carWidth * 0.86, y - carHeight * 0.42);
  ctx.lineTo(x + carWidth, y);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x + carWidth * 0.24, y, carHeight * 0.24, 0, Math.PI * 2);
  ctx.arc(x + carWidth * 0.78, y, carHeight * 0.24, 0, Math.PI * 2);
  ctx.stroke();
}

function animate(time) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#101820";
  ctx.fillRect(0, 0, width, height);
  drawGrid();
  traces.forEach((trace) => drawTrace(trace, time));
  drawDataPoints(time);
  drawVehicleSilhouette();
  animationFrame = requestAnimationFrame(animate);
}

resizeCanvas();
animate(0);

window.addEventListener("resize", resizeCanvas);
window.addEventListener("beforeunload", () => cancelAnimationFrame(animationFrame));
