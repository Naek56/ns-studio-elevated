import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";

/* Section « invisibilité » — remplace Kairos + le storytelling. Un texte
   fort au centre, entouré de petits motifs (succès réel mais route barrée,
   hors ligne, invisible) discrets, dans l'ombre, sur les côtés. */

const STROKE = { fill: "none", stroke: "#fff", strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function Trophy() {
  return (
    <svg viewBox="0 0 80 80" width="60" height="60" {...STROKE}>
      <path d="M26 16 h28 v10 a14 14 0 0 1 -28 0 z" />
      <path d="M26 20 h-8 a8 8 0 0 0 8 10 M54 20 h8 a8 8 0 0 1 -8 10" />
      <path d="M40 40 v10 M32 58 h16 M36 50 h8" />
    </svg>
  );
}
function RoadBlocked() {
  return (
    <svg viewBox="0 0 80 80" width="60" height="60" {...STROKE}>
      <path d="M22 74 L34 30 M58 74 L46 30" />
      <path d="M40 70 L40 40" strokeDasharray="3 7" />
      <rect x="26" y="34" width="28" height="7" rx="1" />
      <path d="M30 34 v12 M50 34 v12" />
    </svg>
  );
}
function OfflinePin() {
  return (
    <svg viewBox="0 0 80 80" width="58" height="58" {...STROKE}>
      <path d="M40 18 a14 14 0 0 1 14 14 c0 11 -14 26 -14 26 c0 0 -14 -15 -14 -26 a14 14 0 0 1 14 -14 z" />
      <circle cx="40" cy="32" r="4" />
      <path d="M20 20 L60 60" />
    </svg>
  );
}
function Invisible() {
  return (
    <svg viewBox="0 0 80 80" width="60" height="60" {...STROKE}>
      <path d="M14 40 C 24 26, 56 26, 66 40 C 56 54, 24 54, 14 40 Z" strokeDasharray="4 6" />
      <circle cx="40" cy="40" r="8" strokeDasharray="3 5" />
      <path d="M18 20 L62 60" />
    </svg>
  );
}

type Motif = { el: React.ReactNode; caption: string; pos: string };
const MOTIFS: Motif[] = [
  { el: <Trophy />, caption: "Du talent", pos: "left-[4%] top-[16%] -rotate-3" },
  { el: <RoadBlocked />, caption: "Route barrée", pos: "left-[7%] top-[60%] rotate-2" },
  { el: <OfflinePin />, caption: "Hors ligne", pos: "right-[5%] top-[20%] rotate-3" },
  { el: <Invisible />, caption: "Invisible", pos: "right-[6%] top-[62%] -rotate-2" },
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
        .fromTo(".iv-motif", { opacity: 0, y: 20, scale: 0.9 }, { opacity: 0.4, y: 0, scale: 1, duration: 0.9, stagger: 0.1 })
        .fromTo(".iv-line", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.85, stagger: 0.22 }, "-=0.3");
    }, root);
    return () => { ctx.revert(); ScrollTrigger.getAll().forEach((s) => { if (s.trigger === el) s.kill(); }); };
  }, []);

  return (
    <section ref={root} id="invisible" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-24">
      {/* motifs discrets sur les côtés (dans l'ombre) */}
      {MOTIFS.map((m) => (
        <div key={m.caption} className={`iv-motif pointer-events-none absolute hidden flex-col items-center gap-2 text-white md:flex ${m.pos}`} style={{ opacity: 0 }}>
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
        <p className="iv-line type-strong mt-8 opacity-0" style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)" }}>
          Mais en ligne, ils sont invisibles.
        </p>
        <p className="iv-line type-strong mt-6 text-white opacity-0" style={{ fontSize: "clamp(1.9rem, 5vw, 3.6rem)" }}>
          Et l'invisibilité coûte cher.
        </p>
      </div>
    </section>
  );
}
