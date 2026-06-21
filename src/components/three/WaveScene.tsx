import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ============================================================================
   ONE grayscale signature: a silky particle wave on the hero that degrades as
   you scroll, handing over to subtle per-section forms (eye first), all in the
   same black & grey material. Nothing here grabs attention; it breathes behind
   the content.
============================================================================ */

/* ---------- shapes (all white/grey, shaded by the same material) ---------- */

function shapeEye(p: Float32Array, count: number) {
  const W = 1.85, A = 0.86, irisR = 0.55, pupil = 0.2;
  const dome = (x: number, y: number) => 0.5 * Math.max(0, 1 - (x / W) ** 2 * 0.7 - (y / A) ** 2);
  let i = 0;
  const nLid = Math.floor(count * 0.26);
  const nRing = Math.floor(count * 0.16);
  const nSpoke = Math.floor(count * 0.3);
  const nPupil = Math.floor(count * 0.08);
  for (; i < nLid; i++) {
    const x = (Math.random() * 2 - 1) * W;
    const env = 1 - (x / W) * (x / W);
    const up = Math.random() < 0.55;
    const y = (up ? A : -A * 0.72) * env;
    p[i * 3] = x + (Math.random() - 0.5) * 0.05;
    p[i * 3 + 1] = y + (Math.random() - 0.5) * 0.05;
    p[i * 3 + 2] = dome(x, y) * 0.35 + (Math.random() - 0.5) * 0.04;
  }
  for (let k = 0; k < nRing; k++, i++) {
    const a = Math.random() * Math.PI * 2, rr = irisR + (Math.random() - 0.5) * 0.04;
    const x = Math.cos(a) * rr, y = Math.sin(a) * rr * 0.96;
    p[i * 3] = x; p[i * 3 + 1] = y; p[i * 3 + 2] = dome(x, y) + 0.05;
  }
  for (let k = 0; k < nSpoke; k++, i++) {
    const a = (Math.floor(Math.random() * 44) / 44) * Math.PI * 2;
    const rr = pupil + Math.random() * (irisR - pupil);
    const x = Math.cos(a) * rr, y = Math.sin(a) * rr * 0.96;
    p[i * 3] = x; p[i * 3 + 1] = y; p[i * 3 + 2] = dome(x, y) + 0.04 + rr * 0.12;
  }
  for (let k = 0; k < nPupil; k++, i++) {
    const a = Math.random() * Math.PI * 2, rr = pupil + (Math.random() - 0.5) * 0.02;
    const x = Math.cos(a) * rr, y = Math.sin(a) * rr * 0.96;
    p[i * 3] = x; p[i * 3 + 1] = y; p[i * 3 + 2] = dome(x, y) + 0.07;
  }
  for (; i < count; i++) {
    let x = 0, y = 0;
    for (let g = 0; g < 14; g++) {
      x = (Math.random() * 2 - 1) * W;
      const env = 1 - (x / W) * (x / W);
      const ymax = A * env, ymin = -A * 0.72 * env;
      y = ymin + Math.random() * (ymax - ymin);
      if (x * x + y * y > pupil * pupil) break;
    }
    p[i * 3] = x; p[i * 3 + 1] = y; p[i * 3 + 2] = dome(x, y);
  }
}

function shapeLogo(p: Float32Array, count: number) {
  const s = 0.085, cx = 24, cy = 24;
  const W: [number, number][] = [[13, 17.5], [18.5, 31], [24, 20], [29.5, 31], [35, 17.5]];
  const wp = W.map(([vx, vy]) => [(vx - cx) * s, (cy - vy) * s] as [number, number]);
  const segs: { ax: number; ay: number; bx: number; by: number; len: number }[] = [];
  let total = 0;
  for (let k = 0; k < wp.length - 1; k++) {
    const [ax, ay] = wp[k], [bx, by] = wp[k + 1];
    const len = Math.hypot(bx - ax, by - ay);
    segs.push({ ax, ay, bx, by, len });
    total += len;
  }
  const nW = Math.floor(count * 0.5);
  const R = 22 * s, tube = 0.16, depth = 0.5;
  for (let i = 0; i < count; i++) {
    if (i < nW) {
      let r = Math.random() * total, si = 0;
      while (si < segs.length - 1 && r > segs[si].len) { r -= segs[si].len; si++; }
      const sg = segs[si], t = Math.random();
      p[i * 3] = sg.ax + (sg.bx - sg.ax) * t + (Math.random() - 0.5) * 0.1;
      p[i * 3 + 1] = sg.ay + (sg.by - sg.ay) * t + (Math.random() - 0.5) * 0.1;
      p[i * 3 + 2] = (Math.random() - 0.5) * depth;
    } else {
      const a = Math.random() * Math.PI * 2, ta = Math.random() * Math.PI * 2;
      const rr = R + tube * Math.cos(ta);
      p[i * 3] = Math.cos(a) * rr;
      p[i * 3 + 1] = Math.sin(a) * rr;
      p[i * 3 + 2] = tube * Math.sin(ta);
    }
  }
}

