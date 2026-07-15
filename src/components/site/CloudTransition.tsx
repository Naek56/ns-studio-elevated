import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";

/* Transition « traverser un nuage » entre l'accueil (#accueil) et la première
   section. On est AU-DESSUS des nuages et on les traverse : au scroll, des
   bancs de nuages réalistes (feTurbulence SVG) défilent HORIZONTALEMENT à des
   vitesses différentes (parallaxe), avec un cœur blanc laiteux au milieu (on
   est dedans), puis ils sortent de l'écran → la section suivante apparaît.

   100 % code (aucun fichier). Ciel bleu du site en fond → nuages blancs. */

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
  const veil = useRef<HTMLDivElement>(null);
  const far = useRef<HTMLDivElement>(null);
  const mid = useRef<HTMLDivElement>(null);
  const near = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || REDUCED) return;
    const accueil = document.getElementById("accueil");
    if (!accueil || !root.current) return;

    let tl: gsap.core.Timeline | null = null;
    const ctx = gsap.context(() => {
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: accueil,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      // voile blanc laiteux : le cœur du nuage (pic au milieu)
      tl.fromTo(veil.current, { opacity: 0 }, { opacity: 0.82, ease: "power1.inOut", duration: 0.5 }, 0)
        .to(veil.current, { opacity: 0, ease: "power1.inOut", duration: 0.5 }, 0.5);

      // un banc de nuages : défile horizontalement, apparaît puis disparaît.
      // dx = déplacement horizontal total (en %), signe = sens.
      const bank = (el: HTMLDivElement | null, peak: number, dx: number, drift: number) => {
        if (!el) return;
        gsap.set(el, { xPercent: -dx / 2, yPercent: -drift / 2 });
        tl!
          .fromTo(el, { opacity: 0 }, { opacity: peak, ease: "power1.in", duration: 0.5 }, 0)
          .to(el, { opacity: 0, ease: "power1.out", duration: 0.5 }, 0.5)
          .to(el, { xPercent: dx / 2, yPercent: drift / 2, ease: "none", duration: 1 }, 0);
      };
      // même sens (droite → gauche), vitesses croissantes = on avance à travers
      bank(far.current, 0.5, -26, -6);   // fond, lent
      bank(mid.current, 0.75, -48, -3);  // milieu
      bank(near.current, 1, -82, 4);     // premier plan, rapide
    }, root);

    // le layout est prêt après le reveal : on recalcule les positions
    const r = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => { cancelAnimationFrame(r); ctx.revert(); };
  }, [active]);

  if (REDUCED) return null;

  // chaque banc est plus large que l'écran pour pouvoir défiler sans laisser
  // de bord visible.
  const bankStyle: React.CSSProperties = {
    position: "absolute",
    top: "-25%",
    left: "-60%",
    width: "220%",
    height: "150%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    willChange: "transform, opacity",
    opacity: 0,
  };

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      <div ref={far} style={{ ...bankStyle, backgroundImage: cloudUri(0.01, 2, 5, 1.0), filter: "blur(3px)" }} />
      <div ref={mid} style={{ ...bankStyle, backgroundImage: cloudUri(0.014, 7, 6, 1.18), filter: "blur(1px)" }} />
      <div ref={near} style={{ ...bankStyle, backgroundImage: cloudUri(0.02, 4, 6, 1.42) }} />
      <div ref={veil} style={{ position: "absolute", inset: 0, background: "radial-gradient(130% 130% at 50% 45%, #ffffff 0%, #eef4fb 62%, #e2ecf7 100%)", opacity: 0 }} />
    </div>
  );
}
