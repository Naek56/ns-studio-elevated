import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const lerp = THREE.MathUtils.lerp;

const vertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

// Black sphere with a luminous white rim (eclipse / planet / eye).
const fragment = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  uniform float uTime;
  void main() {
    float f = 1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0);
    float rim = pow(f, 2.4);
    // a brighter crescent that slowly travels around the edge
    float ang = atan(vNormal.y, vNormal.x);
    float crescent = 0.5 + 0.5 * cos(ang - uTime * 0.25);
    rim *= 0.55 + 0.75 * crescent;
    vec3 base = vec3(0.012);
    vec3 col = base + vec3(1.0) * rim * 1.7;
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function EclipseScene() {
  const sphere = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: vertex,
        fragmentShader: fragment,
        toneMapped: false,
      }),
    []
  );

  useFrame((state, delta) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    if (sphere.current) sphere.current.rotation.y += delta * 0.05;
    if (group.current) {
      // subtle parallax following the pointer
      const px = state.pointer.x;
      const py = state.pointer.y;
      group.current.rotation.y = lerp(group.current.rotation.y, px * 0.25, 0.04);
      group.current.rotation.x = lerp(group.current.rotation.x, -py * 0.2, 0.04);
    }
  });

  return (
    <>
      <color attach="background" args={["#040404"]} />
      <Stars radius={120} depth={60} count={1800} factor={3} saturation={0} fade speed={0.4} />

      <group ref={group}>
        <mesh ref={sphere} material={material}>
          <icosahedronGeometry args={[1.85, 24]} />
        </mesh>
      </group>

      <EffectComposer>
        <Bloom intensity={1.25} luminanceThreshold={0.15} luminanceSmoothing={0.85} mipmapBlur radius={0.8} />
      </EffectComposer>
    </>
  );
}
