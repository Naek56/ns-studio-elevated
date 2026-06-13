import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const lerp = THREE.MathUtils.lerp;

function fibDir(i: number, n: number) {
  const t = (i + 0.5) / n;
  const incl = Math.acos(1 - 2 * t);
  const az = i * Math.PI * (3 - Math.sqrt(5));
  return [Math.sin(incl) * Math.cos(az), Math.cos(incl), Math.sin(incl) * Math.sin(az)];
}

/* ---------------- value noise + ridged fbm (brain folds) ---------------- */
function hash(x: number, y: number, z: number) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return n - Math.floor(n);
}
const sm = (t: number) => t * t * (3 - 2 * t);
function noise3(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = sm(xf), v = sm(yf), w = sm(zf);
  const L = (a: number, b: number, t: number) => a + (b - a) * t;
  const c000 = hash(xi, yi, zi), c100 = hash(xi + 1, yi, zi);
  const c010 = hash(xi, yi + 1, zi), c110 = hash(xi + 1, yi + 1, zi);
  const c001 = hash(xi, yi, zi + 1), c101 = hash(xi + 1, yi, zi + 1);
  const c011 = hash(xi, yi + 1, zi + 1), c111 = hash(xi + 1, yi + 1, zi + 1);
  const x00 = L(c000, c100, u), x10 = L(c010, c110, u);
  const x01 = L(c001, c101, u), x11 = L(c011, c111, u);
  return L(L(x00, x10, v), L(x01, x11, v), w);
}
function ridged(x: number, y: number, z: number, oct = 4) {
  let a = 0, amp = 0.5, f = 1;
  for (let o = 0; o < oct; o++) {
    let n = noise3(x * f, y * f, z * f);
    n = 1 - Math.abs(2 * n - 1);
    a += n * amp; amp *= 0.5; f *= 2.13;
  }
  return a;
}

/* ---------------- shape 0: detailed brain ---------------- */
function shapeBrain(count: number, cerebrumOnly = false) {
  const p = new Float32Array(count * 3);
  const nC = cerebrumOnly ? count : Math.floor(count * 0.8);
  const nB = cerebrumOnly ? 0 : Math.floor(count * 0.16);
  for (let i = 0; i < count; i++) {
    let px: number, py: number, pz: number;
    if (i < nC) {
      let [x, y, z] = fibDir(i, nC);
      px = x * 1.3; py = y * 0.92; pz = z * 1.6;
      const front = Math.max(0, pz);
      px *= 1 - 0.16 * front; py *= 1 - 0.1 * front;
      if (py < 0) px *= 1.06;
      const r = ridged(px * 3.0 + 12, py * 3.0 + 4, pz * 3.0, 5);
      const fine = ridged(px * 6.4 + 40, py * 6.4 + 9, pz * 6.4, 3);
      const disp = (r - 0.5) * 0.24 + (fine - 0.5) * 0.09;
      const len = Math.hypot(px, py, pz) || 1;
      px += (px / len) * disp; py += (py / len) * disp; pz += (pz / len) * disp;
      const fis = Math.exp(-(px * px) / 0.022);
      if (py > 0) py -= fis * 0.58 * py;
      px += Math.sign(px || 1) * fis * 0.06;
      if (py < 0) py *= 0.92;
      py -= 0.05;
    } else if (i < nC + nB) {
      const j = i - nC;
      let [x, y, z] = fibDir(j, nB);
      px = x * 0.62; py = y * 0.42 - 0.62; pz = z * 0.5 - 1.15;
      const r = ridged(px * 8 + 30, py * 8, pz * 8, 4);
      const disp = (r - 0.5) * 0.12;
      const len = Math.hypot(px, py, pz) || 1;
      px += (px / len) * disp; py += (py / len) * disp; pz += (pz / len) * disp;
      px += Math.sign(px || 1) * Math.exp(-(px * px) / 0.02) * 0.03;
    } else {
      const j = i - nC - nB; const n = count - nC - nB;
      const t = j / n; const a = (j * 2.4) % (Math.PI * 2);
      const rad = 0.12 * (1 - t * 0.4);
      px = Math.cos(a) * rad; pz = -1.15 + Math.sin(a) * rad * 0.6; py = -0.95 - t * 0.7;
    }
    p[i * 3] = px; p[i * 3 + 1] = py; p[i * 3 + 2] = pz;
  }
  return p;
}

