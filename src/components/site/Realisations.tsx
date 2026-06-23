import { Suspense, lazy, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Reveal from "./Reveal";

const Gallery = lazy(() => import("@/components/three/Gallery"));

export default function Realisations() {
  const [lowPower] = useState(
    () => typeof window !== "undefined" && (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 1024)
  );

  return (
    <section id="realisations" className="relative overflow-hidden bg-black py-24 md:py-36">
      {/* background fillers so the section doesn't feel empty */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 25%, transparent 78%)",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 25%, transparent 78%)",
          }}
        />
        <div className="light-orb absolute left-[8%] top-[24%] h-[36vh] w-[36vh] animate-drift" />
        <div className="light-orb absolute right-[6%] top-[34%] h-[32vh] w-[32vh] animate-float" />
        <div className="light-orb absolute left-1/2 bottom-[6%] h-[28vh] w-[28vh] -translate-x-1/2 animate-drift-slow" />
        <span className="watermark absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 select-none font-semibold leading-none" style={{ fontSize: "clamp(140px, 26vw, 360px)" }}>
          03
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-[1300px] px-6 text-center md:px-12">
        <Reveal>
          <p className="label">Réalisations</p>
          <h2 className="display-xl mt-5 text-4xl font-semibold text-white sm:text-5xl md:text-6xl">
            Quelques projets.
          </h2>
          <p className="mt-4 text-sm text-white/45">Survolez les cartes.</p>
        </Reveal>
      </div>

      <div className="relative z-10 mt-8 h-[58vh] w-full md:mt-12 md:h-[64vh]">
        <Suspense fallback={null}>
          <Canvas
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            camera={{ fov: 50, position: [0, 0, lowPower ? 14 : 7.2], near: 0.1, far: 100 }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[4, 5, 6]} intensity={1.4} />
            <directionalLight position={[-5, -2, 3]} intensity={0.5} />
            <Gallery lowPower={lowPower} />
          </Canvas>
        </Suspense>
      </div>
    </section>
  );
}
