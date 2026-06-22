import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

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

  return (
    <section id="accueil" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-center">
      {/* coloured auroras + white core light behind the title */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="aurora aurora-a absolute h-[42vh] w-[42vh] animate-drift" style={{ transform: "translate(-22%, -12%)" }} />
        <div className="aurora aurora-b absolute h-[38vh] w-[38vh] animate-drift-slow" style={{ transform: "translate(24%, 10%)" }} />
        <div className="aurora aurora-c absolute h-[30vh] w-[55vh] animate-glow-pulse" />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[55vh] w-[80vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 hero-glow animate-glow-pulse" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="display-xl text-balance text-[2.6rem] font-semibold leading-tight text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]"
          style={{ textShadow: "0 0 40px rgba(255,255,255,0.25)" }}
        >
          <span className="block">Votre site est</span>
          <span className="mt-3 block">
            <span className="word-glow">{typed}</span>
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
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-white/35"
      >
        Défiler
      </motion.div>
    </section>
  );
}
