import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";

const BlackHoleScene = lazy(() => import("@/components/three/BlackHoleScene"));

export default function BlackHoleIntro({ onEnter }: { onEnter: () => void }) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [entering, setEntering] = useState(false);
  const diveRef = useRef(0);

  useEffect(() => {
    let p = 0;
    const id = window.setInterval(() => {
      p += Math.random() * 9 + 3;
      if (p >= 100) {
        p = 100;
        window.clearInterval(id);
        setProgress(100);
        setReady(true);
      } else {
        setProgress(Math.floor(p));
      }
    }, 95);
    return () => window.clearInterval(id);
  }, []);

  const enter = () => {
    if (entering) return;
    setEntering(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      onEnter();
      return;
    }
    const start = performance.now();
    const dur = 1600;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      diveRef.current = t;
      if (t < 1) requestAnimationFrame(tick);
      else onEnter();
    };
    requestAnimationFrame(tick);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.8]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          camera={{ fov: 50, position: [0, 0.75, 6], near: 0.1, far: 200 }}
        >
          <BlackHoleScene diveRef={diveRef} />
        </Canvas>
      </Suspense>

      {/* UI layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between py-16"
        animate={{ opacity: entering ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* NS.I logo mark */}
        <div className="flex flex-col items-center gap-4">
          <div className="grid h-20 w-20 place-items-center rounded-[1.4rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] shadow-[0_16px_50px_-12px_rgba(0,0,0,0.9)]">
            <span
              className="font-display text-2xl font-extrabold tracking-tight text-orange"
              style={{ textShadow: "0 0 22px hsl(24 95% 54% / 0.85)" }}
            >
              NS.I
            </span>
          </div>
          <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">NS Intelligence</span>
        </div>

        {/* Loading / Enter */}
        <div className="pointer-events-auto flex w-full max-w-xs flex-col items-center gap-5 px-6">
          <AnimatePresence mode="wait">
            {!ready ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="uppercase tracking-[0.3em]">Initialisation</span>
                  <span className="tabular-nums text-foreground">{progress}%</span>
                </div>
                <div className="mt-3 h-px w-full overflow-hidden bg-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-yellow to-primary transition-[width] duration-150 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="enter"
                onClick={enter}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="btn-liquid-accent px-10 py-3.5 text-sm tracking-wide"
              >
                Entrer
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Dive to black */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: entering ? 1 : 0 }}
        transition={{ duration: entering ? 1.4 : 0, delay: entering ? 0.5 : 0, ease: "easeIn" }}
      />
    </motion.div>
  );
}
