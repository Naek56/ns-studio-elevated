import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";

/* Transition « traverser un nuage » entre l'accueil (#accueil) et la première
   section. Pilotée au scroll : en quittant l'accueil, des nuages réalistes
   (générés par feTurbulence) montent, envahissent l'écran jusqu'à un
   blanc laiteux (on est DANS le nuage), puis se dissipent pour révéler la
   suite. Trois plans à des échelles différentes → sensation de traversée.

   Le nuage est 100 % code (aucun fichier), et le ciel bleu du site sert de
   fond → nuages blancs sur ciel, réaliste. */

// un plan de nuages : bruit fractal → poussé vers du blanc avec des bords
// doux (la 4e ligne de la matrice sculpte le canal alpha en « boules »).
function cloudUri(freq: number, seed: number, octaves: number, bias: number) {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='1400' height='900'>` +
    `<filter id='c' x='-20%' y='-20%' width='140%' height='140%'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='${octaves}' seed='${seed}' stitchTiles='stitch'/>` +
    `<feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.6 ${bias}'/>` +
    `</filter>` +
    `<rect width='100%' height='100%' filter='url(#c)'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export default function CloudTransition({ active }: { active: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const far = useRef<HTMLDivElement>(null);
  const mid = useRef<HTMLDivElement>(null);
  const near = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || REDUCED) return;
    const accueil = document.getElementById("accueil");
    if (!accueil || !root.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: accueil,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // voile blanc : le cœur du nuage (blanc laiteux au pic)
      tl.fromTo(veil.current, { opacity: 0 }, { opacity: 0.94, ease: "power1.in", duration: 0.55 }, 0)
        .to(veil.current, { opacity: 0, ease: "power1.out", duration: 0.45 }, 0.55);

      // un plan de nuage : apparaît, gonfle (zoom = traversée), puis s'efface
      const plane = (el: HTMLDivElement | null, peak: number, s0: number, s1: number) => {
        if (!el) return;
        const sMid = s0 + (s1 - s0) * 0.55;
        tl.fromTo(el, { opacity: 0, scale: s0 }, { opacity: peak, scale: sMid, ease: "power1.in", duration: 0.55 }, 0)
          .to(el, { opacity: 0, scale: s1, ease: "power1.out", duration: 0.45 }, 0.55);
      };
      plane(far.current, 0.55, 1.05, 1.7);   // fond, lent
      plane(mid.current, 0.8, 1.12, 2.25);   // milieu
      plane(near.current, 1, 1.25, 3.4);     // premier plan, zoom rapide
    }, root);

    return () => ctx.revert();
  }, [active]);

  if (REDUCED) return null;

  const base: React.CSSProperties = {
    position: "absolute",
    inset: "-15%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    willChange: "transform, opacity",
    opacity: 0,
  };

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
    >
      <div ref={far} style={{ ...base, backgroundImage: cloudUri(0.009, 2, 5, 1.05), filter: "blur(3px)" }} />
      <div ref={mid} style={{ ...base, backgroundImage: cloudUri(0.013, 7, 6, 1.22), filter: "blur(1px)" }} />
      <div ref={near} style={{ ...base, backgroundImage: cloudUri(0.018, 4, 6, 1.5) }} />
      {/* voile blanc laiteux : le cœur du nuage */}
      <div ref={veil} style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 120% at 50% 45%, #ffffff 0%, #eef4fb 60%, #dfeaf6 100%)", opacity: 0 }} />
    </div>
  );
}
