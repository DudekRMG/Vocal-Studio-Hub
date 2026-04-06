import { useEffect, useRef } from "react";

interface StageCanvasProps {
  className?: string;
  accentColor?: string;
  bgColor?: string;
  spotColorRgb?: string;
  mobileStepMult?: number;
}

export function StageCanvas({
  className,
  accentColor = "#e8002d",
  bgColor = "#080808",
  spotColorRgb = "255,248,220",
  mobileStepMult = 1,
}: StageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReduced = mq.matches;

    let W = 0, H = 0, CX = 0;
    let time = 0;
    let mX = 0.5, mY = 0.5;
    let rafId = 0;
    let lastTs = 0;
    let hidden = document.hidden;

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

    const onVisibility = () => { hidden = document.hidden; };
    document.addEventListener("visibilitychange", onVisibility);

    function hexToRgba(hex: string, alpha: number): string {
      const c = hex.replace("#", "");
      const r = parseInt(c.substring(0, 2), 16);
      const g = parseInt(c.substring(2, 4), 16);
      const b = parseInt(c.substring(4, 6), 16);
      return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
    }

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

    const particles: P[] = Array.from({ length: 22 }, () => makeParticle(true));

    function updateParticle(p: P) {
      p.x += p.vx + Math.sin(time * 0.35 + p.y * 0.012) * 0.12;
      p.y += p.vy;
      p.life -= 0.0012;
      if (p.life <= 0 || p.y < -10) Object.assign(p, makeParticle());
    }

    function drawParticle(p: P) {
      const a = Math.max(0, p.life) * 0.5;
      ctx!.fillStyle = p.red
        ? hexToRgba(accentColor, a * 0.7)
        : `rgba(${spotColorRgb},${(a * 0.16).toFixed(3)})`;
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
      grad.addColorStop(0, `rgba(${spotColorRgb},${(alpha * 3.5).toFixed(3)})`);
      grad.addColorStop(0.45, `rgba(${spotColorRgb},${(alpha * 1.1).toFixed(3)})`);
      grad.addColorStop(1, `rgba(${spotColorRgb},0)`);
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

    function drawSoundWaves() {
      const mx = (mX - 0.5) * 38;
      const myAmp = 1 + (mY - 0.5) * 0.35;

      const isMobile = W < 768;
      type Wave = { y: number; amp: number; freq: number; spd: number; alpha: number; red?: boolean };
      let waves: Wave[];
      if (isMobile) {
        // Mobile: wider spread (mobileStepMult), amplitude 20% larger, base at 62%
        const step = 0.017 * mobileStepMult;
        const aM = 1.20;
        const b = 0.62;
        waves = [
          { y: H * b,              amp: 14 * aM, freq: 7.0, spd: 1.35, alpha: 0.10 },
          { y: H * (b + step),     amp: 22 * aM, freq: 4.0, spd: 0.80, alpha: 0.09, red: true },
          { y: H * (b + step * 2), amp: 18 * aM, freq: 6.0, spd: 1.10, alpha: 0.11 },
          { y: H * (b + step * 3), amp: 24 * aM, freq: 3.5, spd: 0.65, alpha: 0.08 },
          { y: H * (b + step * 4), amp: 20 * aM, freq: 5.5, spd: 0.95, alpha: 0.10, red: true },
        ];
      } else {
        // Desktop: original positions from commit 94cca3ca
        waves = [
          { y: H * 0.53, amp: 14, freq: 7.0, spd: 1.35, alpha: 0.10 },
          { y: H * 0.55, amp: 22, freq: 4.0, spd: 0.80, alpha: 0.09, red: true },
          { y: H * 0.57, amp: 18, freq: 6.0, spd: 1.10, alpha: 0.11 },
          { y: H * 0.59, amp: 24, freq: 3.5, spd: 0.65, alpha: 0.08 },
          { y: H * 0.61, amp: 20, freq: 5.5, spd: 0.95, alpha: 0.10, red: true },
        ];
      }

      waves.forEach(w => {
        ctx!.save();
        ctx!.strokeStyle = w.red ? accentColor : `rgba(${spotColorRgb},1)`;
        ctx!.lineWidth = w.red ? 1.3 : 0.85;
        ctx!.globalAlpha = w.alpha;
        ctx!.beginPath();
        for (let x = 0; x <= W; x += 3) {
          const nx = x / W;
          const env2 = Math.pow(Math.sin(nx * Math.PI), 1.5);
          let y = w.y;
          y += Math.sin(nx * w.freq + time * w.spd + mx) * w.amp * env2 * myAmp;
          y += Math.sin(nx * w.freq * 0.5 + time * w.spd * 0.7) * w.amp * 0.3 * env2;
          y += Math.sin(nx * w.freq * 2.2 + time * w.spd * 1.3) * w.amp * 0.12 * env2;
          x === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y);
        }
        ctx!.stroke();
        ctx!.restore();
      });
    }

    function drawFloorWave(floorY: number) {
      ctx!.save();
      ctx!.strokeStyle = accentColor;
      ctx!.lineWidth = 1.5;
      ctx!.globalAlpha = 0.22;
      ctx!.beginPath();
      const mx = (mX - 0.5) * 45;
      for (let x = 0; x <= W; x += 3) {
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
      ctx!.strokeStyle = `rgba(${spotColorRgb},0.09)`;
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.moveTo(0, floorY);
      ctx!.lineTo(W, floorY);
      ctx!.stroke();
      ctx!.strokeStyle = `rgba(${spotColorRgb},0.022)`;
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
      ctx!.fillStyle = bgColor;
      ctx!.fillRect(0, 0, W, H);

      const isMobile = W < 768;
      // Desktop: original values from commit 94cca3ca; Mobile: improved values
      const floorY  = isMobile ? H * 0.68 : H * 0.64;
      const sw = Math.sin(time * 0.13);
      const pulse = 0.055 + Math.sin(time * 0.5) * 0.012;
      const tX = CX;
      const tY = H * (isMobile ? 0.67 : 0.57);

      const spreadBase = Math.PI / 9 * 1.07 * 1.15 * 1.07 * (isMobile ? 1.3 : 1);
      drawSpotlight(sw * W * 0.04, -H * 0.02, tX, tY, spreadBase, pulse);
      drawSpotlight(W + sw * W * 0.04, -H * 0.02, tX, tY, spreadBase, pulse);

      drawFloor(floorY);
      drawFloorWave(floorY);
      drawSoundWaves();

      particles.forEach(p => { updateParticle(p); drawParticle(p); });
    }

    const onMqChange = (e: MediaQueryListEvent) => { prefersReduced = e.matches; };
    mq.addEventListener("change", onMqChange);

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const TARGET_MS = 1000 / 30;

    function loop(ts: number) {
      rafId = requestAnimationFrame(loop);
      if (hidden) return;
      if (ts - lastTs < TARGET_MS - 2) return;
      lastTs = ts;
      draw();
      if (!prefersReduced) time += 0.018;
    }
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      document.removeEventListener("mousemove", onMouse);
      document.removeEventListener("visibilitychange", onVisibility);
      mq.removeEventListener("change", onMqChange);
    };
  }, [accentColor, bgColor, spotColorRgb, mobileStepMult]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
