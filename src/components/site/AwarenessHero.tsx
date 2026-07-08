import { useEffect, useRef } from "react";
import { gsap, REDUCED } from "@/lib/gsapSetup";

/* Accueil / Section 1 — le hook. Titre fort (Poppins/dégradé) + sous-ligne
   Work Sans encadrée de deux flèches qui pointent vers les bords de l'écran. */
export default function AwarenessHero({ play }: { play: boolean }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      if (REDUCED) {
        gsap.set([".a-title", ".a-sub"], { opacity: 1, y: 0 });
        return;
      }
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      tl.fromTo(".a-title", { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 })
        .fromTo(".a-sub", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.5")
        .fromTo(".a-arrow-l", { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, "-=0.7")
        .fromTo(".a-arrow-r", { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, "<");
      // continuous outward nudge on the arrows
      gsap.to(".a-arrow-l", { x: -10, repeat: -1, yoyo: true, duration: 1.1, ease: "sine.inOut" });
      gsap.to(".a-arrow-r", { x: 10, repeat: -1, yoyo: true, duration: 1.1, ease: "sine.inOut" });
      if (play) tl.play();
      return () => { tl.kill(); };
    }, root);
    return () => ctx.revert();
  }, [play]);

  // une grande flèche blanche (doublée par côté pour un effet « chevrons »)
  const Arrow = ({ dir }: { dir: "l" | "r" }) => (
    <svg
      className={dir === "l" ? "a-arrow-l" : "a-arrow-r"}
      width="120" height="34" viewBox="0 0 120 34" fill="none"
      style={{ transform: dir === "l" ? "scaleX(-1)" : undefined }}
      aria-hidden
    >
      <path d="M4 17 H108 M92 5 L112 17 L92 29" stroke="#ffffff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <section ref={root} id="accueil" className="relative flex h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div aria-hidden className="read-pool pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[92vw] max-w-[1200px] -translate-x-1/2 -translate-y-1/2" />

      <h1 className="a-title type-strong relative max-w-5xl opacity-0" style={{ fontSize: "clamp(2.6rem, 8.5vw, 7rem)" }}>
        Arrête de regarder ton écran
      </h1>

      <div className="a-sub relative mt-12 flex flex-col items-center justify-center gap-6 opacity-0 sm:mt-14 sm:flex-row sm:gap-10">
        <div className="flex items-center gap-2 sm:gap-3">
          <Arrow dir="l" />
          <Arrow dir="l" />
        </div>
        <span className="type-body text-xl font-medium text-white sm:text-3xl">Regarde autour de toi</span>
        <div className="flex items-center gap-2 sm:gap-3">
          <Arrow dir="r" />
          <Arrow dir="r" />
        </div>
      </div>

      <span className="type-body absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.32em] text-white/70">
        Défiler
      </span>
    </section>
  );
}
