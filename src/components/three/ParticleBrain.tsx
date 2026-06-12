import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const lerp = THREE.MathUtils.lerp;
const clamp = THREE.MathUtils.clamp;

// Procedural "brain" point cloud: a folded ellipsoid with a central
// longitudinal fissure (two hemispheres). Represents intelligence.
function buildBrain(count: number) {
  const position = new Float32Array(count * 3);
  const scatter = new Float32Array(count * 3);
  const rand = new Float32Array(count);
  const phase = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    const incl = Math.acos(1 - 2 * t);
    const az = i * golden;
    let x = Math.sin(incl) * Math.cos(az);
    let y = Math.cos(incl);
    let z = Math.sin(incl) * Math.sin(az);

    // brain proportions: wider L-R, longer front-back, shorter height
    x *= 1.28;
    y *= 0.92;
    z *= 1.5;

    // gyri / sulci folds
    const fold =
      0.1 * Math.sin(8 * x + 2.5 * z) * Math.sin(7 * z) +
      0.06 * Math.sin(10 * y + 4 * x) +
      0.04 * Math.sin(14 * z - 5 * y);
    const n = 1 + fold;
    x *= n;
    y *= n;
    z *= n;

    // longitudinal fissure: dip the top along the midline (x ~ 0)
    const mid = Math.exp(-(x * x) / 0.05);
    if (y > 0) y -= mid * 0.32 * y;

    const s = 1.15;
    position[i * 3] = x * s;
    position[i * 3 + 1] = y * s;
    position[i * 3 + 2] = z * s;

    // scatter target: explode outward + jitter
    const dl = Math.hypot(x, y, z) || 1;
    const spread = 1.4 + Math.random() * 3.2;
    scatter[i * 3] = (x / dl) * spread + (Math.random() - 0.5) * 2.4;
    scatter[i * 3 + 1] = (y / dl) * spread + (Math.random() - 0.5) * 2.4;
    scatter[i * 3 + 2] = (z / dl) * spread + (Math.random() - 0.5) * 2.4;

    rand[i] = Math.random();
    phase[i] = Math.random() * Math.PI * 2;
  }
  return { position, scatter, rand, phase };
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScatter;
  uniform float uSize;
  uniform float uPixel;
  attribute vec3 aScatter;
  attribute float aRand;
  attribute float aPhase;
  varying float vShade;
  void main() {
    vec3 p = position;
    p += 0.03 * vec3(sin(uTime*0.6 + aPhase), cos(uTime*0.5 + aPhase*1.3), sin(uTime*0.4 + aPhase));
    vec3 scattered = position + aScatter;
    p = mix(p, scattered, uScatter);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (uSize * (0.5 + aRand)) * uPixel / -mv.z;
    vShade = mix(0.45, 1.0, aRand) * (1.0 - 0.5 * uScatter);
  }
`;

const fragmentShader = /* glsl */ `
  varying float vShade;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.08, d);
    gl_FragColor = vec4(vec3(vShade), a);
  }
`;

export default function ParticleBrain({ lowPower }: { lowPower: boolean }) {
  const group = useRef<THREE.Group>(null);
  const scatterTarget = useRef(0);
  const lastScroll = useRef(0);

  const count = lowPower ? 7000 : 16000;

  const points = useMemo(() => {
    const { position, scatter, rand, phase } = buildBrain(count);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(position, 3));
    geo.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
    geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScatter: { value: 0 },
        uSize: { value: lowPower ? 22 : 26 },
        uPixel: { value: Math.min(window.devicePixelRatio || 1, 2) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Points(geo, mat);
  }, [count, lowPower]);

  useEffect(() => {
    lastScroll.current = window.scrollY;
    const onScroll = () => {
      const v = Math.abs(window.scrollY - lastScroll.current);
      lastScroll.current = window.scrollY;
      scatterTarget.current = clamp(scatterTarget.current + v * 0.006, 0, 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const coarse = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
    []
  );

  useFrame((state, delta) => {
    const mat = points.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = state.clock.elapsedTime;

    // scroll makes it disperse; idle makes it reform
    scatterTarget.current *= 0.92;
    mat.uniforms.uScatter.value = lerp(mat.uniforms.uScatter.value, scatterTarget.current, 0.08);

    if (group.current) {
      group.current.rotation.y += delta * 0.05;
      if (!coarse) {
        group.current.rotation.y = lerp(group.current.rotation.y, group.current.rotation.y + state.pointer.x * 0.3, 0.05);
        group.current.rotation.x = lerp(group.current.rotation.x, -state.pointer.y * 0.25, 0.04);
      }
    }
  });

  return (
    <>
      <color attach="background" args={["#040404"]} />
      <group ref={group}>
        <primitive object={points} />
      </group>
      {!lowPower && (
        <EffectComposer>
          <Bloom intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.85} mipmapBlur radius={0.7} />
        </EffectComposer>
      )}
    </>
  );
}
