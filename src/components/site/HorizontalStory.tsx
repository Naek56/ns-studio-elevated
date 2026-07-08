import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";

/* Le storytelling — mêmes quatre temps qu'avant, mais en défilement
   HORIZONTAL : la section s'épingle et les panneaux glissent latéralement
   à mesure qu'on scrolle verticalement. */
type Beat = { kicker: string; l1: string; l2: React.ReactNode; captions: string[] };

const BEATS: Beat[] = [
  { kicker: "AVANT", l1: "Vous avez un site.", l2: (<><em>Personne</em> ne vient.</>), captions: ["3 visiteurs aujourd'hui", "0 contact ce mois-ci"] },
  { kicker: "LE PROBLÈME", l1: "Vos visiteurs partent.", l2: (<>En <em>silence</em>.</>), captions: [] },
  { kicker: "LA DÉCOUVERTE", l1: "Vous découvrez WAY.", l2: (<>Et <em>Kairos</em>.</>), captions: ["Kairos connecté. Analyse en cours"] },
  { kicker: "APRÈS", l1: "Votre site travaille.", l2: (<>Même la nuit.</>), captions: ["Nouveau contact reçu", "Rapport Kairos — 3 recommandations", "+47% de visiteurs ce mois"] },
];

export default function HorizontalStory() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr) return;

    if (REDUCED) return; // stacked panels, vertical (CSS handles layout)

    const ctx = gsap.context(() => {
      const distance = () => tr.scrollWidth - window.innerWidth;
      const slide = gsap.to(tr, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => "+=" + distance(),
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      // each panel's content rises as it slides into the centre
      gsap.utils.toArray<HTMLElement>(".hs-panel").forEach((panel) => {
        gsap.fromTo(
          panel.querySelectorAll(".hs-in"),
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: panel, containerAnimation: slide, start: "left center", toggleActions: "play none none reverse" },
          }
        );
      });
    }, root);

    return () => { ctx.revert(); ScrollTrigger.getAll().forEach((s) => { if (s.trigger === el) s.kill(); }); };
  }, []);

  return (
    <section ref={root} id="story" className="relative overflow-hidden">
      <div
        ref={track}
        className={REDUCED ? "flex flex-col" : "flex h-[100svh] flex-row flex-nowrap"}
        style={{ willChange: "transform" }}
      >
        {BEATS.map((b, i) => (
          <div key={i} className={`hs-panel relative flex items-center justify-center px-8 ${REDUCED ? "min-h-[100svh] w-full" : "h-[100svh] w-screen flex-none"}`}>
            <div aria-hidden className="read-pool pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[86vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2" />
            <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 select-none type-strong opacity-[0.06]" style={{ fontSize: "clamp(16rem, 40vw, 40rem)" }}>
              0{i + 1}
            </span>
            <div className="relative max-w-3xl text-center">
              <p className="hs-in type-body text-xs font-semibold uppercase tracking-[0.34em] text-white/70">{b.kicker}</p>
              <h2 className="hs-in type-strong mt-6" style={{ fontSize: "clamp(2.4rem, 7vw, 5.6rem)" }}>
                <span className="block">{b.l1}</span>
                <span className="block">{b.l2}</span>
              </h2>
              {b.captions.length > 0 && (
                <div className="mt-8 space-y-1.5">
                  {b.captions.map((c) => (
                    <p key={c} className="hs-in type-body text-sm text-white/75">{c}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
