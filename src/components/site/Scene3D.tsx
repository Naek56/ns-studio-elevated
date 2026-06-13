import { Suspense, lazy, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";

const ParticleBrain = lazy(() => import("@/components/three/ParticleBrain"));

export default function Scene3D() {
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setLowPower(coarse || window.innerWidth < 1024);
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

      {/* design detail: layered colour glows + grid so the bg isn't flat black */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(75% 55% at 50% -5%, hsl(218 80% 30% / 0.45), transparent 60%)," +
            "radial-gradient(60% 55% at 92% 105%, hsl(268 70% 34% / 0.34), transparent 60%)," +
            "radial-gradient(55% 45% at 5% 60%, hsl(195 80% 32% / 0.22), transparent 60%)",
        }}
      />
      <div className="grid-pattern pointer-events-none absolute inset-0 opacity-[0.08]" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 50%, hsl(230 45% 4% / 0.85) 100%)" }}
      />
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-soft-light" />
    </div>
  );
}
