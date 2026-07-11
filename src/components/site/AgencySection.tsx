import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";

/* Section Agence — « On ne livre pas des sites. On construit des présences. »
   Design : le logo WAY en grand filigrane. Trois piliers. */
const PILLARS = [
  { t: "Stratégie", d: "Avant de toucher au design on comprend. Votre marché, vos clients, ce qui vous différencie. Chaque décision part de là." },
  { t: "Design", d: "Pas de templates. Pas de copier-coller. Chaque site est construit pour vous, autour de vous, avec une direction artistique qui vous ressemble." },
  { t: "Performance", d: "Un site beau qui ne convertit pas est une décoration. On s'assure que le vôtre travaille vraiment." },
];

export default function AgencySection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (REDUCED) { gsap.set([".ag-in", ".ag-pillar"], { opacity: 1, y: 0 }); return; }
      gsap.fromTo(".ag-in", { opacity: 0, y: 34 }, {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.16, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 70%", once: true },
      });
      gsap.fromTo(".ag-pillar", { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.85, stagger: 0.14, ease: "power3.out",
        scrollTrigger: { trigger: ".ag-grid", start: "top 82%", once: true },
      });
      gsap.to(".ag-logo", { yPercent: -12, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    }, root);
    return () => { ctx.revert(); ScrollTrigger.getAll().forEach((s) => { if (s.trigger === el || (s.trigger as Element)?.classList?.contains?.("ag-grid")) s.kill(); }); };
  }, []);

  return (
    <section ref={root} id="agence" className="relative overflow-hidden px-6 py-24 text-center md:px-10 md:py-32">
      {/* design : logo WAY en filigrane */}
      <svg aria-hidden viewBox="0 0 48 48" fill="none"
        className="ag-logo pointer-events-none absolute left-1/2 top-[38%] -z-0 h-[52vh] w-[52vh] max-h-[520px] max-w-[520px] -translate-x-1/2 -translate-y-1/2 text-white opacity-[0.05] will-change-transform">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.4" />
        <path d="M13 17.5 L18.5 31 L24 20 L29.5 31 L35 17.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div className="relative z-10 mx-auto max-w-[1100px]">
        <p className="ag-in type-body text-xs font-semibold uppercase tracking-[0.32em] text-white/70 opacity-0">L'agence</p>
        <h2 className="ag-in type-strong mx-auto mt-5 max-w-3xl opacity-0" style={{ fontSize: "clamp(2rem, 5.2vw, 4rem)" }}>
          On ne livre pas des sites. On construit des présences.
        </h2>
        <p className="ag-in type-body mx-auto mt-7 max-w-2xl text-white/80 opacity-0" style={{ fontSize: "clamp(0.95rem, 2vw, 1.2rem)" }}>
          WAY Agency est une agence web créative basée à Strasbourg. On travaille avec des businesses qui ont quelque chose à dire et qui veulent être entendus.
        </p>

        <div className="ag-grid mt-16 grid grid-cols-1 gap-10 text-left sm:grid-cols-3 md:mt-20 md:gap-8">
          {PILLARS.map((p) => (
            <div key={p.t} className="ag-pillar opacity-0">
              <h3 className="type-strong text-xl text-white md:text-2xl">{p.t}</h3>
              <span className="mt-3 block h-px w-10 bg-white/30" />
              <p className="type-body mt-4 text-sm leading-relaxed text-white/75">{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
