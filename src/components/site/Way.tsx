import { useEffect, useRef } from "react";
import { gsap, REDUCED } from "@/lib/gsapSetup";

const ITEMS = [
  { n: "01", t: "Design", d: "Des interfaces épurées, pensées pour mettre en valeur l'essentiel." },
  { n: "02", t: "Performance", d: "Des sites rapides, fluides et optimisés sur tous les écrans." },
  { n: "03", t: "Kairos", d: "Une intelligence qui observe votre marché et anticipe vos visiteurs." },
];

/* Section WAY — colonne gauche sticky (titre), colonne droite qui défile
   (les trois piliers), chiffres fantômes en parallax. */
export default function Way() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (REDUCED) {
        gsap.set([".w-head > *", ".w-item"], { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        ".w-head > *",
        { opacity: 0, y: 46 },
        {
          opacity: 1, y: 0, duration: 1, stagger: 0.14, ease: "power3.out",
          scrollTrigger: { trigger: ".w-head", start: "top 78%", once: true },
        }
      );
      gsap.utils.toArray<HTMLElement>(".w-item").forEach((item) => {
        gsap.fromTo(
          item.querySelectorAll(".w-in"),
          { opacity: 0, y: 54 },
          {
            opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 80%", once: true },
          }
        );
        const ghost = item.querySelector(".w-ghost");
        if (ghost) {
          gsap.fromTo(ghost, { y: 70 }, {
            y: -70, ease: "none",
            scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true },
          });
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="approche" className="relative overflow-hidden bg-white text-black">
      <div className="mx-auto grid max-w-[1300px] grid-cols-1 gap-x-16 px-6 py-28 md:grid-cols-[0.9fr_1.1fr] md:px-12 md:py-44">
        {/* colonne gauche — sticky sur desktop */}
        <div className="w-head md:sticky md:top-32 md:self-start">
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-black/40">Notre approche</p>
          <h2 className="display-serif mt-7 max-w-xl text-black" style={{ fontSize: "clamp(2.6rem, 5.2vw, 4.6rem)" }}>
            On construit des sites qui marquent et qui performent.
          </h2>
        </div>

        {/* colonne droite — les trois piliers */}
        <div className="mt-20 md:mt-0">
          {ITEMS.map((it) => (
            <article key={it.n} className="w-item relative border-t border-black/10 py-20 first:border-t-0 first:pt-6 md:py-28">
              <span
                aria-hidden
                className="w-ghost pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none font-semibold leading-none text-black/[0.045] will-change-transform"
                style={{ fontSize: "clamp(9rem, 22vw, 17rem)" }}
              >
                {it.n}
              </span>
              <div className="relative">
                <p className="w-in text-sm font-medium tabular-nums text-black/35">{it.n}</p>
                <h3 className="w-in display-serif mt-4 text-black" style={{ fontSize: "clamp(2.1rem, 4vw, 3.4rem)" }}>{it.t}</h3>
                <p className="w-in mt-5 max-w-md text-base leading-relaxed text-black/55">{it.d}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
