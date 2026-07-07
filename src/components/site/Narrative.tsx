import { useEffect, useRef } from "react";
import { gsap, REDUCED } from "@/lib/gsapSetup";

/* Le récit en quatre temps — section épinglée, scrubée, calée sur chaque
   temps. Typographie seule : Cormorant pour les phrases, rien d'autre. */

type Beat = { kicker: string; l1: string; l2: React.ReactNode; captions: string[] };

const BEATS: Beat[] = [
  {
    kicker: "AVANT",
    l1: "Vous avez un site.",
    l2: (<><em>Personne</em> ne vient.</>),
    captions: ["3 visiteurs aujourd'hui", "0 contact ce mois-ci"],
  },
  {
    kicker: "LE PROBLÈME",
    l1: "Vos visiteurs partent.",
    l2: (<>En <em>silence</em>.</>),
    captions: [],
  },
  {
    kicker: "LA DÉCOUVERTE",
    l1: "Vous découvrez WAY.",
    l2: (<>Et <em>Kairos</em>.</>),
    captions: ["Kairos connecté. Analyse en cours"],
  },
  {
    kicker: "APRÈS",
    l1: "Votre site travaille.",
    l2: (<>Même la nuit.</>),
    captions: ["Nouveau contact reçu", "Rapport Kairos — 3 recommandations", "+47% de visiteurs ce mois"],
  },
];

export default function Narrative() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const beats = gsap.utils.toArray<HTMLElement>(".n-beat");

      if (REDUCED) {
        // no pin: the beats simply stack and fade in
        gsap.set(beats, { position: "relative", opacity: 1, clearProps: "transform" });
        return;
      }

      gsap.set(beats, { opacity: 0, y: 44 });
      gsap.set(beats[0], { opacity: 1, y: 0 }); // first beat (and its captions) visible at rest

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=320%",
          pin: true,
          scrub: 0.6,
          // snap exactly onto each beat's rest label — never mid-transition
          snap: { snapTo: "labels", duration: { min: 0.25, max: 0.7 }, ease: "power2.inOut" },
          anticipatePin: 1,
        },
        defaults: { ease: "power2.inOut" },
      });

      // rest windows at 0 / 3 / 6 / 9, transitions in between
      tl.addLabel("b0", 0);
      for (let i = 1; i < beats.length; i++) {
        const t = i * 3;
        tl.to(beats[i - 1], { opacity: 0, y: -44, duration: 0.8 }, t - 1.8)
          .fromTo(beats[i], { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 0.8 }, t - 1.1)
          .fromTo(
            beats[i].querySelectorAll(".n-cap"),
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.16 },
            t - 0.7
          )
          .addLabel(`b${i}`, t);
      }
      tl.to({}, { duration: 1 }); // hold on the last beat before unpinning
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="story" className="relative flex h-[100svh] items-center justify-center overflow-hidden bg-black">
      {BEATS.map((b, i) => (
        <div key={i} className="n-beat absolute inset-x-0 px-6 text-center will-change-transform">
          <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-white/40">{b.kicker}</p>
          <h2 className="display-serif mx-auto mt-7 max-w-4xl text-white" style={{ fontSize: "clamp(2.7rem, 8vw, 6.4rem)" }}>
            <span className="block">{b.l1}</span>
            <span className="block">{b.l2}</span>
          </h2>
          {b.captions.length > 0 && (
            <div className="mt-10 space-y-2">
              {b.captions.map((c) => (
                <p key={c} className="n-cap text-sm tracking-wide text-white/45">{c}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
