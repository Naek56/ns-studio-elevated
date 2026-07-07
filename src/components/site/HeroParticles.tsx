import { useEffect, useRef } from "react";

/**
 * Featherweight 2D-canvas particle field for the hero: slow-drifting,
 * softly twinkling white dots. ~90 particles desktop / ~45 mobile,
 * DPR-capped, one rAF, static frame under prefers-reduced-motion.
 */
export default function HeroParticles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = { x: number; y: number; r: number; vx: number; vy: number; tw: number; ph: number };
    let dots: P[] = [];

    const seed = () => {
      const count = coarse ? 45 : 90;
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.4,
        vx: (Math.random() - 0.5) * 6,
        vy: -(3 + Math.random() * 7),
        tw: 0.5 + Math.random() * 1.2,
        ph: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      w = r.width; h = r.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!dots.length) seed();
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      ctx.clearRect(0, 0, w, h);
      for (const p of dots) {
        if (!reduced) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
          if (p.x < -4) p.x = w + 4;
          if (p.x > w + 4) p.x = -4;
        }
        const a = 0.14 + 0.2 * (0.5 + 0.5 * Math.sin(t * p.tw + p.ph));
        ctx.beginPath();
        ctx.fillStyle = `rgba(232,240,255,${a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />;
}
