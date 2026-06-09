import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import type { MutableRefObject } from "react";

const lerp = THREE.MathUtils.lerp;

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uInner;
  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);
    if (r < uInner || r > 1.0) discard;
    float t = (r - uInner) / (1.0 - uInner);

    vec3 hot = vec3(1.0, 0.96, 0.80);
    vec3 mid = vec3(1.0, 0.52, 0.14);
    vec3 cold = vec3(0.68, 0.12, 0.02);
    vec3 col = mix(hot, mid, smoothstep(0.0, 0.45, t));
    col = mix(col, cold, smoothstep(0.45, 1.0, t));

    float ang = atan(p.y, p.x);
    float bands = 0.55 + 0.45 * sin(ang * 2.0 + uTime * 1.4 - r * 10.0);
    float fine = 0.70 + 0.30 * sin(ang * 12.0 - uTime * 2.2 + r * 26.0);
    float bright = bands * fine;

    float edge = smoothstep(0.0, 0.10, t) * (1.0 - smoothstep(0.72, 1.0, t));
    float dop = 0.55 + 0.95 * pow(0.5 + 0.5 * cos(ang + 0.5), 2.0); // doppler beaming

    float a = edge * bright * dop;
    gl_FragColor = vec4(col * bright * dop * 1.7, a);
  }
`;

export default function BlackHoleScene({ diveRef }: { diveRef: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const bloom = useRef<any>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uInner: { value: 0.34 } },
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    []
  );

  useFrame((state, delta) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    if (group.current) group.current.rotation.z += delta * 0.04;

    const d = diveRef.current; // 0 .. 1 dive progress
    const cam = state.camera;
    const e = d * d;
    cam.position.z = lerp(6, 0.45, e);
    cam.position.y = lerp(0.75, 0.0, d);
    cam.lookAt(0, 0, 0);
    if (bloom.current) bloom.current.intensity = lerp(1.1, 3.0, d);
  });

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <Stars radius={90} depth={50} count={2600} factor={3.2} saturation={0} fade speed={0.6} />

      <group ref={group} rotation={[0, 0, 0.1]}>
        {/* Accretion disk, tilted near edge-on */}
        <mesh rotation={[-1.34, 0, 0]} material={material}>
          <circleGeometry args={[2.5, 128]} />
        </mesh>

        {/* Event horizon */}
        <mesh>
          <sphereGeometry args={[0.82, 64, 64]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* Photon ring (camera facing bright circle) */}
        <mesh>
          <torusGeometry args={[0.95, 0.014, 16, 160]} />
          <meshBasicMaterial color="#ffe6c2" toneMapped={false} />
        </mesh>
      </group>

      <EffectComposer>
        <Bloom ref={bloom} intensity={1.1} luminanceThreshold={0.08} luminanceSmoothing={0.8} mipmapBlur radius={0.82} />
      </EffectComposer>
    </>
  );
}
