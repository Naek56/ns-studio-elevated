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
          timer = window.setTimeout(tick, 1500); // hold the full word
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
    <section id="accueil" className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="container-tight relative z-10 text-center">
        <div className="rounded-3xl border border-white/10 bg-background/60 p-6 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="legible mb-7 text-xs uppercase tracking-[0.45em] text-muted-foreground"
          >
            WAY Agency
          </motion.p>

          <h1 className="text-scrim relative display-xl mx-auto max-w-4xl text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">Votre site est</span>
            <span className="mt-2 block">
              <span>{typed}</span>
              <span className="ml-1 inline-block w-[0.06em] animate-pulse bg-current align-baseline" style={{ height: "0.85em" }} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="legible mt-6 text-base text-muted-foreground sm:text-lg"
          >
            Kairos change ça.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            onClick={() => go("kairos")}
            className="btn-glass group mt-8"
          >
            Découvrir Kairos
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
