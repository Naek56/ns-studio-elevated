import { useEffect, useRef } from "react";
import { gsap, REDUCED } from "@/lib/gsapSetup";

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

/* Section Kairos — éditorial sombre : mot fantôme en parallax, rangées
   titre serif / texte, déclaration finale immense. */
export default function KairosSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (REDUCED) {
        gsap.set([".k-head", ".k-row", ".k-close"], { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(".k-head", { opacity: 0, y: 46 }, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".k-head", start: "top 80%", once: true },
      });
      gsap.utils.toArray<HTMLElement>(".k-row").forEach((row) => {
        gsap.fromTo(row.children, { opacity: 0, y: 44 }, {
          opacity: 1, y: 0, duration: 0.95, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 84%", once: true },
        });
      });
      gsap.fromTo(".k-close", { opacity: 0, y: 60 }, {
        opacity: 1, y: 0, duration: 1.15, ease: "power3.out",
        scrollTrigger: { trigger: ".k-close", start: "top 80%", once: true },
      });
      gsap.fromTo(".k-ghost", { y: 120 }, {
        y: -120, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="kairos" className="relative overflow-hidden bg-black py-28 md:py-44">
      <span
        aria-hidden
        className="k-ghost pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap italic leading-none text-white/[0.04] will-change-transform display-serif"
        style={{ fontSize: "clamp(11rem, 30vw, 30rem)" }}
      >
        Kairos
      </span>

      <div className="relative mx-auto max-w-[1100px] px-6 md:px-12">
        <p className="k-head display-serif text-white opacity-0" style={{ fontSize: "clamp(2.4rem, 6vw, 4.8rem)" }}>
          Kairos change ça.
        </p>

        <div className="mt-20 md:mt-28">
          {ROLES.map((r) => (
            <div key={r.t} className="k-row grid grid-cols-1 gap-4 border-t border-white/10 py-12 md:grid-cols-[0.8fr_1.2fr] md:gap-10 md:py-16">
              <h3 className="display-serif italic text-white" style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.8rem)" }}>{r.t}</h3>
              <p className="max-w-xl self-center text-base leading-relaxed text-white/55">{r.d}</p>
            </div>
          ))}
        </div>

        <p className="k-close display-serif mx-auto mt-28 max-w-4xl text-center text-white opacity-0 md:mt-40" style={{ fontSize: "clamp(2.2rem, 5.4vw, 4.4rem)" }}>
          On construit votre site. <em>Kairos le fait performer.</em> Ensemble on fait croître votre business.
        </p>
      </div>
    </section>
  );
}
