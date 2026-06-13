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

      {/* design detail: subtle blue glows + grid so the bg isn't flat black */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(70% 50% at 50% 0%, hsl(220 70% 22% / 0.28), transparent 60%), radial-gradient(60% 50% at 100% 100%, hsl(265 60% 25% / 0.18), transparent 60%)" }}
      />
      <div className="grid-pattern pointer-events-none absolute inset-0 opacity-[0.06]" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 42%, hsl(230 40% 3% / 0.9) 100%)" }}
      />
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-soft-light" />
    </div>
  );
}