/* ---------------- shape 2: DNA double helix ---------------- */
function shapeDNA(count: number) {
  const p = new Float32Array(count * 3);
  const turns = 3.2, radius = 0.62, height = 3.6;
  for (let i = 0; i < count; i++) {
    const t = Math.random();
    const y = (t - 0.5) * height;
    const ang = t * turns * Math.PI * 2;
    let px: number, py: number, pz: number;
    if (i % 5 === 0) {
      // base-pair rung between the two strands
      const f = Math.random();
      const x0 = Math.cos(ang) * radius, z0 = Math.sin(ang) * radius;
      const x1 = Math.cos(ang + Math.PI) * radius, z1 = Math.sin(ang + Math.PI) * radius;
      px = x0 + (x1 - x0) * f; pz = z0 + (z1 - z0) * f; py = y;
    } else {
      const strand = i % 2 === 0 ? 0 : Math.PI;
      const jitter = 0.05;
      px = Math.cos(ang + strand) * radius + (Math.random() - 0.5) * jitter;
      pz = Math.sin(ang + strand) * radius + (Math.random() - 0.5) * jitter;
      py = y + (Math.random() - 0.5) * jitter;
    }
    p[i * 3] = px; p[i * 3 + 1] = py; p[i * 3 + 2] = pz;
  }
  return p;
}

/* ---------------- shape 3: wireframe globe ---------------- */
function shapeGlobe(count: number) {
  const p = new Float32Array(count * 3);
  const R = 1.75, nLon = 24, nLat = 13;
  for (let i = 0; i < count; i++) {
    let lat: number, lon: number;
    if (i % 2 === 0) {
      lon = (Math.floor(Math.random() * nLon) / nLon) * Math.PI * 2;
      lat = (Math.random() - 0.5) * Math.PI;
    } else {
      lat = ((Math.floor(Math.random() * nLat) / (nLat - 1)) - 0.5) * Math.PI;
      lon = Math.random() * Math.PI * 2;
    }
    const cl = Math.cos(lat);
    p[i * 3] = R * cl * Math.cos(lon);
    p[i * 3 + 1] = R * Math.sin(lat);
    p[i * 3 + 2] = R * cl * Math.sin(lon);
  }
  return p;
}

/* ---------------- shape: WAY logo (W in a circle) ---------------- */
function shapeLogo(count: number) {
  const p = new Float32Array(count * 3);
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
  const R = 22 * s;
  for (let i = 0; i < count; i++) {
    if (i < nW) {
      let r = Math.random() * total, si = 0;
      while (si < segs.length - 1 && r > segs[si].len) { r -= segs[si].len; si++; }
      const sg = segs[si], t = Math.random();
      p[i * 3] = sg.ax + (sg.bx - sg.ax) * t + (Math.random() - 0.5) * 0.08;
      p[i * 3 + 1] = sg.ay + (sg.by - sg.ay) * t + (Math.random() - 0.5) * 0.08;
      p[i * 3 + 2] = (Math.random() - 0.5) * 0.18;
    } else {
      const a = Math.random() * Math.PI * 2, rr = R + (Math.random() - 0.5) * 0.1;
      p[i * 3] = Math.cos(a) * rr;
      p[i * 3 + 1] = Math.sin(a) * rr;
      p[i * 3 + 2] = (Math.random() - 0.5) * 0.18;
    }
  }
  return p;
}

