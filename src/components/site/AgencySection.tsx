import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";
import CloudDecor, { type CloudDeco } from "./CloudDecor";

const DECO: CloudDeco[] = [
  { top: "9%", left: "5%", size: 120, seed: 14, opacity: 0.44, flip: false },
  { bottom: "9%", right: "6%", size: 128, seed: 21, opacity: 0.42, flip: true },
];
/* icônes logo W (papier découpé) — dans les coins libres, loin des nuages */
const LOGOS = [
  { top: "11%", right: "6%", size: 82, opacity: 0.85 },
  { bottom: "22%", left: "6%", size: 76, opacity: 0.8 },
];

/* Section Agence — « On ne livre pas des sites. On construit des présences. »
   Design : le logo WAY en grand filigrane. (Les colonnes ont été retirées —
   à remplacer par autre chose.) */

export default function AgencySection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (REDUCED) { gsap.set(".ag-in", { opacity: 1, y: 0 }); return; }
      gsap.fromTo(".ag-in", { opacity: 0, y: 34 }, {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.16, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 70%", once: true },
      });
      gsap.to(".ag-logo", { yPercent: -12, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    }, root);
    return () => { ctx.revert(); ScrollTrigger.getAll().forEach((s) => { if (s.trigger === el) s.kill(); }); };
  }, []);

  return (
    <section ref={root} id="agence" className="relative overflow-hidden px-6 py-28 text-center md:px-10 md:py-36">
      <CloudDecor items={DECO} />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {LOGOS.map((l, i) => (
          <img key={i} src="/w_flat_grise_trans.png" alt="" aria-hidden className="absolute"
            style={{ top: l.top, bottom: l.bottom, left: l.left, right: l.right, width: l.size, opacity: l.opacity }} />
        ))}
      </div>
      {/* design : logo WAY en filigrane */}
      <svg aria-hidden viewBox="0 0 48 48" fill="none"
        className="ag-logo pointer-events-none absolute left-1/2 top-[42%] -z-0 h-[52vh] w-[52vh] max-h-[520px] max-w-[520px] -translate-x-1/2 -translate-y-1/2 text-white opacity-[0.05] will-change-transform">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.4" />
        <path d="M13 17.5 L18.5 31 L24 20 L29.5 31 L35 17.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div className="relative z-10 mx-auto max-w-[1100px]">
        <p className="ag-in type-body text-xs font-semibold uppercase tracking-[0.32em] text-white/70 opacity-0">L'agence</p>
        <h2 className="ag-in type-strong mx-auto mt-5 max-w-3xl opacity-0" style={{ fontSize: "clamp(2rem, 5.2vw, 4rem)" }}>
          On ne livre pas des sites. On construit des <span className="mark-select mk-c">présences</span>.
        </h2>
        <p className="ag-in type-body mx-auto mt-7 max-w-2xl text-white/80 opacity-0" style={{ fontSize: "clamp(0.95rem, 2vw, 1.2rem)" }}>
          WAY Agency est une agence web créative basée à Strasbourg. On travaille avec des businesses qui ont quelque chose à dire et qui veulent être entendus.
        </p>
      </div>
    </section>
  );
}
