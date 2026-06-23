import { Suspense, lazy, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Reveal from "./Reveal";

const Gallery = lazy(() => import("@/components/three/Gallery"));

export default function Realisations() {
  const [lowPower, setLowPower] = useState(false);
  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setLowPower(coarse || window.innerWidth < 1024);
  }, []);

  return (
    <section id="realisations" className="relative bg-black py-24 md:py-36">
      <div className="mx-auto max-w-[1300px] px-6 md:px-12">
        <Reveal>
          <p className="label">Réalisations</p>
          <h2 className="display-xl mt-5 text-4xl font-semibold text-white sm:text-5xl md:text-6xl">
            Quelques projets.
          </h2>
          <p className="mt-4 text-sm text-white/45">Glissez pour explorer la galerie.</p>
        </Reveal>
      </div>

      <div className="relative mt-8 h-[58vh] w-full md:mt-12 md:h-[68vh]">
        <Suspense fallback={null}>
          <Canvas
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            camera={{ fov: 42, position: [0, 0, 5.2], near: 0.1, far: 100 }}
          >
            <Gallery lowPower={lowPower} />
          </Canvas>
        </Suspense>
      </div>
    </section>
  );
}