/* ---------------- shape: an eye ---------------- */
function shapeEye(count: number) {
  const p = new Float32Array(count * 3);
  const W = 1.75, A = 0.82, irisR = 0.52, pupil = 0.16;
  const nOut = Math.floor(count * 0.3);
  const nIris = Math.floor(count * 0.3);
  const nSpoke = Math.floor(count * 0.14);
  let i = 0;
  for (; i < nOut; i++) {
    const x = (Math.random() * 2 - 1) * W;
    const env = 1 - (x / W) * (x / W);
    const up = Math.random() < 0.5;
    p[i * 3] = x;
    p[i * 3 + 1] = (up ? A : -A * 0.72) * env + (Math.random() - 0.5) * 0.04;
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
  }
  for (let k = 0; k < nIris; k++, i++) {
    const a = Math.random() * Math.PI * 2, rr = irisR + (Math.random() - 0.5) * 0.05;
    p[i * 3] = Math.cos(a) * rr;
    p[i * 3 + 1] = Math.sin(a) * rr * 0.95;
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.07;
  }
  for (let k = 0; k < nSpoke; k++, i++) {
    const a = (Math.floor(Math.random() * 28) / 28) * Math.PI * 2;
    const rr = pupil + Math.random() * (irisR - pupil);
    p[i * 3] = Math.cos(a) * rr;
    p[i * 3 + 1] = Math.sin(a) * rr * 0.95;
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
  }
  for (; i < count; i++) {
    let x = 0, y = 0;
    for (let g = 0; g < 12; g++) {
      x = (Math.random() * 2 - 1) * W;
      const env = 1 - (x / W) * (x / W);
      y = (-A * 0.72 * env) + Math.random() * (A * env + A * 0.72 * env);
      if (x * x + y * y > pupil * pupil) break; // keep the pupil empty
    }
    p[i * 3] = x;
    p[i * 3 + 1] = y;
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
  }
  return p;
}

/* ---------------- shape: AI brain (cerebrum + wireframe network) ---------------- */
function shapeAIBrain(count: number) {
  const p = new Float32Array(count * 3);
  // cerebrum only (no cerebellum / stem ball at the bottom)
  const nBrain = Math.floor(count * 0.5);
  const brain = shapeBrain(nBrain, true);
  for (let k = 0; k < nBrain * 3; k++) p[k] = brain[k] * 0.9;

  // network of nodes wrapping the brain like the reference image
  const K = 62;
  const nodes: [number, number, number][] = [];
  for (let k = 0; k < K; k++) {
    const [x, y, z] = fibDir(k + 1, K);
    const r = 1.08 + Math.random() * 0.22;
    nodes.push([x * 1.75 * r, y * 1.3 * r, z * 2.15 * r]);
  }
  // connect each node to its 3 nearest -> polygonal web
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  for (let a = 0; a < K; a++) {
    const d = nodes
      .map((n, b) => ({ b, v: b === a ? 1e9 : (n[0] - nodes[a][0]) ** 2 + (n[1] - nodes[a][1]) ** 2 + (n[2] - nodes[a][2]) ** 2 }))
      .sort((x, y) => x.v - y.v);
    for (let m = 0; m < 3; m++) {
      const key = a < d[m].b ? `${a}_${d[m].b}` : `${d[m].b}_${a}`;
      if (!seen.has(key)) { seen.add(key); edges.push([a, d[m].b]); }
    }
  }

  let i = nBrain;
  // bright node clusters
  for (let k = 0; k < K && i < count; k++) {
    for (let m = 0; m < 3 && i < count; m++, i++) {
      p[i * 3] = nodes[k][0] + (Math.random() - 0.5) * 0.05;
      p[i * 3 + 1] = nodes[k][1] + (Math.random() - 0.5) * 0.05;
      p[i * 3 + 2] = nodes[k][2] + (Math.random() - 0.5) * 0.05;
    }
  }
  // dense points along the edges so the connections read as lines
  while (i < count) {
    const e = edges[Math.floor(Math.random() * edges.length)];
    const a = nodes[e[0]], b = nodes[e[1]], t = Math.random();
    p[i * 3] = a[0] + (b[0] - a[0]) * t + (Math.random() - 0.5) * 0.015;
    p[i * 3 + 1] = a[1] + (b[1] - a[1]) * t + (Math.random() - 0.5) * 0.015;
    p[i * 3 + 2] = a[2] + (b[2] - a[2]) * t + (Math.random() - 0.5) * 0.015;
    i++;
  }
  return p;
}