function shapeRing(p: Float32Array, count: number) {
  const R = 1.7, tube = 0.12;
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2, ta = Math.random() * Math.PI * 2;
    const rr = R + tube * Math.cos(ta);
    p[i * 3] = Math.cos(a) * rr;
    p[i * 3 + 1] = Math.sin(a) * rr;
    p[i * 3 + 2] = tube * Math.sin(ta);
  }
}

function shapeSphere(p: Float32Array, count: number) {
  const R = 1.6;
  for (let i = 0; i < count; i++) {
    const u = Math.random(), v = Math.random();
    const theta = u * Math.PI * 2;
    const phi = Math.acos(2 * v - 1);
    const rr = R * (0.92 + Math.random() * 0.08);
    p[i * 3] = rr * Math.sin(phi) * Math.cos(theta);
    p[i * 3 + 1] = rr * Math.sin(phi) * Math.sin(theta);
    p[i * 3 + 2] = rr * Math.cos(phi);
  }
}

function shapeField(p: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    p[i * 3] = (Math.random() - 0.5) * 5;
    p[i * 3 + 1] = (Math.random() - 0.5) * 3;
    p[i * 3 + 2] = (Math.random() - 0.5) * 1.3;
  }
}

function shapeWave(p: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 5.6;
    const z = (Math.random() - 0.5) * 2.2;
    p[i * 3] = x;
    p[i * 3 + 1] = Math.sin(x * 1.1) * 0.5 + Math.cos(z * 1.3) * 0.22;
    p[i * 3 + 2] = z;
  }
}

type Builder = (p: Float32Array, count: number) => void;
const SECTIONS: { id: string; build: Builder }[] = [
  { id: "accueil", build: shapeEye },
  { id: "manifeste", build: shapeEye },
  { id: "studio", build: shapeRing },
  { id: "realisations", build: shapeField },
  { id: "kairos", build: shapeSphere },
  { id: "vision", build: shapeWave },
  { id: "contact", build: shapeLogo },
];

/* ----------------------------- wave plane -------------------------------- */

const waveVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const waveFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime, uFade, uAspect;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i+vec2(1.0,0.0)), c = hash(i+vec2(0.0,1.0)), d = hash(i+vec2(1.0,1.0));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }
  // a slowly flowing height field -> the silk drape
  float surf(vec2 uv, float t){
    vec2 flow = vec2(t * 0.5, t * 0.18);
    vec2 q = vec2(fbm(uv * 0.9 + flow), fbm(uv * 0.9 + vec2(3.1, -t * 0.3)));
    return fbm(uv * 1.15 + q * 1.1 + flow);
  }
  void main(){
    vec2 uv = vUv;
    uv.x *= uAspect;
    float t = uTime * 0.05;
    // slope-lit drape: bright silk highlights along the wave crests
    float e = 0.0025;
    float h  = surf(uv, t);
    float hx = (surf(uv + vec2(e, 0.0), t) - h) * 1.7;
    float hy = (surf(uv + vec2(0.0, e), t) - h) * 1.7;
    vec3 n = normalize(vec3(-hx, -hy, e));
    float light = clamp(dot(n, normalize(vec3(0.35, 0.55, 0.7))), 0.0, 1.0);
    light = 0.12 + 0.9 * light;
    float silk = pow(light, 1.7);
    vec3 col = vec3(0.012) + vec3(1.05) * silk;
    // film grain
    float g = hash(uv * 700.0 + uTime);
    col += (g - 0.5) * 0.03;
    gl_FragColor = vec4(col * uFade, uFade);
  }
