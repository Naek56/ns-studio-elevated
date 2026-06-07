import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const remap = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = THREE.MathUtils.lerp;

const WARM = "#ffdcab";

export default function DoorScene({ progress }: { progress: MotionValue<number> }) {
  const doorPivot = useRef<THREE.Group>(null);
  const glow = useRef<THREE.Mesh>(null);
  const glowMat = useRef<THREE.MeshBasicMaterial>(null);
  const spot = useRef<THREE.SpotLight>(null);
  const bloom = useRef<any>(null);

  useFrame((state) => {
    const p = progress.get();
    const cam = state.camera;

    // Door swings open
    const open = smooth(remap(p, 0.08, 0.62));
    if (doorPivot.current) doorPivot.current.rotation.y = -open * 2.15;

    // Camera dollies forward, toward and through the doorway into the light
    const t = smooth(remap(p, 0.12, 1));
    cam.position.z = lerp(7.6, -3.0, t);
    cam.position.y = lerp(1.7, 1.5, t);
    cam.position.x = lerp(0.6, 0, smooth(remap(p, 0, 0.5)));
    cam.lookAt(0, 1.55, -4.6);

    // Light floods out as the door opens
    const lp = remap(p, 0.05, 0.95);
    if (glowMat.current) {
      const b = lerp(1.1, 7.5, lp * lp);
      glowMat.current.color.setRGB(b, b * 0.92, b * 0.78);
    }
    if (glow.current) {
      const s = lerp(1, 2.6, smooth(remap(p, 0.55, 1)));
      glow.current.scale.set(s, s, 1);
    }
    if (spot.current) spot.current.intensity = lerp(3, 120, lp);
    if (bloom.current) bloom.current.intensity = lerp(0.7, 3.4, smooth(lp));
  });

  return (
    <>
      <color attach="background" args={["#070503"]} />
      <fogExp2 attach="fog" args={["#0a0604", 0.05]} />

      <ambientLight intensity={0.12} color="#ff9a4d" />
      <spotLight
        ref={spot}
        position={[0, 2.2, -6]}
        target-position={[0, 1.4, 2]}
        angle={0.9}
        penumbra={1}
        distance={40}
        color={WARM}
        intensity={3}
      />

      {/* Floor with subtle reflections to catch the glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <MeshReflectorMaterial
          resolution={512}
          mirror={0.5}
          mixBlur={1}
          mixStrength={6}
          blur={[400, 120]}
          roughness={0.85}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a0705"
          metalness={0.6}
        />
      </mesh>

      {/* Wall around the doorway (built from boxes to leave a 2 x 4 opening) */}
      <group position={[0, 0, -4]}>
        <mesh position={[-4.5, 4.5, 0]}>
          <boxGeometry args={[7, 9, 0.4]} />
          <meshStandardMaterial color="#15100c" roughness={1} />
        </mesh>
        <mesh position={[4.5, 4.5, 0]}>
          <boxGeometry args={[7, 9, 0.4]} />
          <meshStandardMaterial color="#15100c" roughness={1} />
        </mesh>
        <mesh position={[0, 6.5, 0]}>
          <boxGeometry args={[2, 5, 0.4]} />
          <meshStandardMaterial color="#15100c" roughness={1} />
        </mesh>
      </group>

      {/* Door frame (jambs + lintel) */}
      <group position={[0, 0, -3.85]}>
        <mesh position={[-1.07, 2, 0]}>
          <boxGeometry args={[0.16, 4.2, 0.3]} />
          <meshStandardMaterial color="#241a12" roughness={0.7} metalness={0.3} />
        </mesh>
        <mesh position={[1.07, 2, 0]}>
          <boxGeometry args={[0.16, 4.2, 0.3]} />
          <meshStandardMaterial color="#241a12" roughness={0.7} metalness={0.3} />
        </mesh>
        <mesh position={[0, 4.05, 0]}>
          <boxGeometry args={[2.3, 0.18, 0.3]} />
          <meshStandardMaterial color="#241a12" roughness={0.7} metalness={0.3} />
        </mesh>
      </group>

      {/* The door — pivots on its left edge */}
      <group ref={doorPivot} position={[-1, 2, -3.82]}>
        <mesh position={[0.95, 0, 0]} castShadow>
          <boxGeometry args={[1.9, 3.9, 0.09]} />
          <meshStandardMaterial color="#1c130c" roughness={0.5} metalness={0.45} />
        </mesh>
        {/* handle */}
        <mesh position={[1.7, 0, 0.08]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#ffb155" roughness={0.25} metalness={0.9} emissive="#5a2a00" />
        </mesh>
      </group>

      {/* The light behind the door */}
      <mesh ref={glow} position={[0, 2, -4.7]}>
        <planeGeometry args={[2.6, 4.4]} />
        <meshBasicMaterial ref={glowMat} color={WARM} toneMapped={false} />
      </mesh>

      {/* Floating dust caught in the beam */}
      <Sparkles count={60} scale={[4, 5, 3]} position={[0, 2.4, -2.5]} size={3} speed={0.3} color={WARM} opacity={0.5} />

      <EffectComposer>
        <Bloom ref={bloom} intensity={0.7} luminanceThreshold={0.25} luminanceSmoothing={0.9} mipmapBlur radius={0.85} />
      </EffectComposer>
    </>
  );
}
