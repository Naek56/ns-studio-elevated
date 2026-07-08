import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";

/* Le storytelling — VERTICAL, chaque temps visible. Révélation au scroll
   (ligne par ligne + légendes en cascade) et chiffre fantôme en parallax. */
type Beat = { kicker: string; l1: string; l2: React.ReactNode; captions: string[] };

const BEATS: Beat[] = [
  { kicker: "AVANT", l1: "Vous avez un site.", l2: (<><em>Personne</em> ne vient.</>), captions: ["3 visiteurs aujourd'hui", "0 contact ce mois-ci"] },
  { kicker: "LE PROBLÈME", l1: "Vos visiteurs partent.", l2: (<>En <em>silence</em>.</>), captions: [] },
  { kicker: "LA DÉCOUVERTE", l1: "Vous découvrez WAY.", l2: (<>Et <em>Kairos</em>.</>), captions: ["Kairos connecté. Analyse en cours"] },
  { kicker: "APRÈS", l1: "Votre site travaille.", l2: (<>Même la nuit.</>), captions: ["Nouveau contact reçu", "Rapport Kairos — 3 recommandations", "+47% de visiteurs ce mois"] },
];

export default function StorySection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (REDUCED) { gsap.set(".st-in", { opacity: 1, y: 0 }); return; }
      gsap.utils.toArray<HTMLElement>(".st-beat").forEach((beat) => {
        gsap.fromTo(
          beat.querySelectorAll(".st-in"),
          { opacity: 0, y: 46 },
          {
            opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out",
            scrollTrigger: { trigger: beat, start: "top 78%", once: true },
          }
        );
        const ghost = beat.querySelector(".st-ghost");
        if (ghost) {
          gsap.fromTo(ghost, { yPercent: 22 }, {
            yPercent: -22, ease: "none",
            scrollTrigger: { trigger: beat, start: "top bottom", end: "bottom top", scrub: true },
          });
        }
      });
    }, root);
    return () => { ctx.revert(); ScrollTrigger.getAll().forEach((s) => { if (root.current?.contains(s.trigger as Node)) s.kill(); }); };
  }, []);

  return (
    <section ref={root} id="story" className="relative overflow-hidden py-10 md:py-16">
      {BEATS.map((b, i) => (
        <div key={i} className="st-beat relative flex min-h-[62svh] items-center justify-center px-6 text-center">
          <span aria-hidden className="st-ghost type-strong pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.07] will-change-transform" style={{ fontSize: "clamp(11rem, 30vw, 26rem)" }}>
            0{i + 1}
          </span>
          <div className="relative max-w-2xl">
            <p className="st-in type-body text-xs font-semibold uppercase tracking-[0.34em] text-white/70">{b.kicker}</p>
            <h2 className="st-in type-strong mt-4" style={{ fontSize: "clamp(1.8rem, 4.6vw, 3.4rem)" }}>
              <span className="block">{b.l1}</span>
              <span className="block">{b.l2}</span>
            </h2>
            {b.captions.length > 0 && (
              <div className="mt-6 space-y-1.5">
                {b.captions.map((c) => (
                  <p key={c} className="st-in type-body text-sm text-white/75">{c}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
