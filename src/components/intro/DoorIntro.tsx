import { Suspense, lazy, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { ChevronDown } from "lucide-react";

const DoorScene = lazy(() => import("@/components/three/DoorScene"));

export default function DoorIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Pause the WebGL render loop once the visitor has stepped through the door
  const [active, setActive] = useState(true);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const shouldRun = v < 0.999;
    setActive((prev) => (prev === shouldRun ? prev : shouldRun));
  });

  // "Land in the light": white flood at the very end of the descent
  const flash = useTransform(scrollYProgress, [0.74, 0.96], [0, 1]);
  const hint = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.12], [0, -40]);

  const skip = () => {
    document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} className="relative h-[420vh]" aria-label="Entrée immersive">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#070503]">
        <Suspense fallback={<div className="absolute inset-0 grid place-items-center bg-[#070503] text-muted-foreground text-sm">Chargement de l'expérience…</div>}>
          <Canvas
            frameloop={active ? "always" : "never"}
            dpr={[1, 1.8]}
            gl={{ antialias: true, powerPreference: "high-performance" }}
            camera={{ fov: 55, position: [0.6, 1.7, 7.6], near: 0.1, far: 100 }}
          >
            <DoorScene progress={scrollYProgress} />
          </Canvas>
        </Suspense>

        {/* Overlaid copy at the very start */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="pointer-events-none absolute inset-x-0 top-[18%] z-10 flex flex-col items-center px-6 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full liquid-glass px-4 py-1.5 text-xs font-medium text-foreground/80">
            NS Intelligence
          </span>
          <h2 className="font-display mt-6 text-3xl font-semibold tracking-tight text-foreground/90 md:text-5xl">
            Derrière cette porte,
            <br />
            <span className="font-serif-accent italic text-[hsl(var(--primary-glow))]">votre prochain site.</span>
          </h2>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: hint }}
          className="absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-2 text-foreground/70"
        >
          <span className="text-xs uppercase tracking-[0.3em]">Faites défiler pour entrer</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </motion.div>

        {/* Skip / accessibility */}
        <button
          onClick={skip}
          className="absolute right-5 top-5 z-20 rounded-full liquid-glass px-4 py-2 text-xs font-medium text-foreground/80 transition-colors hover:text-foreground"
        >
          Passer l'intro
        </button>

        {/* White flood = arriving into the light */}
        <motion.div
          style={{ opacity: flash }}
          className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-b from-white via-[#fff3e2] to-white"
        />
      </div>
    </section>
  );
}
