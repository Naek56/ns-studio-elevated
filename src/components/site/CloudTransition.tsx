import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";

/* Transition « traverser un nuage » entre l'accueil (#accueil) et la première
   section. Pas de blanc plein écran : un BANC de nuages (une bande, pas tout
   l'écran) traverse la vue VERTICALEMENT et LINÉAIREMENT au scroll — on
   descend en scrollant droit dans le nuage. Bords estompés (masque) pour que
   le nuage se fonde, deux plans en parallaxe pour la profondeur.

   100 % code (feTurbulence SVG, aucun fichier). Ciel bleu du site en fond. */

function cloudUri(freq: number, seed: number, octaves: number, bias: number) {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='700'>` +
    `<filter id='c' x='-20%' y='-20%' width='140%' height='140%'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='${octaves}' seed='${seed}' stitchTiles='stitch'/>` +
    `<feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.6 ${bias}'/>` +
    `</filter>` +
    `<rect width='100%' height='100%' filter='url(#c)'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export default function CloudTransition({ active }: { active: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const far = useRef<HTMLDivElement>(null);
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
          scrub: true, // couplage direct au scroll = linéaire
          invalidateOnRefresh: true,
        },
      });

      // un banc : monte tout droit à travers la vue (bas → haut), linéaire.
      const bank = (el: HTMLDivElement | null, yFrom: number, yTo: number, peak: number) => {
        if (!el) return;
        tl.fromTo(el, { yPercent: yFrom }, { yPercent: yTo, ease: "none", duration: 1 }, 0)
          // apparition/disparition douce seulement aux tout débuts/fins
          .fromTo(el, { opacity: 0 }, { opacity: peak, ease: "none", duration: 0.14 }, 0)
          .to(el, { opacity: 0, ease: "none", duration: 0.14 }, 0.86);
      };
      bank(far.current, 80, -80, 0.7);   // fond, un peu plus lent visuellement
      bank(near.current, 105, -105, 0.95); // premier plan, traverse plus vite
    }, root);

    const r = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { cancelAnimationFrame(r); ctx.revert(); };
  }, [active]);

  if (REDUCED) return null;

  // une BANDE (pas tout l'écran) : ~72% de haut, bords estompés en haut/bas
  // pour que le nuage se fonde dans le ciel au lieu d'un rectangle net.
  const feather =
    "linear-gradient(to bottom, transparent 0%, #000 20%, #000 80%, transparent 100%)";
  const bank: React.CSSProperties = {
    position: "absolute",
    left: "-25%",
    width: "150%",
    top: "14%",
    height: "72%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    WebkitMaskImage: feather,
    maskImage: feather,
    willChange: "transform, opacity",
    opacity: 0,
  };

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      <div ref={far} style={{ ...bank, backgroundImage: cloudUri(0.012, 3, 5, 1.05), filter: "blur(2px)" }} />
      <div ref={near} style={{ ...bank, backgroundImage: cloudUri(0.019, 6, 6, 1.32) }} />
    </div>
  );
}
