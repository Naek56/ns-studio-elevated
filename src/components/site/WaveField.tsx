import { useEffect, useRef } from "react";

/**
 * Fluid orange ribbon that wanders like waves. Pure 2D canvas (no WebGL).
 * Glowing lines drawn additively on black, with a slow drift so the figure
 * "se balade" across the hero.
 */
export default function WaveField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // toned down: fewer, dimmer, less saturated lines
    const layers = [
      { amp: 0.10, freq: 1.1, speed: 1.0, drift: 0.045, width: 1.8, alpha: 0.6, hue: 24 },
      { amp: 0.07, freq: 1.7, speed: 1.5, drift: 0.060, width: 1.1, alpha: 0.4, hue: 38 },
    ];

    const draw = (time: number) => {
      const t = time * 0.001;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (const L of layers) {
        const baseY = h * 0.52 + Math.sin(t * 0.25 + L.freq) * h * L.drift;
        const amp = h * L.amp;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const p = x / w;
          const y =
            baseY +
            Math.sin(p * Math.PI * 2 * L.freq + t * L.speed) * amp +
            Math.sin(p * Math.PI * 2 * L.freq * 2.3 + t * L.speed * 0.6) * amp * 0.35;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, "hsla(45, 100%, 60%, 0)");
        grad.addColorStop(0.18, `hsla(45, 100%, 60%, ${L.alpha})`);
        grad.addColorStop(0.5, `hsla(${L.hue}, 100%, 55%, ${L.alpha})`);
        grad.addColorStop(0.82, `hsla(4, 90%, 56%, ${L.alpha})`);
        grad.addColorStop(1, "hsla(4, 90%, 56%, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = L.width;
        ctx.lineCap = "round";
        ctx.shadowBlur = 18;
        ctx.shadowColor = `hsla(${L.hue}, 90%, 52%, 0.7)`;
        ctx.stroke();
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.shadowBlur = 0;
      if (!reduced) raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
