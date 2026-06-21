import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ----------------------------------------------------------------------------
   ONE white particle form that lives through the whole scroll.
   It never spawns new objects: the same cloud stretches, contracts and
   reorganises from one section to the next.
---------------------------------------------------------------------------- */

// Hero / Contact signature: W inside a ring (the WAY logo as particles)
function buildLogo(p: Float32Array, count: number) {
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

// Manifeste: the form stretches into a wide horizontal streak
function buildStretch(p: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const x = (u - 0.5) * 6.4;
    const fall = Math.exp(-Math.abs(x) * 0.5);
    p[i * 3] = x;
    p[i * 3 + 1] = (Math.random() - 0.5) * 0.9 * fall;
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.7 * fall;
  }
}

// Studio: a clean open ring
function buildRing(p: Float32Array, count: number) {
  const R = 1.9, tube = 0.12;
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2, ta = Math.random() * Math.PI * 2;
    const rr = R + tube * Math.cos(ta);
    p[i * 3] = Math.cos(a) * rr;
    p[i * 3 + 1] = Math.sin(a) * rr;
    p[i * 3 + 2] = tube * Math.sin(ta) + (Math.random() - 0.5) * 0.05;
  }
}

// Nos directions: the form scatters into a soft grid-field (portfolio)
function buildField(p: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    p[i * 3] = (Math.random() - 0.5) * 5.2;
    p[i * 3 + 1] = (Math.random() - 0.5) * 3.2;
    p[i * 3 + 2] = (Math.random() - 0.5) * 1.4;
  }
}

// Kairos: it gathers into a full sphere (the intelligence)
function buildSphere(p: Float32Array, count: number) {
  const R = 1.7;
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

// Vision: it flattens into a calm wave
function buildWave(p: Float32Array, count: number) {
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 6;
    const z = (Math.random() - 0.5) * 2.4;
    p[i * 3] = x;
    p[i * 3 + 1] = Math.sin(x * 1.1) * 0.55 + Math.cos(z * 1.4) * 0.25;
    p[i * 3 + 2] = z;
  }
}

type Builder = (p: Float32Array, count: number) => void;

// section id -> shape + size, in scroll order
const SECTIONS: { id: string; build: Builder; scale: number }[] = [
  { id: "accueil", build: buildLogo, scale: 1.0 },
  { id: "manifeste", build: buildStretch, scale: 0.85 },
  { id: "studio", build: buildRing, scale: 0.8 },
  { id: "realisations", build: buildField, scale: 0.85 },
  { id: "kairos", build: buildSphere, scale: 0.8 },
  { id: "vision", build: buildWave, scale: 0.8 },
  { id: "contact", build: buildLogo, scale: 1.0 },
];

const vertexShader = /* glsl */ `
  uniform float uTime, uSize, uPixel;
  attribute float aRand, aPhase;
  varying float vShade;
  void main() {
    vec3 p = position;
    p += 0.02 * vec3(sin(uTime*0.6 + aPhase), cos(uTime*0.5 + aPhase*1.3), sin(uTime*0.4 + aPhase));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (uSize * (0.5 + aRand)) * uPixel / -mv.z;
    vShade = mix(0.5, 1.0, aRand);
  }
`;
const fragmentShader = /* glsl */ `
  varying float vShade;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (length(c) > 0.5) discard;
    float a = smoothstep(0.5, 0.08, length(c));
    gl_FragColor = vec4(vec3(vShade), a);
  }
`;

export default function MorphCloud({ lowPower }: { lowPower: boolean }) {
  const groupScale = useRef(1);
  const { size } = useThree();

  const count = lowPower ? 4500 : 9000;

  // pre-bake every shape once
  const shapes = useMemo(() => {
    return SECTIONS.map((s) => {
      const arr = new Float32Array(count * 3);
      s.build(arr, count);
      return arr;
    });
  }, [count]);

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
        uSize: { value: lowPower ? 14 : 16 },
        uPixel: { value: Math.min(window.devicePixelRatio || 1, 2) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Points(geo, mat);
  }, [shapes, count, lowPower]);

  const ease = (t: number) => t * t * (3 - 2 * t); // smoothstep

  useFrame((state, delta) => {
    const mat = points.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = state.clock.elapsedTime;

    // where is the viewport centre relative to each section centre?
    const mid = window.scrollY + window.innerHeight / 2;
    const centers = SECTIONS.map((s) => {
      const el = document.getElementById(s.id);
      if (!el) return Number.POSITIVE_INFINITY;
      return el.offsetTop + el.offsetHeight / 2;
    });

    // find the pair of sections we are between
    let i = 0;
    while (i < centers.length - 1 && mid >= centers[i + 1]) i++;
    let t = 0;
    const a = centers[i], b = centers[i + 1];
    if (b !== undefined && isFinite(a) && isFinite(b) && b > a) {
      t = ease(Math.min(1, Math.max(0, (mid - a) / (b - a))));
    }
    const j = Math.min(i + 1, SECTIONS.length - 1);

    // morph the live positions between the two shapes
    const pos = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const from = shapes[i], to = shapes[j];
    for (let k = 0; k < arr.length; k++) {
      arr[k] = from[k] + (to[k] - from[k]) * t;
    }
    pos.needsUpdate = true;

    // size lerps with the morph; mobile keeps it at ~40%
    const targetScale = (SECTIONS[i].scale + (SECTIONS[j].scale - SECTIONS[i].scale) * t) * (lowPower ? 0.4 : 1);
    groupScale.current += (targetScale - groupScale.current) * Math.min(1, delta * 4);
    points.scale.setScalar(groupScale.current);

    // gentle continuous drift to the left, plus a slow breathing tilt
    points.rotation.y -= delta * 0.06;
    points.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.12;
  });

  // keep point size crisp if the canvas pixel ratio changes
  useMemo(() => {
    const mat = points.material as THREE.ShaderMaterial;
    mat.uniforms.uPixel.value = Math.min(window.devicePixelRatio || 1, 2);
  }, [points, size]);

  return <primitive object={points} />;
}
