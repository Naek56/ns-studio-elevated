import { useEffect, useRef } from "react";

/**
 * Curseur personnalisé (desktop / pointeur fin) : un anneau qui suit la
 * souris avec inertie + un point net au centre. Masque le curseur natif,
 * grossit au survol des éléments interactifs. mix-blend pour rester
 * visible sur le fond bleu clair comme sombre.
 */
export default function CursorFollower() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // n'active le curseur perso (et le masquage du natif) que là où il
    // s'affiche réellement : grand écran + pointeur fin
    if (!window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return;

    document.documentElement.classList.add("cursor-none");
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my, scale = 1, targetScale = 1;
    let raf = 0;

    const move = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      targetScale = t.closest("a,button,[data-cursor]") ? 2.2 : 1;
    };
    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      scale += (targetScale - scale) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${scale})`;
      if (dot.current) dot.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      document.documentElement.classList.remove("cursor-none");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="custom-cursor pointer-events-none fixed inset-0 z-[80] hidden mix-blend-difference lg:block">
      <div ref={ring} className="absolute left-0 top-0 h-10 w-10 rounded-full border border-white/80" style={{ willChange: "transform" }} />
      <div ref={dot} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white" style={{ willChange: "transform" }} />
    </div>
  );
}