`;

function WavePlane() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport, size } = useThree();
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uFade: { value: 1 }, uAspect: { value: 1 } }),
    []
  );

  useFrame((state) => {
    const m = mat.current;
    if (!m) return;
    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uAspect.value = size.width / size.height;
    const hero = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.85)));
    // ease the fade so it degrades smoothly
    m.uniforms.uFade.value = (1 - hero) * (1 - hero);
  });

  return (
    <mesh position={[0, 0, -1]} renderOrder={-1}>
      <planeGeometry args={[viewport.width * 1.2, viewport.height * 1.4, 1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={waveVert}
        fragmentShader={waveFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

/* --------------------------- per-section forms --------------------------- */

const formVert = /* glsl */ `
  uniform float uTime, uSize, uPixel;
  attribute float aRand, aPhase;
  varying float vShade;
  void main() {
    vec3 p = position;
    p += 0.018 * vec3(sin(uTime*0.6 + aPhase), cos(uTime*0.5 + aPhase*1.3), sin(uTime*0.4 + aPhase));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (uSize * (0.5 + aRand)) * uPixel / -mv.z;
    vShade = mix(0.4, 0.95, aRand);
  }
`;
const formFrag = /* glsl */ `
  uniform float uOpacity;
  varying float vShade;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (length(c) > 0.5) discard;
    float a = smoothstep(0.5, 0.08, length(c));
    gl_FragColor = vec4(vec3(vShade), a * uOpacity);
  }
`;

function Forms({ lowPower }: { lowPower: boolean }) {
  const count = lowPower ? 6000 : 12000;
  const scaleRef = useRef(0.62);

  const shapes = useMemo(
    () =>
      SECTIONS.map((s) => {
        const arr = new Float32Array(count * 3);
        s.build(arr, count);
        return arr;
      }),
    [count]
  );

  const points = useMemo(() => {
    const pos = new Float32Array(count * 3);
    pos.set(shapes[0]);
    const rand = new Float32Array(count);
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) { rand[i] = Math.random(); phase[i] = Math.random() * Math.PI * 2; }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: lowPower ? 13 : 15 },
        uPixel: { value: Math.min(window.devicePixelRatio || 1, 2) },
        uOpacity: { value: 0 },
      },
      vertexShader: formVert,
      fragmentShader: formFrag,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    const pts = new THREE.Points(geo, mat);
    pts.renderOrder = 1;
    return pts;
  }, [shapes, count, lowPower]);

  const ease = (t: number) => t * t * (3 - 2 * t);

  useFrame((state, delta) => {
    const mat = points.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = state.clock.elapsedTime;

    const mid = window.scrollY + window.innerHeight / 2;
    const centers = SECTIONS.map((s) => {
      const el = document.getElementById(s.id);
      return el ? el.offsetTop + el.offsetHeight / 2 : Number.POSITIVE_INFINITY;
    });

    let i = 0;
    while (i < centers.length - 1 && mid >= centers[i + 1]) i++;
    let t = 0;
    const a = centers[i], b = centers[i + 1];
    if (b !== undefined && isFinite(a) && isFinite(b) && b > a) {
      t = ease(Math.min(1, Math.max(0, (mid - a) / (b - a))));
    }
    const j = Math.min(i + 1, SECTIONS.length - 1);

    const pos = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const from = shapes[i], to = shapes[j];
    for (let k = 0; k < arr.length; k++) arr[k] = from[k] + (to[k] - from[k]) * t;
    pos.needsUpdate = true;

    // forms fade in only after the hero wave has started to degrade — stay subtle
    const hero = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.7)));
    const targetOp = ease(hero) * (lowPower ? 0.5 : 0.6);
    mat.uniforms.uOpacity.value += (targetOp - mat.uniforms.uOpacity.value) * Math.min(1, delta * 5);

    const targetScale = (lowPower ? 0.4 : 0.62);
    scaleRef.current += (targetScale - scaleRef.current) * Math.min(1, delta * 4);
    points.scale.setScalar(scaleRef.current);

    points.rotation.y -= delta * 0.05;
    points.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
  });

  return <primitive object={points} />;
}

export default function WaveScene({ lowPower }: { lowPower: boolean }) {
  return (
    <>
      <WavePlane />
      <Forms lowPower={lowPower} />
    </>
  );
}
