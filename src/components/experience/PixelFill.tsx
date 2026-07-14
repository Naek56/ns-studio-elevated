import { useEffect, useRef } from "react";

/* Transition vers le site de l'agence : écran noir, puis des pixels BLEUS
   (la palette du site agence) envahissent l'écran bloc par bloc. À la fin,
   on navigue — et l'intro pixel du site agence dissout cette mosaïque pour
   révéler le site : les pixels « deviennent » le site. */
export default function PixelFill({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const c = canvas.getContext("2d");
    if (!c) return;

    const finish = () => { if (!fired.current) { fired.current = true; onDone(); } };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth, h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    c.setTransform(dpr, 0, 0, dpr, 0, 0);

    // écran noir immédiat
    c.fillStyle = "#000";
    c.fillRect(0, 0, w, h);

    if (reduced) { window.setTimeout(finish, 350); return; }

    const cell = w < 640 ? 22 : 30;
    const cols = Math.ceil(w / cell);
    const rows = Math.ceil(h / cell);

    // dégradé bleu du site agence + variation par bloc (même mosaïque que
    // l'intro pixel de la page agence)
    const grad = c.createLinearGradient(0, 0, w, h * 0.55);
    grad.addColorStop(0, "#2c4a86");
    grad.addColorStop(0.34, "#3b6ba6");
    grad.addColorStop(0.52, "#4f97c6");
    grad.addColorStop(0.72, "#9db9d6");
    grad.addColorStop(1, "#d5deec");

    const order: number[] = [];
    for (let i = 0; i < cols * rows; i++) order.push(i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }

    const HOLD = 350;    // le noir s'installe
    const DURATION = 1400;
    let start = 0, raf = 0, filled = 0;

    const step = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start - HOLD;
      if (elapsed < 0) { raf = requestAnimationFrame(step); return; }
      const progress = Math.min(1, elapsed / DURATION);
      const eased = progress * progress * (3 - 2 * progress); // smoothstep : ça s'accélère puis se pose
      const target = Math.floor(eased * order.length);
      for (; filled < target; filled++) {
        const idx = order[filled];
        const cx = (idx % cols) * cell;
        const cy = Math.floor(idx / cols) * cell;
        c.save();
        c.beginPath();
        c.rect(cx, cy, cell + 1, cell + 1);
        c.clip();
        c.fillStyle = grad;
        c.fillRect(0, 0, w, h);
        const v = (Math.sin((idx % cols) * 12.9898 + Math.floor(idx / cols) * 78.233) * 43758.5453) % 1;
        const a2 = (Math.abs(v) - 0.5) * 0.14;
        c.fillStyle = a2 >= 0 ? `rgba(255,255,255,${a2})` : `rgba(10,20,45,${-a2})`;
        c.fillRect(cx, cy, cell + 1, cell + 1);
        c.restore();
      }
      if (progress >= 1) { window.setTimeout(finish, 180); return; }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[130]">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
