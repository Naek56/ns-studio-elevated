import { useEffect, useRef } from "react";

/**
 * Light star/rain that falls from the top and splashes only when it actually
 * hits a letter of the target lines. Collision uses a pixel mask built from
 * the real glyphs, so drops never burst above or beside the letters.
 */
export default function Rain({ lineSelectors }: { lineSelectors: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    // offscreen mask of the title glyphs (CSS-pixel resolution)
    const mask = document.createElement("canvas");
    const mctx = mask.getContext("2d", { willReadFrequently: true })!;
    let alpha: Uint8ClampedArray | null = null;
    let lastSig = "";
    let lastBuild = 0;

    const buildMask = () => {
      if (!w || !h) return;
      mask.width = w; mask.height = h;
      mctx.clearRect(0, 0, w, h);
      mctx.fillStyle = "#fff";
      mctx.textAlign = "center";
      mctx.textBaseline = "alphabetic";
      const cr = canvas.getBoundingClientRect();
      for (const sel of lineSelectors) {
        const el = document.querySelector(sel) as HTMLElement | null;
        const text = el?.textContent?.trim();
        if (!el || !text) continue;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const fs = parseFloat(cs.fontSize);
        mctx.font = `${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
        try { (mctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = `${-0.02 * fs}px`; } catch { /* noop */ }
        const m = mctx.measureText(text);
        const asc = m.actualBoundingBoxAscent || fs * 0.72;
        const desc = m.actualBoundingBoxDescent || fs * 0.2;
        const cx = r.left - cr.left + r.width / 2;
        const top = r.top - cr.top;
        const baseline = top + (r.height - (asc + desc)) / 2 + asc;
        mctx.fillText(text, cx, baseline);
      }
      alpha = mctx.getImageData(0, 0, w, h).data;
    };

    type Drop = { x: number; y: number; vy: number; len: number; a: number };
    type Splash = { x: number; y: number; vx: number; vy: number; life: number; max: number };
    let drops: Drop[] = [];
    const splashes: Splash[] = [];

    const makeDrop = (spread = false): Drop => ({
      x: Math.random() * w,
      // spread = fill the whole visible height immediately (no empty start);
      // otherwise respawn just above the top edge
      y: spread ? Math.random() * h : -Math.random() * 40 - 6,
      vy: 90 + Math.random() * 120,
      len: 9 + Math.random() * 15,
      a: 0.25 + Math.random() * 0.5,
    });

    const hitMask = (x: number, y: number) => {
      if (!alpha || x < 0 || y < 0 || x >= w || y >= h) return false;
      return alpha[((y | 0) * w + (x | 0)) * 4 + 3] > 60;
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      w = r.width; h = r.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = coarse ? 20 : Math.min(46, Math.round(w / 34));
      if (drops.length === 0) {
        drops = Array.from({ length: count }, () => makeDrop(true));
      } else {
        // keep falling drops, just adapt the count and clamp into the new width
        while (drops.length < count) drops.push(makeDrop(true));
        if (drops.length > count) drops.length = count;
        for (const d of drops) if (d.x > w) d.x = Math.random() * w;
      }
      buildMask();
    };

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // rebuild the glyph mask when the rotating word changes (throttled)
      const sig = lineSelectors.map((s) => document.querySelector(s)?.textContent).join("|");
      if (sig !== lastSig && now - lastBuild > 140) { lastSig = sig; lastBuild = now; buildMask(); }

      ctx.clearRect(0, 0, w, h);

      for (const d of drops) {
        const prevY = d.y;
        d.y += d.vy * dt;

        // sample along the fall path so fast drops can't skip a thin glyph
        let hit = false, hx = d.x, hy = d.y;
        const steps = Math.max(1, Math.ceil((d.y - prevY) / 3));
        for (let s = 1; s <= steps; s++) {
          const yy = prevY + ((d.y - prevY) * s) / steps;
          if (hitMask(d.x, yy)) { hit = true; hy = yy; break; }
        }
        if (hit) {
          const n = 4 + Math.floor(Math.random() * 3);
          for (let i = 0; i < n; i++) {
            const ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.9;
            const sp = 35 + Math.random() * 75;
            splashes.push({ x: hx, y: hy, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 0.5, max: 0.5 });
          }
          Object.assign(d, makeDrop());
          continue;
        }
        if (d.y - d.len > h) { Object.assign(d, makeDrop()); continue; }

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

      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.life -= dt;
        if (s.life <= 0) { splashes.splice(i, 1); continue; }
        s.vy += 240 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const a = (s.life / s.max) * 0.95;
        ctx.beginPath();
        ctx.fillStyle = `rgba(228,234,255,${a})`;
        ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);
    document.addEventListener("fullscreenchange", resize);
    // robustly catch any size change (fullscreen, mobile UI bars, layout)
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
    // fonts must be ready for the glyph mask to be accurate
    (document as Document & { fonts?: FontFaceSet }).fonts?.ready.then(buildMask).catch(() => {});
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
      document.removeEventListener("fullscreenchange", resize);
      ro.disconnect();
    };
  }, [lineSelectors]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-[15] h-full w-full" />;
}
