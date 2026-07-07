import { useEffect, useRef, useState } from "react";
import HeroParticles from "./HeroParticles";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";

const WORDS = ["AVEUGLE", "MUET", "SEUL", "PERDU"];

function useTypewriter(words: string[], active: boolean) {
  const [text, setText] = useState("");
  const wi = useRef(0);
  const ci = useRef(0);
  const deleting = useRef(false);

  useEffect(() => {
    if (!active) return;
    let timer: number;
    const tick = () => {
      const word = words[wi.current % words.length];
      if (!deleting.current) {
        ci.current++;
        setText(word.slice(0, ci.current));
        if (ci.current >= word.length) {
          deleting.current = true;
          timer = window.setTimeout(tick, 1600);
          return;
        }
        timer = window.setTimeout(tick, 110);
      } else {
        ci.current--;
        setText(word.slice(0, ci.current));
        if (ci.current <= 0) {
          deleting.current = false;
          wi.current++;
          timer = window.setTimeout(tick, 360);
          return;
        }
        timer = window.setTimeout(tick, 55);
      }
    };
    timer = window.setTimeout(tick, 900);
    return () => window.clearTimeout(timer);
  }, [words, active]);

  return text;
}

export default function Hero({ play }: { play: boolean }) {
  const typed = useTypewriter(WORDS, play);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!play || !root.current) return;
    const ctx = gsap.context(() => {
      /* ------- sequenced entrance (line draws, then the words arrive) ------- */
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (REDUCED) {
        intro.set([".h-line", ".h-title", ".h-sub", ".h-hint"], { opacity: 1, scaleX: 1, y: 0 });
      } else {
        intro
          .fromTo(".h-line", { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 1.1, ease: "expo.inOut" })
          .fromTo(".h-title", { y: 64, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, "-=0.45")
          .fromTo(".h-sub", { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.55")
          .fromTo(".h-hint", { opacity: 0 }, { opacity: 1, duration: 0.9 }, "-=0.4");
      }

      /* ------- cinematic scrub: the title flies past the camera ------------- */
      if (!REDUCED) {
        gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        })
          .to(".h-stage", { scale: 1.3, y: -70, opacity: 0, ease: "none" }, 0)
          .to(".h-far", { y: 110, ease: "none" }, 0)
          .to(".h-near", { y: 240, ease: "none" }, 0)
          .to(".h-hint", { opacity: 0, ease: "none" }, 0);
      }
    }, root);
    return () => ctx.revert();
  }, [play]);

  return (
    <section ref={root} id="accueil" className="relative flex h-[100svh] items-center justify-center overflow-hidden bg-black px-6 text-center">
      <HeroParticles />

      {/* far / near light layers (depth parallax) */}
      <div className="h-far pointer-events-none absolute inset-0 will-change-transform">
        <div className="light-orb absolute left-[12%] top-[18%] h-[34vh] w-[34vh] animate-drift" />
        <div className="light-orb absolute right-[10%] top-[12%] h-[28vh] w-[28vh] animate-float" />
      </div>
      <div className="h-near pointer-events-none absolute inset-0 will-change-transform">
        <div className="light-orb absolute left-[20%] bottom-[14%] h-[30vh] w-[30vh] animate-drift-slow" />
        <div className="light-orb absolute right-[16%] bottom-[18%] h-[36vh] w-[36vh] animate-glow-pulse" />
      </div>

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[85vh] w-[95vw] max-w-[1400px] -translate-x-1/2 -translate-y-1/2 hero-glow-wide" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[58vh] w-[80vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 hero-glow animate-glow-pulse" />

      <div className="h-stage relative z-10 mx-auto max-w-6xl will-change-transform">
        <div className="h-line mx-auto mb-10 h-px w-24 bg-white/50 opacity-0 sm:w-36" />

        <h1
          className="h-title display-serif text-balance text-white opacity-0"
          style={{ fontSize: "clamp(3.4rem, 11vw, 9.5rem)", textShadow: "0 0 50px rgba(255,255,255,0.22)" }}
        >
          <span className="block">Votre site est</span>
          <span className="mt-1 block italic">
            <span className="word-glow">{typed}</span>
            <span
              aria-hidden
              className="ml-2 inline-block w-[0.045em] animate-pulse rounded-full bg-white align-baseline"
              style={{ height: "0.78em", boxShadow: "0 0 18px rgba(255,255,255,0.9)" }}
            />
          </span>
        </h1>

        <p className="h-sub mx-auto mt-9 max-w-md text-base tracking-wide text-white/55 opacity-0 sm:text-lg">
          Kairos change ça.
        </p>
      </div>

      <div className="h-hint absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 opacity-0">
        <span className="text-[11px] uppercase tracking-[0.32em] text-white/35">Défiler</span>
        <span className="relative block h-9 w-px overflow-hidden bg-white/15">
          <span className="absolute left-0 top-0 h-3 w-px animate-[scrollcue_1.8s_ease-in-out_infinite] bg-white/70" />
        </span>
      </div>

      <style>{`@keyframes scrollcue { 0% { transform: translateY(-100%); } 100% { transform: translateY(400%); } }`}</style>
    </section>
  );
}
