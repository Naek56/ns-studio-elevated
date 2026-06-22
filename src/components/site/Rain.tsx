import { useEffect, useRef } from "react";

/**
 * Light star/rain that falls from the top and splashes when it hits the
 * letters of a target element (the hero title). Kept sparse on purpose.
 */
export default function Rain({ targetSelector }: { targetSelector: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    type Drop = { x: number; y: number; vy: number; len: number; a: number };
    type Splash = { x: number; y: number; vx: number; vy: number; life: number; max: number };
    let drops: Drop[] = [];
    const splashes: Splash[] = [];

    const makeDrop = (fromTop = false): Drop => ({
      x: Math.random() * w,
      y: fromTop ? -Math.random() * h : Math.random() * -40,
      vy: 90 + Math.random() * 120,
      len: 10 + Math.random() * 16,
      a: 0.25 + Math.random() * 0.5,
    });

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = coarse ? 18 : Math.min(48, Math.round(w / 32));
      drops = Array.from({ length: count }, () => makeDrop(true));
    };
    resize();
    window.addEventListener("resize", resize);

    const target = document.querySelector(targetSelector) as HTMLElement | null;

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);

      // title impact zone in canvas space
      const cr = canvas.getBoundingClientRect();
      let tTop = -1, tLeft = 0, tRight = 0;
      if (target) {
        const tr = target.getBoundingClientRect();
        tTop = tr.top - cr.top;
        tLeft = tr.left - cr.left;
        tRight = tr.right - cr.left;
      }

      // drops
      for (const d of drops) {
        const prevY = d.y;
        d.y += d.vy * dt;

        const overTitle = tTop > 0 && d.x >= tLeft && d.x <= tRight;
        if (overTitle && prevY < tTop && d.y >= tTop) {
          // splash on the letters
          const n = 3 + Math.floor(Math.random() * 3);
          for (let i = 0; i < n; i++) {
            const ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.7;
            const sp = 30 + Math.random() * 70;
            splashes.push({ x: d.x, y: tTop, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 0.5, max: 0.5 });
          }
          Object.assign(d, makeDrop());
          continue;
        }
        if (d.y - d.len > h) Object.assign(d, makeDrop());

        // draw streak with a glowing head
        const grad = ctx.createLinearGradient(d.x, d.y - d.len, d.x, d.y);
        grad.addColorStop(0, "rgba(200,215,255,0)");
        grad.addColorStop(1, `rgba(210,222,255,${d.a})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y - d.len);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, d.a + 0.25)})`;
        ctx.arc(d.x, d.y, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }

      // splashes
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.life -= dt;
        if (s.life <= 0) { splashes.splice(i, 1); continue; }
        s.vy += 220 * dt; // gravity
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const a = (s.life / s.max) * 0.9;
        ctx.beginPath();
        ctx.fillStyle = `rgba(225,232,255,${a})`;
        ctx.arc(s.x, s.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [targetSelector]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />;
}
