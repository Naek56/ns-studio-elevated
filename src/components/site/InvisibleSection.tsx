import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";

/* Section « invisibilité » — remplace Kairos + le storytelling. Un texte
   fort au centre, entouré de petits motifs (succès réel mais route barrée,
   hors ligne, invisible) discrets, dans l'ombre, sur les côtés. */

const STROKE = { fill: "none", stroke: "#fff", strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function Trophy() {
  return (
    <svg viewBox="0 0 64 64" width="60" height="60" {...STROKE}>
      <path d="M20 11 h24 v9 a12 12 0 0 1 -24 0 z" />
      <path d="M20 14 h-7 a7 7 0 0 0 7 9" />
      <path d="M44 14 h7 a7 7 0 0 1 -7 9" />
      <path d="M32 32 v8" />
      <path d="M27 48 h10 M23 54 h18 l-2 -6 h-14 z" />
      <path d="M32 14.5 l1.6 3.3 3.6 .5 -2.6 2.5 .6 3.6 -3.2 -1.7 -3.2 1.7 .6 -3.6 -2.6 -2.5 3.6 -.5 z" stroke="#f5b301" strokeWidth="1.2" />
      <g stroke="#fff" className="il-twinkle">
        <path d="M50 12 v5 M47.5 14.5 h5" />
      </g>
    </svg>
  );
}
function Barrier() {
  // barrière de chantier rayée + gyrophare
  return (
    <svg viewBox="0 0 64 64" width="60" height="60" {...STROKE}>
      <circle cx="32" cy="15" r="2.6" fill="#e0563f" stroke="none" className="il-twinkle" />
      <path d="M32 17 v6" />
      <rect x="10" y="26" width="44" height="11" rx="1.5" />
      <path d="M17 37 v20 M47 37 v20 M13 57 h8 M43 57 h8" />
      <path d="M14 37 L23 26 M26 37 L35 26 M38 37 L47 26 M50 37 L54 29" />
    </svg>
  );
}
function WifiOff() {
  return (
    <svg viewBox="0 0 64 64" width="60" height="60" {...STROKE}>
      <path className="il-twinkle" d="M13 27 a28 28 0 0 1 38 0" style={{ animationDelay: "0.6s" }} />
      <path className="il-twinkle" d="M20 34 a18 18 0 0 1 24 0" style={{ animationDelay: "0.3s" }} />
      <path className="il-twinkle" d="M27 41 a8 8 0 0 1 10 0" />
      <circle cx="32" cy="48" r="1.8" fill="#fff" stroke="none" />
      <path d="M13 13 L51 51" stroke="#e0563f" />
    </svg>
  );
}
function EyeOff() {
  return (
    <svg viewBox="0 0 64 64" width="60" height="60" {...STROKE}>
      <g className="il-blink">
        <path d="M8 32 C 18 19, 46 19, 56 32 C 46 45, 18 45, 8 32 Z" />
        <circle cx="32" cy="32" r="7.5" />
        <circle cx="32" cy="32" r="2.6" fill="#fff" stroke="none" />
      </g>
      <path d="M14 44 l-3 4 M32 47 v5 M50 44 l3 4" strokeWidth="2" />
      <path d="M12 12 L52 52" stroke="#e0563f" />
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
        <p className="iv-line type-strong mt-14 opacity-0 md:mt-20" style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)" }}>
          Mais en ligne, ils sont invisibles.
        </p>
        <p className="iv-line type-strong mt-6 text-white opacity-0" style={{ fontSize: "clamp(1.9rem, 5vw, 3.6rem)" }}>
          Et l'invisibilité coûte cher.
        </p>
      </div>
    </section>
  );
}
