import { useEffect, useRef } from "react";

/**
 * Intro « pixel par pixel » : un écran noir plein cadre qui se dissout en
 * petits blocs (ordre aléatoire) pour révéler le site en dessous, puis
 * disparaît. Fondu rapide si prefers-reduced-motion.
 */
export default function PixelIntro({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const finish = () => {
      if (done.current) return;
      done.current = true;
      onDone();
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // fill black, then erase blocks to reveal the page behind
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);

    if (reduced) {
      root.style.transition = "opacity 0.45s ease";
      root.style.opacity = "0";
      const t = window.setTimeout(finish, 480);
      return () => window.clearTimeout(t);
    }

    const cell = w < 640 ? 20 : 26;
    const cols = Math.ceil(w / cell);
    const rows = Math.ceil(h / cell);
    const order: number[] = [];
    for (let i = 0; i < cols * rows; i++) order.push(i);
    // Fisher–Yates shuffle (index-varied, no Math.random dependency for seed)
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }

    const DURATION = 1500; // ms
    const HOLD = 260; // brief black hold before dissolving
    let start = 0;
    let raf = 0;
    let cleared = 0;

    const step = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start - HOLD;
      if (elapsed < 0) { raf = requestAnimationFrame(step); return; }
      const progress = Math.min(1, elapsed / DURATION);
      // ease-out so it accelerates then settles
      const eased = 1 - Math.pow(1 - progress, 3);
      const target = Math.floor(eased * order.length);
      for (; cleared < target; cleared++) {
        const idx = order[cleared];
        const cx = (idx % cols) * cell;
        const cy = Math.floor(idx / cols) * cell;
        ctx.clearRect(cx, cy, cell + 1, cell + 1);
      }
      if (progress >= 1) {
        ctx.clearRect(0, 0, w, h);
        root.style.transition = "opacity 0.25s ease";
        root.style.opacity = "0";
        window.setTimeout(finish, 260);
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div ref={rootRef} className="fixed inset-0 z-[120]" style={{ pointerEvents: "none" }}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
