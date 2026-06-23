import { Suspense, lazy, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Reveal from "./Reveal";

const Gallery = lazy(() => import("@/components/three/Gallery"));

export default function Realisations() {
  const [lowPower] = useState(
    () => typeof window !== "undefined" && (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 1024)
  );

  return (
    <section id="realisations" className="relative bg-black py-24 md:py-36">
      <div className="mx-auto max-w-[1300px] px-6 text-center md:px-12">
        <Reveal>
          <p className="label">Réalisations</p>
          <h2 className="display-xl mt-5 text-4xl font-semibold text-white sm:text-5xl md:text-6xl">
            Quelques projets.
          </h2>
          <p className="mt-4 text-sm text-white/45">Survolez les cartes.</p>
        </Reveal>
      </div>

      <div className="relative mt-8 h-[58vh] w-full md:mt-12 md:h-[64vh]">
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