const vertexShader = /* glsl */ `
  uniform float uTime, uScatter, uSize, uPixel;
  attribute vec3 aCloud;
  attribute float aRand, aPhase;
  varying float vShade;
  varying float vGrad;
  void main() {
    vec3 p = position;
    // colour gradient factor from the resting shape (stable during scatter)
    vGrad = clamp((position.y + 1.9) / 3.8, 0.0, 1.0);
    // idle drift
    p += 0.022 * vec3(sin(uTime*0.6 + aPhase), cos(uTime*0.5 + aPhase*1.3), sin(uTime*0.4 + aPhase));
    p = mix(p, aCloud, uScatter);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (uSize * (0.5 + aRand)) * uPixel / -mv.z;
    float depth = clamp((9.0 - (-mv.z)) / 7.0, 0.2, 1.0);
    vShade = mix(0.4, 1.0, aRand) * mix(0.62, 1.0, depth) * (1.0 - 0.45 * uScatter);
  }
`;
const fragmentShader = /* glsl */ `
  uniform vec3 uColorA, uColorB;
  varying float vShade;
  varying float vGrad;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (length(c) > 0.5) discard;
    float a = smoothstep(0.5, 0.06, length(c));
    // soft two-tone gradient per model (muted, with contrast)
    vec3 col = mix(uColorA, uColorB, vGrad);
    gl_FragColor = vec4(col * vShade, a);
  }
`;

// muted two-tone palette per model (soft, with contrast — not vivid)
// index: 0 logo, 1 eye, 2 globe, 3 AI-brain, 4 DNA
const PALETTES: [string, string][] = [
  ["#6a63c0", "#b487d6"], // logo: indigo -> violet
  ["#5aa6d8", "#7fd6e0"], // eye: blue -> cyan
  ["#5392c4", "#86c9bd"], // globe: sky -> aqua
  ["#6f7ae0", "#69d6e0"], // AI brain: indigo -> cyan
  ["#3f9f96", "#5f86c4"], // DNA: teal -> blue
];

// Per-section: which shape forms, and which side the form sits on (x>0 = right).
const SECTIONS = [
  { id: "accueil", shape: 0, x: 0 },   // logo
  { id: "manifeste", shape: 1, x: 2.2 }, // eye
  { id: "studio", shape: 2, x: -2.2 },   // globe
  { id: "kairos", shape: 3, x: 2.2 },    // AI brain
  { id: "vision", shape: 4, x: -2.2 },   // DNA
  { id: "contact", shape: 0, x: 0 },   // logo
];

