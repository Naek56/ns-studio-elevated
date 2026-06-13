import { Suspense, lazy, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";

const ParticleBrain = lazy(() => import("@/components/three/ParticleBrain"));

export default function Scene3D() {
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setLowPower(coarse || window.innerWidth < 820);
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
        <Canvas
          dpr={lowPower ? [1, 1.5] : [1, 2]}
          gl={{ antialias: !lowPower, powerPreference: "high-performance" }}
          camera={{ fov: 45, position: [0, 0, 6], near: 0.1, far: 100 }}
        >
          <ParticleBrain lowPower={lowPower} />
        </Canvas>
      </Suspense>

      {/* cinematic grading + dim so text stays readable over the particles */}
      <div className="pointer-events-none absolute inset-0 bg-background/10" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 38%, hsl(0 0% 2% / 0.9) 100%)" }}
      />
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-soft-light" />
    </div>
  );
}
