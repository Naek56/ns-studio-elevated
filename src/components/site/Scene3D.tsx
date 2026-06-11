import { Suspense, lazy } from "react";
import { Canvas } from "@react-three/fiber";

const EclipseScene = lazy(() => import("@/components/three/EclipseScene"));

export default function Scene3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
        <Canvas
          dpr={[1, 1.8]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          camera={{ fov: 45, position: [0, 0, 6], near: 0.1, far: 100 }}
        >
          <EclipseScene />
        </Canvas>
      </Suspense>

      {/* cinematic grading: vignette + grain */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 45%, hsl(0 0% 2% / 0.85) 100%)" }}
      />
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.13] mix-blend-soft-light" />
    </div>
  );
}
