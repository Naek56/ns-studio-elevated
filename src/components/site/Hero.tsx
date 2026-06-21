import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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
          timer = window.setTimeout(tick, 1500);
          return;
        }
        timer = window.setTimeout(tick, 110);
      } else {
        ci.current--;
        setText(word.slice(0, ci.current));
        if (ci.current <= 0) {
          deleting.current = false;
          wi.current++;
          timer = window.setTimeout(tick, 380);
          return;
        }
        timer = window.setTimeout(tick, 55);
      }
    };
    timer = window.setTimeout(tick, 600);
    return () => window.clearTimeout(timer);
  }, [words]);

  return text;
}

export default function Hero() {
  const typed = useTypewriter(WORDS);
  const go = (id: string) => {
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: string) => void } }).lenis;
    if (lenis) lenis.scrollTo("#" + id);
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="accueil" className="relative flex min-h-screen flex-col items-center justify-center py-28 text-center">
      <div className="container-tight relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="label legible mb-8"
        >
          WAY Creative Agency
        </motion.p>

        <h1 className="display-xl legible mx-auto max-w-4xl text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="block">Votre site est</span>
          <span className="mt-2 block">
            <span className="italic">{typed}</span>
            <span
              className="ml-1 inline-block w-[0.05em] animate-pulse bg-current align-baseline"
              style={{ height: "0.82em" }}
            />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="legible mt-7 text-base text-muted-foreground sm:text-lg"
        >
          Kairos change ça.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          onClick={() => go("kairos")}
          className="btn-glass group mt-10"
        >
          Découvrir Kairos
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </div>
    </section>
  );
}
