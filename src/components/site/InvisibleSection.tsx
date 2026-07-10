import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";

/* Section « invisibilité » — remplace Kairos + le storytelling. Un texte
   fort au centre, entouré de petits motifs (succès réel mais route barrée,
   hors ligne, invisible) discrets, dans l'ombre, sur les côtés. */

const STROKE = { fill: "none", stroke: "#fff", strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function Trophy() {
  return (
    <svg viewBox="0 0 64 64" width="58" height="58" {...STROKE}>
      <path d="M20 12 h24 v10 a12 12 0 0 1 -24 0 z" />
      <path d="M20 15 h-7 a7 7 0 0 0 7 9" />
      <path d="M44 15 h7 a7 7 0 0 1 -7 9" />
      <path d="M32 34 v8" />
      <path d="M24 51 h16 l-2 -9 h-12 z" />
    </svg>
  );
}
function Barrier() {
  // barrière de chantier rayée
  return (
    <svg viewBox="0 0 64 64" width="58" height="58" {...STROKE}>
      <rect x="10" y="24" width="44" height="11" rx="1.5" />
      <path d="M17 35 v18 M47 35 v18" />
      <path d="M14 35 L23 24 M26 35 L35 24 M38 35 L47 24 M50 35 L54 27" />
    </svg>
  );
}
function WifiOff() {
  return (
    <svg viewBox="0 0 64 64" width="58" height="58" {...STROKE}>
      <path d="M13 27 a28 28 0 0 1 38 0" />
      <path d="M21 35 a17 17 0 0 1 22 0" />
      <path d="M28 43 a7 7 0 0 1 8 0" />
      <circle cx="32" cy="49" r="1.6" fill="#fff" stroke="none" />
      <path d="M14 14 L50 50" />
    </svg>
  );
}
function EyeOff() {
  return (
    <svg viewBox="0 0 64 64" width="58" height="58" {...STROKE}>
      <path d="M9 32 C 19 20, 45 20, 55 32 C 45 44, 19 44, 9 32 Z" />
      <circle cx="32" cy="32" r="7" />
      <path d="M13 13 L51 51" />
    </svg>
  );
}

type Motif = { el: React.ReactNode; caption: string; cls: string };
const MOTIFS: Motif[] = [
  // visible aussi sur mobile
  { el: <Trophy />, caption: "Du talent", cls: "left-[5%] top-[5%] scale-90 md:left-[4%] md:top-[16%] md:scale-100 -rotate-3" },
  { el: <Barrier />, caption: "Route barrée", cls: "hidden md:flex md:left-[7%] md:top-[60%] rotate-2" },
  { el: <WifiOff />, caption: "Hors ligne", cls: "hidden md:flex md:right-[5%] md:top-[20%] rotate-3" },
  // visible aussi sur mobile
  { el: <EyeOff />, caption: "Invisible", cls: "right-[5%] bottom-[5%] scale-90 md:right-[6%] md:bottom-auto md:top-[62%] md:scale-100 -rotate-2" },
];

export default function InvisibleSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (REDUCED) {
        gsap.set(".iv-line", { opacity: 1, y: 0 });
        gsap.set(".iv-motif", { opacity: 0.4 });
        return;
      }
      gsap.timeline({ scrollTrigger: { trigger: el, start: "top 62%", once: true }, defaults: { ease: "power3.out" } })
        .fromTo(".iv-motif", { opacity: 0, y: 20 }, { opacity: 0.4, y: 0, duration: 0.9, stagger: 0.1 })
        .fromTo(".iv-line", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.85, stagger: 0.22 }, "-=0.3");
    }, root);
    return () => { ctx.revert(); ScrollTrigger.getAll().forEach((s) => { if (s.trigger === el) s.kill(); }); };
  }, []);

  return (
    <section ref={root} id="invisible" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-24">
      {/* motifs discrets sur les côtés (dans l'ombre) */}
      {MOTIFS.map((m) => (
        <div key={m.caption} className={`iv-motif pointer-events-none absolute flex flex-col items-center gap-2 text-white ${m.cls}`} style={{ opacity: 0 }}>
          {m.el}
          <span className="type-body text-[11px] uppercase tracking-[0.2em] text-white/80">{m.caption}</span>
        </div>
      ))}

      <div aria-hidden className="read-pool pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[92vw] max-w-[1000px] -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <p className="iv-line type-strong opacity-0" style={{ fontSize: "clamp(1.7rem, 4.4vw, 3.2rem)" }}>
          Ces businesses existent dans le monde réel.
        </p>
        <p className="iv-line type-body mx-auto mt-6 max-w-2xl text-white/85 opacity-0" style={{ fontSize: "clamp(1rem, 2.2vw, 1.35rem)" }}>
          Ils ont des clients fidèles. Des produits de qualité. Des années de travail derrière eux.
        </p>
        <p className="iv-line type-strong mt-16 opacity-0 md:mt-28" style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)" }}>
          Mais en ligne, ils sont invisibles.
        </p>
        <p className="iv-line type-strong mt-6 text-white opacity-0" style={{ fontSize: "clamp(1.9rem, 5vw, 3.6rem)" }}>
          Et l'invisibilité coûte cher.
        </p>
      </div>
    </section>
  );
}
