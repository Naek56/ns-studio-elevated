import { useEffect, useRef } from "react";

/**
 * Intro « pixel par pixel » aux couleurs du site : un voile reprenant le
 * dégradé bleu du fond, découpé en blocs légèrement nuancés (mosaïque),
 * qui se résolvent bloc par bloc pour révéler le site parfaitement en
 * place. Aucun noir. Fondu rapide si prefers-reduced-motion.
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

    const finish = () => { if (done.current) return; done.current = true; onDone(); };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cell = w < 640 ? 22 : 30;
    const cols = Math.ceil(w / cell);
    const rows = Math.ceil(h / cell);

    // dégradé bleu identique au fond du site (diagonale sombre → clair)
    const grad = ctx.createLinearGradient(0, 0, w, h * 0.55);
    grad.addColorStop(0, "#2c4a86");
    grad.addColorStop(0.34, "#3b6ba6");
    grad.addColorStop(0.52, "#4f97c6");
    grad.addColorStop(0.72, "#9db9d6");
    grad.addColorStop(1, "#d5deec");

    // peint la mosaïque : dégradé + légère variation de luminosité par bloc
    const paintMosaic = () => {
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const v = (Math.sin((c * 12.9898 + r * 78.233)) * 43758.5453) % 1;
          const a = (Math.abs(v) - 0.5) * 0.14; // -0.07..0.07
          ctx.fillStyle = a >= 0 ? `rgba(255,255,255,${a})` : `rgba(10,20,45,${-a})`;
          ctx.fillRect(c * cell, r * cell, cell + 1, cell + 1);
        }
      }
    };
    paintMosaic();

    if (reduced) {
      root.style.transition = "opacity 0.45s ease";
      root.style.opacity = "0";
      const t = window.setTimeout(finish, 480);
      return () => window.clearTimeout(t);
    }

    const order: number[] = [];
    for (let i = 0; i < cols * rows; i++) order.push(i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }

    const DURATION = 1500;
    const HOLD = 220;
    let start = 0, raf = 0, cleared = 0;

    const step = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start - HOLD;
      if (elapsed < 0) { raf = requestAnimationFrame(step); return; }
      const progress = Math.min(1, elapsed / DURATION);
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
