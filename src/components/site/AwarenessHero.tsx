import { useEffect, useRef } from "react";
import { gsap, REDUCED } from "@/lib/gsapSetup";

/* Section 1 — « Arrête de regarder ton écran ». Flèches COURBÉES qui se
   dessinent une fois à l'arrivée, puis restent immobiles. */
export default function AwarenessHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      if (REDUCED) {
        gsap.set([".a-title", ".a-sub"], { opacity: 1, y: 0 });
        gsap.set(".a-draw", { strokeDashoffset: 0 });
        return;
      }
      gsap.timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger: root.current, start: "top 72%", once: true } })
        .fromTo(".a-title", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
        .fromTo(".a-sub", { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.5");

      // parallax de sortie
      gsap.to(".a-stage", { yPercent: -14, opacity: 0.12, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
    }, root);

    // dessin des flèches (CSS) déclenché à l'entrée dans la vue
    const sub = root.current.querySelector(".a-sub");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { sub?.classList.add("drawn"); io.disconnect(); } });
    }, { threshold: 0.4 });
    if (sub) io.observe(sub);

    return () => { ctx.revert(); io.disconnect(); };
  }, []);

  // flèche courbée qui se dessine (stroke-dashoffset animé en CSS)
  const Arrow = ({ dir, delay }: { dir: "l" | "r"; delay: number }) => (
    <svg width="104" height="36" viewBox="0 0 120 40" fill="none" aria-hidden
      style={{ transform: dir === "l" ? "scaleX(-1)" : undefined }}>
      <path className="a-draw" d="M8 30 Q 64 6 106 20 M92 8 L112 20 L94 32"
        stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"
        style={{ animationDelay: `${delay}s` }} />
    </svg>
  );

  return (
    <section ref={root} id="reveil" className="relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div aria-hidden className="read-pool pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[92vw] max-w-[1200px] -translate-x-1/2 -translate-y-1/2" />

      <div className="a-stage relative flex flex-col items-center will-change-transform">
        <h1 className="a-title type-strong max-w-4xl opacity-0" style={{ fontSize: "clamp(1.9rem, 5.4vw, 4.2rem)" }}>
          Arrête de regarder ton écran
        </h1>

        <div className="a-sub mt-9 flex flex-col items-center justify-center gap-5 opacity-0 sm:mt-11 sm:flex-row sm:gap-8">
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <Arrow dir="l" delay={0.12} />
            <Arrow dir="l" delay={0} />
          </div>
          <span className="type-body text-base font-medium text-white sm:text-xl">Regarde autour de toi</span>
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <Arrow dir="r" delay={0} />
            <Arrow dir="r" delay={0.12} />
          </div>
        </div>
      </div>
    </section>
  );
}
