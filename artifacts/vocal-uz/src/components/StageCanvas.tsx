import { useEffect, useRef } from "react";

export function StageCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReduced = mq.matches;

    let W = 0, H = 0, CX = 0;
    let time = 0;
    let mX = 0.5, mY = 0.5;
    let rafId = 0;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      W = canvas!.width = Math.round(rect.width);
      H = canvas!.height = Math.round(rect.height);
      CX = W / 2;
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const onMouse = (e: MouseEvent) => {
      mX = e.clientX / (W || 1);
      mY = e.clientY / (H || 1);
    };
    document.addEventListener("mousemove", onMouse);

    type P = { x: number; y: number; vx: number; vy: number; life: number; size: number; red: boolean };

    function makeParticle(init = false): P {
      return {
        x: Math.random() * (W || 1),
        y: init ? Math.random() * (H || 1) : (H || 1) + 5,
        vx: (Math.random() - 0.5) * 0.22,
        vy: -(Math.random() * 0.32 + 0.07),
        life: Math.random() * 0.55 + 0.35,
        size: Math.random() * 1.4 + 0.3,
        red: Math.random() < 0.12,
      };
    }

    let particles: P[] = Array.from({ length: 55 }, () => makeParticle(true));

    function updateParticle(p: P) {
      p.x += p.vx + Math.sin(time * 0.35 + p.y * 0.012) * 0.12;
      p.y += p.vy;
      p.life -= 0.0012;
      if (p.life <= 0 || p.y < -10) Object.assign(p, makeParticle());
    }

    function drawParticle(p: P) {
      const a = Math.max(0, p.life) * 0.5;
      ctx!.fillStyle = p.red
        ? `rgba(232,0,45,${(a * 0.7).toFixed(3)})`
        : `rgba(255,255,255,${(a * 0.16).toFixed(3)})`;
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx!.fill();
    }

    function drawSpotlight(
      tipX: number, tipY: number,
      targetX: number, targetY: number,
      spreadRad: number, alpha: number
    ) {
      const dx = targetX - tipX;
      const dy = targetY - tipY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const baseAngle = Math.atan2(dy, dx);
      const len = dist * 1.65;

      const a1 = baseAngle - spreadRad / 2;
      const a2 = baseAngle + spreadRad / 2;
      const x1 = tipX + Math.cos(a1) * len;
      const y1 = tipY + Math.sin(a1) * len;
      const x2 = tipX + Math.cos(a2) * len;
      const y2 = tipY + Math.sin(a2) * len;

      const gradEndX = tipX + Math.cos(baseAngle) * dist * 1.1;
      const gradEndY = tipY + Math.sin(baseAngle) * dist * 1.1;
      const grad = ctx!.createLinearGradient(tipX, tipY, gradEndX, gradEndY);
      grad.addColorStop(0, `rgba(255,248,220,${(alpha * 3.5).toFixed(3)})`);
      grad.addColorStop(0.45, `rgba(255,248,220,${(alpha * 1.1).toFixed(3)})`);
      grad.addColorStop(1, "rgba(255,248,220,0)");

      ctx!.save();
      ctx!.beginPath();
      ctx!.moveTo(tipX, tipY);
      ctx!.lineTo(x1, y1);
      ctx!.lineTo(x2, y2);
      ctx!.closePath();
      ctx!.fillStyle = grad;
      ctx!.fill();
      ctx!.restore();
    }

    function drawRing(cx: number, cy: number, r0: number, phase: number, color: string, alpha: number) {
      ctx!.save();
      ctx!.globalAlpha = alpha;
      ctx!.strokeStyle = color;
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      const N = 72;
      for (let i = 0; i <= N; i++) {
        const a = (i / N) * Math.PI * 2;
        const wave =
          Math.sin(a * 5 + time * 1.1 + phase) * 3.5 +
          Math.sin(a * 3 - time * 0.65 + phase) * 2.5;
        const r = r0 + wave;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        i === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y);
      }
      ctx!.closePath();
      ctx!.stroke();
      ctx!.restore();
    }

    function drawMic(cx: number, floorY: number): { hx: number; hy: number } {
      const poleH = Math.max(150, H * 0.55);
      const topY = floorY - poleH;
      const capsW = Math.max(9, poleH * 0.088);
      const capsH = Math.max(24, poleH * 0.135);
      const r = capsW / 2;
      const hy = topY + capsH / 2;

      ctx!.save();

      ctx!.globalAlpha = 0.5;
      ctx!.strokeStyle = "rgba(240,238,234,0.65)";
      ctx!.lineWidth = 1.2;
      ctx!.beginPath();
      ctx!.moveTo(cx, floorY);
      ctx!.lineTo(cx, topY + capsH * 0.82);
      ctx!.stroke();

      ctx!.globalAlpha = 0.1;
      ctx!.fillStyle = "rgba(240,238,234,1)";
      ctx!.beginPath();
      ctx!.roundRect(cx - capsW / 2, topY, capsW, capsH, r);
      ctx!.fill();

      ctx!.globalAlpha = 0.5;
      ctx!.strokeStyle = "rgba(240,238,234,0.6)";
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.roundRect(cx - capsW / 2, topY, capsW, capsH, r);
      ctx!.stroke();

      ctx!.globalAlpha = 0.18;
      ctx!.strokeStyle = "rgba(240,238,234,0.45)";
      ctx!.lineWidth = 0.6;
      for (let i = 1; i <= 3; i++) {
        const ly = topY + capsH * (i / 4);
        ctx!.beginPath();
        ctx!.moveTo(cx - r * 0.65, ly);
        ctx!.lineTo(cx + r * 0.65, ly);
        ctx!.stroke();
      }

      ctx!.restore();
      return { hx: cx, hy };
    }

    function drawFloorWave(floorY: number) {
      ctx!.save();
      ctx!.strokeStyle = "#e8002d";
      ctx!.lineWidth = 1.5;
      ctx!.globalAlpha = 0.22;
      ctx!.beginPath();
      const mx = (mX - 0.5) * 45;
      for (let x = 0; x <= W; x += 2) {
        const nx = x / W;
        const env = Math.sin(nx * Math.PI);
        const y =
          floorY +
          Math.sin(nx * 9 + time * 1.4 + mx) * 35 * env +
          Math.sin(nx * 4.5 + time * 0.9) * 18 * env;
        x === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y);
      }
      ctx!.stroke();
      ctx!.restore();
    }

    function drawFloor(floorY: number) {
      ctx!.save();
      ctx!.strokeStyle = "rgba(255,255,255,0.09)";
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.moveTo(0, floorY);
      ctx!.lineTo(W, floorY);
      ctx!.stroke();

      ctx!.strokeStyle = "rgba(255,255,255,0.022)";
      ctx!.lineWidth = 0.5;
      for (let i = 1; i <= 4; i++) {
        const y = floorY + (H - floorY) * (i / 5);
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(W, y);
        ctx!.stroke();
      }
      ctx!.restore();
    }

    function draw() {
      ctx!.fillStyle = "rgba(8,8,8,0.19)";
      ctx!.fillRect(0, 0, W, H);

      const floorY = H * 0.64;
      const sw = Math.sin(time * 0.13);
      const pulse = 0.06 + Math.sin(time * 0.5) * 0.015;

      const tX = CX;
      const tY = H * 0.38;

      drawSpotlight(sw * W * 0.04, -H * 0.02, tX, tY, Math.PI / 5.5, pulse);
      drawSpotlight(W + sw * W * 0.04, -H * 0.02, tX, tY, Math.PI / 5.5, pulse);

      drawFloor(floorY);
      drawFloorWave(floorY);

      const { hx, hy } = drawMic(CX, floorY);

      const rp = 0.55 + Math.sin(time * 0.55) * 0.45;
      drawRing(hx, hy, 24 + Math.sin(time * 0.4) * 2.5, 0, "rgba(255,255,255,0.9)", 0.14 * rp);
      drawRing(hx, hy, 38 + Math.sin(time * 0.33 + 1) * 3.5, 2.1, "rgba(232,0,45,0.9)", 0.19 * rp);
      drawRing(hx, hy, 55 + Math.sin(time * 0.42 + 2) * 4, 4.2, "rgba(255,255,255,0.8)", 0.10 * rp);

      particles.forEach(p => { updateParticle(p); drawParticle(p); });

      const la = 0.015 + Math.sin(time * 0.35) * 0.005;
      ctx!.save();
      ctx!.strokeStyle = `rgba(255,255,255,${la.toFixed(3)})`;
      ctx!.lineWidth = 0.5;
      for (let i = 0; i < 2; i++) {
        const ly = H * 0.28 + i * H * 0.13 + Math.sin(time * 0.18 + i * 1.5) * 5;
        ctx!.beginPath();
        ctx!.moveTo(W * 0.08, ly);
        ctx!.lineTo(W * 0.92, ly);
        ctx!.stroke();
      }
      ctx!.restore();
    }

    const onMqChange = (e: MediaQueryListEvent) => {
      prefersReduced = e.matches;
    };
    mq.addEventListener("change", onMqChange);

    ctx.fillStyle = "#080808";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    time = prefersReduced ? 1.5 : 0;

    function loop() {
      draw();
      if (!prefersReduced) time += 0.01;
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      document.removeEventListener("mousemove", onMouse);
      mq.removeEventListener("change", onMqChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
