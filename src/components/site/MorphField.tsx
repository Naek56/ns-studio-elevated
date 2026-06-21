import { Suspense, lazy, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";

const WaveScene = lazy(() => import("@/components/three/WaveScene"));

export default function MorphField() {
  const [lowPower, setLowPower] = useState(false);
  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setLowPower(coarse || window.innerWidth < 1024);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ fov: 45, position: [0, 0, 6], near: 0.1, far: 100 }}
        >
          <WaveScene lowPower={lowPower} />
        </Canvas>
      </Suspense>
      {/* vignette so text stays readable over the form */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.85) 100%)" }}
      />
      <div className="grain absolute inset-0 opacity-[0.1] mix-blend-soft-light" />
    </div>
  );
}
