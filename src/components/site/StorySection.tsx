import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";

/* Le storytelling — un vrai scrollytelling épinglé : chaque temps prend
   tout l'écran, les temps s'enchaînent en fondu au scroll, et une ligne
   en bas montre l'avancement (avec un point par temps). */
type Beat = { kicker: string; l1: string; l2: React.ReactNode; captions: string[] };

const BEATS: Beat[] = [
  { kicker: "AVANT", l1: "Vous avez un site.", l2: (<><em>Personne</em> ne vient.</>), captions: ["3 visiteurs aujourd'hui", "0 contact ce mois-ci"] },
  { kicker: "LE PROBLÈME", l1: "Vos visiteurs partent.", l2: (<>En <em>silence</em>.</>), captions: [] },
  { kicker: "LA DÉCOUVERTE", l1: "Vous découvrez WAY.", l2: (<>Et <em>Kairos</em>.</>), captions: ["Kairos connecté. Analyse en cours"] },
  { kicker: "APRÈS", l1: "Votre site travaille.", l2: (<>Même la nuit.</>), captions: ["Nouveau contact reçu", "Rapport Kairos — 3 recommandations", "+47% de visiteurs ce mois"] },
];

export default function StorySection() {
  const root = useRef<HTMLElement>(null);
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    if (REDUCED) {
      // pas d'épinglage : les temps s'empilent simplement
      gsap.set(".sy-beat", { position: "relative", opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const beats = gsap.utils.toArray<HTMLElement>(".sy-beat");
      const dots = gsap.utils.toArray<HTMLElement>(".sy-dot");
      gsap.set(beats, { opacity: 0, yPercent: 8 });
      gsap.set(beats[0], { opacity: 1, yPercent: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=" + (BEATS.length * 100) + "%",
          pin: true,
          scrub: 0.6,
          snap: { snapTo: "labels", duration: { min: 0.2, max: 0.6 }, ease: "power2.inOut" },
          anticipatePin: 1,
          onUpdate: (self) => {
            if (fill.current) fill.current.style.transform = `scaleX(${self.progress})`;
            const active = Math.min(BEATS.length - 1, Math.round(self.progress * (BEATS.length - 1)));
            dots.forEach((d, i) => d.classList.toggle("sy-on", i <= active));
          },
        },
        defaults: { ease: "power2.inOut" },
      });

      tl.addLabel("b0", 0);
      for (let i = 1; i < beats.length; i++) {
        const t = i * 2;
        tl.to(beats[i - 1], { opacity: 0, yPercent: -8, duration: 0.8 }, t - 1)
          .fromTo(beats[i], { opacity: 0, yPercent: 8 }, { opacity: 1, yPercent: 0, duration: 0.8 }, t - 0.5)
          .addLabel("b" + i, t);
      }
      tl.to({}, { duration: 1 });
    }, root);

    return () => { ctx.revert(); ScrollTrigger.getAll().forEach((s) => { if (s.trigger === el) s.kill(); }); };
  }, []);

  return (
    <section ref={root} id="story" className="relative flex h-[100svh] items-center justify-center overflow-hidden">
      {BEATS.map((b, i) => (
        <div key={i} className={`sy-beat ${REDUCED ? "" : "absolute"} inset-0 flex flex-col items-center justify-center px-6 text-center`}>
          <span aria-hidden className="type-strong pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.06]" style={{ fontSize: "clamp(12rem, 32vw, 28rem)" }}>
            0{i + 1}
          </span>
          <div className="relative max-w-2xl">
            <p className="type-body text-xs font-semibold uppercase tracking-[0.34em] text-white/70">{b.kicker}</p>
            <h2 className="type-strong mt-4" style={{ fontSize: "clamp(1.9rem, 4.8vw, 3.6rem)" }}>
              <span className="block">{b.l1}</span>
              <span className="block">{b.l2}</span>
            </h2>
            {b.captions.length > 0 && (
              <div className="mt-6 space-y-1.5">
                {b.captions.map((c) => (
                  <p key={c} className="type-body text-sm text-white/75">{c}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* ligne d'avancement du storytelling */}
      {!REDUCED && (
        <div className="absolute bottom-10 left-1/2 w-[min(60vw,520px)] -translate-x-1/2">
          <div className="relative h-px w-full bg-white/25">
            <div ref={fill} className="absolute inset-y-0 left-0 w-full origin-left bg-white" style={{ transform: "scaleX(0)" }} />
            {BEATS.map((_, i) => (
              <span key={i} className="sy-dot absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-white/60 bg-[#3b6ba6] transition-colors duration-300"
                style={{ left: `calc(${(i / (BEATS.length - 1)) * 100}% - 4px)` }} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
