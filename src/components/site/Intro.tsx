import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";

// Opening sequence: no nav yet. Loader 0 -> 100, then "Entrer".
export default function Intro({ onEnter }: { onEnter: () => void }) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let p = 0;
    const id = window.setInterval(() => {
      p += Math.random() * 9 + 4;
      if (p >= 100) {
        p = 100;
        window.clearInterval(id);
        setProgress(100);
        setReady(true);
      } else setProgress(Math.floor(p));
    }, 90);
    return () => window.clearInterval(id);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-soft-light" />

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <Logo />
      </motion.div>

      <div className="mt-12 flex w-full max-w-xs flex-col items-center gap-5 px-6">
        <AnimatePresence mode="wait">
          {!ready ? (
            <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="uppercase tracking-[0.3em]">Chargement</span>
                <span className="tabular-nums text-foreground">{progress}%</span>
              </div>
              <div className="mt-3 h-px w-full overflow-hidden bg-white/10">
                <div className="h-full bg-white transition-[width] duration-150 ease-out" style={{ width: `${progress}%` }} />
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="enter"
              onClick={onEnter}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="btn-glass px-10 py-3.5 tracking-wide"
            >
              Entrer
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
