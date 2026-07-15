import { useEffect, useRef, useState } from "react";
import { gsap, REDUCED } from "@/lib/gsapSetup";
import PixelIcon from "./PixelIcon";
import CloudDecor, { type CloudDeco } from "./CloudDecor";

const HERO_DECO: CloudDeco[] = [
  { top: "12%", left: "5%", size: 150, base: "#5f9ede", seed: 6, opacity: 0.5, delay: 0, drift: 16 },
  { top: "20%", right: "6%", size: 120, base: "#4d86cf", seed: 12, opacity: 0.42, delay: 2.5, drift: -13 },
  { bottom: "16%", left: "10%", size: 110, base: "#4d86cf", seed: 19, opacity: 0.4, delay: 1.2, drift: 12 },
  { bottom: "12%", right: "12%", size: 140, base: "#6aa6e2", seed: 3, opacity: 0.46, delay: 3.4, drift: -15 },
];

const WORDS = ["AVEUGLE", "MUET", "SEUL", "PERDU"];

function useTypewriter(words: string[], active: boolean) {
  const [text, setText] = useState("");
  const wi = useRef(0), ci = useRef(0), deleting = useRef(false);
  useEffect(() => {
    if (!active) return;
    let timer: number;
    const tick = () => {
      const word = words[wi.current % words.length];
      if (!deleting.current) {
        ci.current++;
        setText(word.slice(0, ci.current));
        if (ci.current >= word.length) { deleting.current = true; timer = window.setTimeout(tick, 1600); return; }
        timer = window.setTimeout(tick, 110);
      } else {
        ci.current--;
        setText(word.slice(0, ci.current));
        if (ci.current <= 0) { deleting.current = false; wi.current++; timer = window.setTimeout(tick, 360); return; }
        timer = window.setTimeout(tick, 55);
      }
    };
    timer = window.setTimeout(tick, 800);
    return () => window.clearTimeout(timer);
  }, [words, active]);
  return text;
}

/* Accueil : le titre « Votre site est [AVEUGLE / MUET / SEUL / PERDU] ». */
export default function Hero({ play }: { play: boolean }) {
  const typed = useTypewriter(WORDS, play);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      if (REDUCED) { gsap.set([".h-title", ".h-sub", ".h-hint"], { opacity: 1, y: 0 }); return; }
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      tl.fromTo(".h-title", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 })
        .fromTo(".h-sub", { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.55")
        .fromTo(".h-hint", { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.3");
      // parallax de sortie
      gsap.to(".h-stage", { yPercent: -14, opacity: 0.1, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      if (play) tl.play();
      return () => tl.kill();
    }, root);
    return () => ctx.revert();
  }, [play]);

  return (
    <section ref={root} id="accueil" className="relative flex h-[100svh] items-center justify-center overflow-hidden px-6 text-center">
      <CloudDecor items={HERO_DECO} />
      <div aria-hidden className="read-pool pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[92vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2" />

      <div className="h-stage relative flex flex-col items-center will-change-transform">
        <h1 className="h-title type-strong opacity-0" style={{ fontSize: "clamp(2.1rem, 6vw, 4.6rem)" }}>
          <span className="block">Votre site est</span>
          <span className="mt-1 block">
            {typed}
            <span aria-hidden className="ml-1 inline-block w-[0.05em] animate-pulse rounded-full bg-white align-baseline" style={{ height: "0.82em", boxShadow: "0 0 16px rgba(255,255,255,0.8)" }} />
          </span>
        </h1>
        <p className="h-sub mt-8 flex items-center justify-center gap-2 text-base text-white/70 opacity-0 sm:text-lg">
          On change ça.<PixelIcon name="star" size={18} />
        </p>
      </div>

      <span className="h-hint type-body absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.32em] text-white/70 opacity-0">
        Défiler
      </span>
    </section>
  );
}
