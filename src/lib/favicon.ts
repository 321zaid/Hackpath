"use client";

const FRAMES_COUNT = 12;
const ORBIT_RADIUS = 10;
const TILT_DEG = 45;
type MoveCmd = { cmd: "M" | "L"; x: number; y: number };
type QuadCmd = { cmd: "Q"; x1: number; y1: number; x: number; y: number };
type CloseCmd = { cmd: "Z" };
type Seg = MoveCmd | QuadCmd | CloseCmd;

const SHIELD_PATH: Seg[] = [
  { cmd: "M", x: 16, y: 3 } as MoveCmd,
  { cmd: "L", x: 27, y: 8 } as MoveCmd,
  { cmd: "L", x: 27, y: 19 } as MoveCmd,
  { cmd: "Q", x1: 27, y1: 26, x: 16, y: 30 } as QuadCmd,
  { cmd: "Q", x1: 5, y1: 26, x: 5, y: 19 } as QuadCmd,
  { cmd: "L", x: 5, y: 8 } as MoveCmd,
  { cmd: "Z" } as CloseCmd,
];

let cachedFrames: string[] | null = null;

function drawShield(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.strokeStyle = "#00FF41";
  ctx.lineWidth = 1.2;
  for (const seg of SHIELD_PATH) {
    switch (seg.cmd) {
      case "M":
        ctx.moveTo((seg as MoveCmd).x, (seg as MoveCmd).y);
        break;
      case "L":
        ctx.lineTo((seg as MoveCmd).x, (seg as MoveCmd).y);
        break;
      case "Q": {
        const q = seg as QuadCmd;
        ctx.quadraticCurveTo(q.x1, q.y1, q.x, q.y);
        break;
      }
      case "Z":
        ctx.closePath();
        break;
    }
  }
  ctx.stroke();
}

function drawOrb(ctx: CanvasRenderingContext2D, angle: number, cx: number, cy: number) {
  const tiltRad = (TILT_DEG * Math.PI) / 180;
  const localX = ORBIT_RADIUS * Math.sin(angle);
  const localY = -ORBIT_RADIUS * Math.cos(angle);
  const gx = cx + localX * Math.cos(tiltRad) - localY * Math.sin(tiltRad);
  const gy = cy + localX * Math.sin(tiltRad) + localY * Math.cos(tiltRad);

  ctx.shadowColor = "rgba(255,255,255,0.4)";
  ctx.shadowBlur = 4;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(gx, gy, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

export function generateFaviconFrames(): string[] {
  if (cachedFrames) return cachedFrames;

  const size = 32;
  const frames: string[] = [];

  for (let i = 0; i < FRAMES_COUNT; i++) {
    const angle = (i / FRAMES_COUNT) * Math.PI * 2;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, size, size);

    drawShield(ctx);
    drawOrb(ctx, angle, size / 2, size / 2);

    frames.push(canvas.toDataURL());
  }

  cachedFrames = frames;
  return frames;
}
