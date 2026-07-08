import { useEffect, useRef } from "react";
import { gsap, REDUCED } from "@/lib/gsapSetup";

/* Section Kairos — placée avant le storytelling. Titre fort + les quatre
   rôles (textes conservés tels quels), sur des cartes papier. */
const ROLES = [
  {
    t: "Kairos AI",
    d: "L'intelligence artificielle qui se connecte à votre site et devient le cerveau de votre business. Automatiquement.",
  },
  {
    t: "L'Analyste",
    d: "Observe chaque visiteur de votre site. Clics, scrolls, hésitations. Il comprend le comportement humain derrière chaque donnée.",
  },
  {
    t: "Le Stratège",
    d: "Traduit les données en décisions business. Chaque recommandation a un impact estimé en euros réels.",
  },
  {
    t: "Le Veilleur",
    d: "Surveille votre marché, vos concurrents, votre réputation. Il vous alerte avant que vous en ayez besoin.",
  },
];

export default function KairosIntro() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (REDUCED) {
        gsap.set([".k-head", ".k-card"], { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(".k-head", { opacity: 0, y: 46 }, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".k-head", start: "top 80%", once: true },
      });
      gsap.fromTo(".k-card", { opacity: 0, y: 54 }, {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: ".k-grid", start: "top 78%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="kairos" className="relative overflow-hidden px-6 py-28 text-center md:px-10 md:py-40">
      <div className="mx-auto max-w-[1200px]">
        <div className="k-head mx-auto max-w-4xl opacity-0">
          <p className="type-body text-xs font-semibold uppercase tracking-[0.32em] text-white/70">Le cerveau</p>
          <h2 className="type-strong mt-6" style={{ fontSize: "clamp(2.6rem, 7vw, 5.6rem)" }}>
            Kairos change ça.
          </h2>
        </div>

        <div className="k-grid mx-auto mt-16 grid max-w-[1000px] grid-cols-1 gap-5 sm:grid-cols-2 md:mt-24">
          {ROLES.map((r) => (
            <article
              key={r.t}
              className="k-card relative overflow-hidden rounded-2xl border border-white/15 p-8 text-center opacity-0 md:p-10"
              style={{ background: "rgba(10,20,40,0.32)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
            >
              <h3 className="type-body relative z-10 text-2xl font-semibold text-white md:text-3xl">{r.t}</h3>
              <p className="type-body relative z-10 mx-auto mt-4 max-w-md text-base leading-relaxed text-white/75">{r.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
