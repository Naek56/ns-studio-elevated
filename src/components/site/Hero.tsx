import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const WORDS = ["AVEUGLE", "MUET", "SEUL", "PERDU"];

function useTypewriter(words: string[]) {
  const [text, setText] = useState("");
  const wi = useRef(0);
  const ci = useRef(0);
  const deleting = useRef(false);

  useEffect(() => {
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
    timer = window.setTimeout(tick, 700);
    return () => window.clearTimeout(timer);
  }, [words]);

  return text;
}

export default function Hero() {
  const typed = useTypewriter(WORDS);
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // cinematic camera: while scrolling away, the title zooms toward the
  // viewer and dissolves; the light layers drift at different speeds
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.35]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -60]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.55, 0.85], [1, 0.9, 0]);
  const lightsFar = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 120]);
  const lightsNear = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 260]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  return (
    <section ref={ref} id="accueil" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-center">
      {/* far light layer — drifts slowly (deep background) */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ y: lightsFar, willChange: "transform" }}>
        <div className="light-orb absolute left-[12%] top-[18%] h-[34vh] w-[34vh] animate-drift" />
        <div className="light-orb absolute right-[10%] top-[12%] h-[28vh] w-[28vh] animate-float" />
        <div className="light-orb absolute left-1/2 top-1/2 h-[26vh] w-[26vh] -translate-x-1/2 -translate-y-1/2 animate-float" />
      </motion.div>
      {/* near light layer — drifts faster (foreground depth) */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ y: lightsNear, willChange: "transform" }}>
        <div className="light-orb absolute left-[20%] bottom-[14%] h-[30vh] w-[30vh] animate-drift-slow" />
        <div className="light-orb absolute right-[16%] bottom-[18%] h-[36vh] w-[36vh] animate-glow-pulse" />
      </motion.div>

      {/* large soft base light + tighter core glow on the title */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[85vh] w-[95vw] max-w-[1400px] -translate-x-1/2 -translate-y-1/2 hero-glow-wide" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[58vh] w-[80vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 hero-glow animate-glow-pulse" />

      <motion.div
        className="relative z-10 mx-auto max-w-5xl"
        style={{ scale: titleScale, y: titleY, opacity: titleOpacity, willChange: "transform, opacity" }}
      >
        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="display-xl text-balance text-[2.6rem] font-semibold leading-tight text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]"
          style={{ textShadow: "0 0 40px rgba(255,255,255,0.25)" }}
        >
          <span id="hero-line1" className="block">Votre site est</span>
          <span className="mt-3 block">
            <span id="hero-word" className="word-glow">{typed}</span>
            <motion.span
              aria-hidden
              className="ml-1 inline-block w-[0.06em] rounded-full bg-white align-baseline"
              style={{ height: "0.82em", boxShadow: "0 0 18px rgba(255,255,255,0.9)" }}
              animate={{ opacity: [1, 0.15, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mx-auto mt-8 max-w-md text-base text-white/55 sm:text-lg"
        >
          Kairos change ça.
        </motion.p>
      </motion.div>

      <motion.div style={{ opacity: hintOpacity }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="text-xs uppercase tracking-[0.3em] text-white/35"
        >
          Défiler
        </motion.p>
      </motion.div>
    </section>
  );
}
