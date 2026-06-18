"use client";

import * as React from "react";
import { LockKeyhole } from "lucide-react";

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function drawFrame(context: CanvasRenderingContext2D, time: number) {
  const width = context.canvas.width;
  const height = context.canvas.height;
  const progress = (time % 7200) / 7200;
  context.clearRect(0, 0, width, height);

  const background = context.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, "#120810");
  background.addColorStop(0.55, "#2d0a1d");
  background.addColorStop(1, "#071716");
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  context.fillStyle = "rgba(255,255,255,.92)";
  context.font = "600 18px Segoe UI";
  context.fillText("Private number-lock packing", 22, 34);

  const boxX = 96;
  const boxY = 105;
  const boxWidth = 288;
  const boxHeight = 112;
  const lidProgress = Math.min(1, Math.max(0, (progress - 0.3) / 0.22));
  const lockProgress = Math.min(1, Math.max(0, (progress - 0.58) / 0.18));

  context.save();
  context.shadowColor = "rgba(255,40,125,.3)";
  context.shadowBlur = 28;
  roundedRect(context, boxX, boxY, boxWidth, boxHeight, 14);
  context.fillStyle = "#161417";
  context.fill();
  context.strokeStyle = "#f5bb69";
  context.lineWidth = 3;
  context.stroke();
  context.restore();

  if (progress < 0.34) {
    const itemY = 58 + Math.min(1, progress / 0.28) * 90;
    context.save();
    context.translate(240, itemY);
    context.rotate(-0.12);
    roundedRect(context, -42, -18, 84, 36, 18);
    context.fillStyle = "#ff2b7d";
    context.fill();
    context.strokeStyle = "#ff91b9";
    context.lineWidth = 2;
    context.stroke();
    context.restore();
  }

  context.save();
  context.translate(boxX + boxWidth / 2, boxY);
  context.rotate(-1.1 * (1 - lidProgress));
  roundedRect(context, -boxWidth / 2, -18, boxWidth, 34, 12);
  context.fillStyle = "#232126";
  context.fill();
  context.strokeStyle = "#f5bb69";
  context.lineWidth = 3;
  context.stroke();
  context.restore();

  const lockY = 158 - (1 - lockProgress) * 54;
  context.globalAlpha = lockProgress;
  roundedRect(context, 207, lockY, 66, 52, 9);
  context.fillStyle = "#f2b85e";
  context.fill();
  context.strokeStyle = "#ffe1a9";
  context.lineWidth = 2;
  context.stroke();
  context.fillStyle = "#171116";
  context.font = "700 15px ui-monospace";
  context.fillText("3 7 1", 219, lockY + 31);
  context.globalAlpha = 1;

  const captions = [
    ["Your order is placed inside", 0, 0.3],
    ["The discreet box is closed", 0.3, 0.58],
    ["A private number lock is secured", 0.58, 0.83],
    ["Only you receive the combination", 0.83, 1],
  ];
  const caption = captions.find(([, start, end]) => progress >= Number(start) && progress < Number(end))?.[0];
  context.fillStyle = "rgba(255,255,255,.72)";
  context.font = "500 15px Segoe UI";
  context.textAlign = "center";
  context.fillText(String(caption ?? captions[0][0]), width / 2, 252);
  context.textAlign = "start";
}

export function SecurePackingVideo() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    let frame = 0;
    const startedAt = performance.now();

    const animate = (now: number) => {
      drawFrame(context, now - startedAt);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="mt-3 overflow-hidden rounded-md border border-primary/20 bg-[#10080e] shadow-lg">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 text-xs font-semibold text-white">
        <LockKeyhole className="size-4 text-[#f4bd69]" />
        Secure packing preview
      </div>
      <canvas
        ref={canvasRef}
        width={480}
        height={270}
        className="block aspect-video w-full"
        role="img"
        aria-label="Animated packing demonstration showing an order secured in a discreet box with a number lock"
      />
    </div>
  );
}