export default function ParticleBrain({ lowPower }: { lowPower: boolean }) {
  const group = useRef<THREE.Group>(null);
  const seg = useRef(0);
  const count = lowPower ? 10000 : 32000;

  const { points, shapes } = useMemo(() => {
    const shapes = [shapeLogo(count), shapeEye(count), shapeGlobe(count), shapeAIBrain(count), shapeDNA(count)];
    const cloud = new Float32Array(count * 3);
    const rand = new Float32Array(count);
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const [dx, dy, dz] = fibDir(i * 1.7 + 3, count);
      const s = 2.6 + Math.random() * 3.4;
      cloud[i * 3] = dx * s + (Math.random() - 0.5) * 2.5;
      cloud[i * 3 + 1] = dy * s + (Math.random() - 0.5) * 2.5;
      cloud[i * 3 + 2] = dz * s + (Math.random() - 0.5) * 2.5;
      rand[i] = Math.random();
      phase[i] = Math.random() * Math.PI * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(shapes[0].slice(), 3));
    geo.setAttribute("aCloud", new THREE.BufferAttribute(cloud, 3));
    geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScatter: { value: 0 },
        uSize: { value: lowPower ? 22 : 26 },
        uPixel: { value: Math.min(window.devicePixelRatio || 1, 2) },
        uColorA: { value: new THREE.Color(PALETTES[0][0]) },
        uColorB: { value: new THREE.Color(PALETTES[0][1]) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { points: new THREE.Points(geo, mat), shapes };
  }, [count, lowPower]);

  const coarse = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
    []
  );

  // track the cursor on window (the canvas is behind the content)
  const ptr = useRef({ x: 0, y: 0, active: false });
  useEffect(() => {
    if (coarse) return;
    const onMove = (e: PointerEvent) => {
      ptr.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      ptr.current.active = true;
    };
    const onLeave = () => (ptr.current.active = false);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [coarse]);

  useFrame((state) => {
    const mat = points.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = state.clock.elapsedTime;

    // Find the nearest section: the form is FULLY FORMED at a section centre
    // and only disperses during the transition between two sections.
    const center = window.scrollY + window.innerHeight / 2;
    const centers = SECTIONS.map((s) => {
      const el = document.getElementById(s.id);
      return el ? el.offsetTop + el.offsetHeight / 2 : null;
    });
    let nearest = 0;
    let best = Infinity;
    centers.forEach((c, i) => {
      if (c != null && Math.abs(center - c) < best) {
        best = Math.abs(center - c);
        nearest = i;
      }
    });
    const c = centers[nearest] ?? center;
    const dir = center - c >= 0 ? 1 : -1;
    const neighbour = centers[nearest + dir];
    const spacing = neighbour != null ? Math.abs(neighbour - c) : window.innerHeight;
    const ratio = Math.min(1, Math.abs(center - c) / (spacing * 0.5));
    // stay fully formed across most of the section; disperse only near the
    // boundary (and reform quickly) -> the model is visible start to end.
    const e0 = 0.62, e1 = 0.96;
    const r = Math.min(1, Math.max(0, (ratio - e0) / (e1 - e0)));
    const scatterTarget = r * r * (3 - 2 * r);
    mat.uniforms.uScatter.value = lerp(mat.uniforms.uScatter.value, scatterTarget, 0.14);

    // swap to the section's shape (happens at the boundary, while dispersed)
    if (nearest !== seg.current) {
      seg.current = nearest;
      const idx = SECTIONS[nearest].shape % shapes.length;
      (points.geometry.attributes.position.array as Float32Array).set(shapes[idx]);
      points.geometry.attributes.position.needsUpdate = true;
      (mat.uniforms.uColorA.value as THREE.Color).set(PALETTES[idx][0]);
      (mat.uniforms.uColorB.value as THREE.Color).set(PALETTES[idx][1]);
    }

    if (group.current) {
      const mx = coarse ? 0 : ptr.current.x;
      const my = coarse ? 0 : ptr.current.y;
      // gentle turning (no deformation): auto sway + cursor-driven rotation
      const autoY = Math.sin(state.clock.elapsedTime * 0.25) * 0.45;
      group.current.rotation.y = lerp(group.current.rotation.y, autoY + mx * 0.6, 0.05);
      group.current.rotation.x = lerp(group.current.rotation.x, -0.05 - my * 0.35, 0.05);
      // desktop: form sits on the opposite side of the text (alternating).
      // tablet/phone: centred, raised and smaller so it shows above the text.
      const xTarget = lowPower ? 0 : SECTIONS[nearest].x;
      const yTarget = lowPower ? 1.25 : 0;
      group.current.position.x = lerp(group.current.position.x, xTarget, 0.05);
      group.current.position.y = lerp(group.current.position.y, yTarget, 0.05);
      const sTarget = lowPower ? 0.72 : 1;
      const sc = lerp(group.current.scale.x, sTarget, 0.05);
      group.current.scale.set(sc, sc, sc);
    }
  });

  return (
    <>
      <color attach="background" args={["#080a14"]} />
      <fogExp2 attach="fog" args={["#080a14", 0.016]} />
      <Stars radius={120} depth={70} count={lowPower ? 900 : 2600} factor={4.5} saturation={0} fade speed={0.6} />
      <group ref={group}>
        <primitive object={points} />
      </group>
      {!lowPower && (
        <EffectComposer>
          <Bloom intensity={0.75} luminanceThreshold={0.32} luminanceSmoothing={0.9} mipmapBlur radius={0.65} />
        </EffectComposer>
      )}
    </>
  );
}
