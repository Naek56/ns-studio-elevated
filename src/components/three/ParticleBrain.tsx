import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const lerp = THREE.MathUtils.lerp;

/* ---------- tiny 3D value noise + ridged fbm (for brain folds) ---------- */
function hash(x: number, y: number, z: number) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return n - Math.floor(n);
}
function smooth(t: number) {
  return t * t * (3 - 2 * t);
}
function noise3(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = smooth(xf), v = smooth(yf), w = smooth(zf);
  const L = (a: number, b: number, t: number) => a + (b - a) * t;
  const c000 = hash(xi, yi, zi), c100 = hash(xi + 1, yi, zi);
  const c010 = hash(xi, yi + 1, zi), c110 = hash(xi + 1, yi + 1, zi);
  const c001 = hash(xi, yi, zi + 1), c101 = hash(xi + 1, yi, zi + 1);
  const c011 = hash(xi, yi + 1, zi + 1), c111 = hash(xi + 1, yi + 1, zi + 1);
  const x00 = L(c000, c100, u), x10 = L(c010, c110, u);
  const x01 = L(c001, c101, u), x11 = L(c011, c111, u);
  return L(L(x00, x10, v), L(x01, x11, v), w);
}
function ridged(x: number, y: number, z: number) {
  let a = 0, amp = 0.5, f = 1;
  for (let o = 0; o < 3; o++) {
    let n = noise3(x * f, y * f, z * f);
    n = 1 - Math.abs(2 * n - 1);
    a += n * amp;
    amp *= 0.5;
    f *= 2.15;
  }
  return a;
}

function fib(i: number, n: number) {
  const t = (i + 0.5) / n;
  const incl = Math.acos(1 - 2 * t);
  const az = i * Math.PI * (3 - Math.sqrt(5));
  return [Math.sin(incl) * Math.cos(az), Math.cos(incl), Math.sin(incl) * Math.sin(az)];
}

// Detailed procedural brain: cerebrum (two folded hemispheres with a deep
// longitudinal fissure) + cerebellum + brain stem.
function buildBrain(count: number) {
  const position = new Float32Array(count * 3);
  const scatter = new Float32Array(count * 3);
  const rand = new Float32Array(count);
  const phase = new Float32Array(count);

  const nCereb = Math.floor(count * 0.8);
  const nCbl = Math.floor(count * 0.16);

  for (let i = 0; i < count; i++) {
    let px: number, py: number, pz: number;

    if (i < nCereb) {
      // ----- cerebrum -----
      let [x, y, z] = fib(i, nCereb);
      px = x * 1.3;
      py = y * 0.92;
      pz = z * 1.6;

      // taper the frontal lobe (front = +z), flatten skull base
      const front = Math.max(0, pz);
      px *= 1 - 0.16 * front;
      py *= 1 - 0.1 * front;
      // temporal bulge on the lower sides
      if (py < 0) px *= 1.06;

      // gyrification: ridged folds displaced along the surface normal
      const r = ridged(px * 2.6 + 12, py * 2.6 + 4, pz * 2.6);
      const disp = (r - 0.5) * 0.22;
      const len = Math.hypot(px, py, pz) || 1;
      px += (px / len) * disp;
      py += (py / len) * disp;
      pz += (pz / len) * disp;

      // deep longitudinal fissure carving the top centre (x ~ 0)
      const fis = Math.exp(-(px * px) / 0.025);
      if (py > 0) py -= fis * 0.55 * py;
      px += Math.sign(px || 1) * fis * 0.06;

      // flatten the very bottom
      if (py < 0) py *= 0.92;
      py -= 0.05;
    } else if (i < nCereb + nCbl) {
      // ----- cerebellum (lower back, finer texture, two lobes) -----
      const j = i - nCereb;
      let [x, y, z] = fib(j, nCbl);
      px = x * 0.62;
      py = y * 0.42 - 0.62;
      pz = z * 0.5 - 1.15;
      const r = ridged(px * 7 + 30, py * 7, pz * 7);
      const disp = (r - 0.5) * 0.12;
      const len = Math.hypot(px, py, pz) || 1;
      px += (px / len) * disp;
      py += (py / len) * disp;
      pz += (pz / len) * disp;
      // central vermis groove
      px += Math.sign(px || 1) * Math.exp(-(px * px) / 0.02) * 0.03;
    } else {
      // ----- brain stem (small tube going down-back) -----
      const j = i - nCereb - nCbl;
      const n = count - nCereb - nCbl;
      const t = j / n;
      const a = (j * 2.4) % (Math.PI * 2);
      const rad = 0.12 * (1 - t * 0.4);
      px = Math.cos(a) * rad;
      pz = -1.15 + Math.sin(a) * rad * 0.6;
      py = -0.95 - t * 0.7;
    }

    position[i * 3] = px;
    position[i * 3 + 1] = py;
    position[i * 3 + 2] = pz;

    const dl = Math.hypot(px, py, pz) || 1;
    const spread = 1.5 + Math.random() * 3.4;
    scatter[i * 3] = (px / dl) * spread + (Math.random() - 0.5) * 2.6;
    scatter[i * 3 + 1] = (py / dl) * spread + (Math.random() - 0.5) * 2.6;
    scatter[i * 3 + 2] = (pz / dl) * spread + (Math.random() - 0.5) * 2.6;

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
    p += 0.025 * vec3(sin(uTime*0.6 + aPhase), cos(uTime*0.5 + aPhase*1.3), sin(uTime*0.4 + aPhase));
    vec3 scattered = position + aScatter;
    p = mix(p, scattered, uScatter);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (uSize * (0.5 + aRand)) * uPixel / -mv.z;
    vShade = mix(0.5, 1.0, aRand) * (1.0 - 0.45 * uScatter);
  }
`;

const fragmentShader = /* glsl */ `
  varying float vShade;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (length(c) > 0.5) discard;
    float a = smoothstep(0.5, 0.06, length(c));
    gl_FragColor = vec4(vec3(vShade), a);
  }
`;

export default function ParticleBrain({ lowPower }: { lowPower: boolean }) {
  const group = useRef<THREE.Group>(null);
  const count = lowPower ? 9000 : 22000;

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
        uSize: { value: lowPower ? 20 : 24 },
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

  const coarse = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
    []
  );

  useFrame((state, delta) => {
    const mat = points.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = state.clock.elapsedTime;

    // scatter driven by SCROLL POSITION: breaks apart and reforms as you go down
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const prog = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    const cycles = 4;
    const target = 0.5 - 0.5 * Math.cos(prog * Math.PI * 2 * cycles);
    mat.uniforms.uScatter.value = lerp(mat.uniforms.uScatter.value, target, 0.09);

    if (group.current) {
      group.current.rotation.y += delta * 0.04;
      if (!coarse) {
        group.current.rotation.x = lerp(group.current.rotation.x, -0.15 - state.pointer.y * 0.25, 0.04);
        group.current.position.x = lerp(group.current.position.x, state.pointer.x * 0.4, 0.04);
      } else {
        group.current.rotation.x = -0.12;
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
          <Bloom intensity={0.85} luminanceThreshold={0.2} luminanceSmoothing={0.85} mipmapBlur radius={0.7} />
        </EffectComposer>
      )}
    </>
  );
}
