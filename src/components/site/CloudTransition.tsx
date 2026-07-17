import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";

/* Transition « traverser un nuage » entre l'accueil (#accueil) et la première
   section. Version LÉGÈRE (perf) : seulement 2 couches — un voile blanc dégradé
   (couverture totale, très peu coûteux) + UNE texture de nuage feTurbulence,
   sans masque et à faible résolution. Recouvre tout l'écran au pic puis se
   dégage avant le ciel vide (#cloud-gap). */

// texture nuage compacte (petit SVG, peu d'octaves → rendu léger)
const CLOUD_TEX = (() => {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='700' height='450'>` +
    `<filter id='c'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='0.016' numOctaves='4' seed='9' stitchTiles='stitch'/>` +
    `<feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.5 1.35'/>` +
    `</filter>` +
    `<rect width='100%' height='100%' filter='url(#c)'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
})();

export default function CloudTransition({ active }: { active: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const tex = useRef<HTMLDivElement>(null);

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
          invalidateOnRefresh: true,
        },
      });

      // voile blanc : couverture totale au milieu (autoAlpha → sort du rendu hors transition)
      tl.fromTo(veil.current, { autoAlpha: 0 }, { autoAlpha: 0.97, ease: "power1.inOut", duration: 0.34 }, 0.1)
        .to(veil.current, { autoAlpha: 0.97, duration: 0.08 }, 0.44)
        .to(veil.current, { autoAlpha: 0, ease: "power1.inOut", duration: 0.24 }, 0.52);

      // texture de nuage : apparaît, dérive un peu, disparaît
      tl.fromTo(tex.current, { autoAlpha: 0, yPercent: 22 }, { autoAlpha: 0.92, ease: "power1.in", duration: 0.3 }, 0.06)
        .to(tex.current, { autoAlpha: 0, ease: "power1.out", duration: 0.24 }, 0.54)
        .fromTo(tex.current, { yPercent: 22 }, { yPercent: -22, ease: "none", duration: 1 }, 0);

      // met le shader de fond en PAUSE tant que le nuage recouvre l'écran
      // (il n'est pas visible à ce moment-là) → libère le GPU, évite les lags
      ScrollTrigger.create({
        trigger: accueil,
        start: "top+=12% top",
        end: "bottom-=8% top",
        onToggle: (self) => window.dispatchEvent(new CustomEvent("way:shaderpause", { detail: self.isActive })),
      });
    }, root);

    const r = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(r);
      window.dispatchEvent(new CustomEvent("way:shaderpause", { detail: false }));
      ctx.revert();
    };
  }, [active]);

  if (REDUCED) return null;

  const layer: React.CSSProperties = {
    position: "absolute", inset: "-8%",
    willChange: "opacity, transform", opacity: 0, visibility: "hidden",
    transform: "translateZ(0)", backfaceVisibility: "hidden",
  };

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      <div ref={veil} style={{ ...layer, background: "radial-gradient(130% 130% at 50% 45%, #ffffff 0%, #eef4fb 66%, #e3edf8 100%)" }} />
      <div ref={tex} style={{ ...layer, backgroundImage: CLOUD_TEX, backgroundSize: "cover", backgroundPosition: "center" }} />
    </div>
  );
}
