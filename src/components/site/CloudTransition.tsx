import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";

/* Transition « traverser un nuage » entre l'accueil (#accueil) et la première
   section. Gros nuage ÉPAIS : des bancs montent, puis un cœur de nuage dense
   RECOUVRE TOUT L'ÉCRAN un instant (on est en plein dedans), puis se dissipe.
   La transition s'étale sur ~1,7 écran de scroll → beaucoup de distance entre
   le texte et le nuage (le texte est déjà loin quand le nuage est au plus dense).

   100 % code (feTurbulence SVG, aucun fichier). Ciel bleu du site en fond. */

function cloudUri(freq: number, seed: number, octaves: number, bias: number) {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='900'>` +
    `<filter id='c' x='-20%' y='-20%' width='140%' height='140%'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='${octaves}' seed='${seed}' stitchTiles='stitch'/>` +
    `<feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.6 ${bias}'/>` +
    `</filter>` +
    `<rect width='100%' height='100%' filter='url(#c)'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export default function CloudTransition({ active }: { active: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const coreWhite = useRef<HTMLDivElement>(null);
  const coreTex = useRef<HTMLDivElement>(null);
  const far = useRef<HTMLDivElement>(null);
  const near = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || REDUCED) return;
    const accueil = document.getElementById("accueil");
    if (!accueil || !root.current) return;

    const ctx = gsap.context(() => {
      // la transition se joue ENTIÈREMENT pendant la sortie de l'accueil et se
      // dégage avant le ciel vide (#cloud-gap) → distance nette avec la section 1
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: accueil,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // bancs de nuages qui défilent verticalement (mouvement d'entrée/sortie).
      // autoAlpha (opacité + visibility) : les couches invisibles sortent du
      // compositing → plus de saccades pendant la traversée.
      const bank = (el: HTMLDivElement | null, yFrom: number, yTo: number, peak: number) => {
        if (!el) return;
        tl.fromTo(el, { yPercent: yFrom }, { yPercent: yTo, ease: "none", duration: 1 }, 0)
          .fromTo(el, { autoAlpha: 0 }, { autoAlpha: peak, ease: "power1.in", duration: 0.26 }, 0.02)
          .to(el, { autoAlpha: 0, ease: "power1.out", duration: 0.24 }, 0.54);
      };
      bank(far.current, 60, -60, 0.75);
      bank(near.current, 95, -95, 0.9);

      // cœur dense : recouvre TOUT l'écran au milieu, avec un temps de maintien
      const core = (el: HTMLDivElement | null, peak: number) => {
        if (!el) return;
        tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: peak, ease: "power1.inOut", duration: 0.3 }, 0.12)
          .to(el, { autoAlpha: peak, duration: 0.08 }, 0.42) // maintien plein écran
          .to(el, { autoAlpha: 0, ease: "power1.inOut", duration: 0.24 }, 0.5);
      };
      core(coreWhite.current, 0.97); // garantit une couverture totale
      core(coreTex.current, 0.92);   // texture de nuage épaisse par-dessus
    }, root);

    const r = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { cancelAnimationFrame(r); ctx.revert(); };
  }, [active]);

  if (REDUCED) return null;

  // bandes larges et hautes (nuage épais) avec bords estompés
  const feather = "linear-gradient(to bottom, transparent 0%, #000 16%, #000 84%, transparent 100%)";
  const bank: React.CSSProperties = {
    position: "absolute", left: "-30%", width: "160%", top: "-10%", height: "120%",
    backgroundSize: "cover", backgroundPosition: "center",
    WebkitMaskImage: feather, maskImage: feather,
    willChange: "transform, opacity", opacity: 0, visibility: "hidden",
    transform: "translateZ(0)", backfaceVisibility: "hidden",
  };
  const core: React.CSSProperties = {
    position: "absolute", opacity: 0, visibility: "hidden",
    willChange: "opacity", transform: "translateZ(0)", backfaceVisibility: "hidden",
  };

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {/* bancs en parallaxe (mouvement) — sans blur (coûteux → saccades) */}
      <div ref={far} style={{ ...bank, backgroundImage: cloudUri(0.011, 3, 5, 1.15) }} />
      <div ref={near} style={{ ...bank, backgroundImage: cloudUri(0.017, 6, 6, 1.35) }} />
      {/* cœur plein écran : couverture blanche + texture nuage épaisse */}
      <div ref={coreWhite} style={{ ...core, inset: 0, background: "radial-gradient(130% 130% at 50% 45%, #ffffff 0%, #eef4fb 65%, #e3edf8 100%)" }} />
      <div ref={coreTex} style={{ ...core, inset: "-6%", backgroundImage: cloudUri(0.013, 9, 6, 1.5), backgroundSize: "cover", backgroundPosition: "center" }} />
    </div>
  );
}
