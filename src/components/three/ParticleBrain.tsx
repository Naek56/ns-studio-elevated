import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const lerp = THREE.MathUtils.lerp;
const _v = new THREE.Vector3();
const _w = new THREE.Vector3();

function fibDir(i: number, n: number) {
  const t = (i + 0.5) / n;
  const incl = Math.acos(1 - 2 * t);
  const az = i * Math.PI * (3 - Math.sqrt(5));
  return [Math.sin(incl) * Math.cos(az), Math.cos(incl), Math.sin(incl) * Math.sin(az)];
}

/* ---------------- shape 1: a recognizable 3D heart ---------------- */
function heart2D(t: number) {
  // classic heart curve
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y =
    13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return [x, y];
}
function shapeHeart(count: number) {
  const p = new Float32Array(count * 3);
  // boundary polygon for the point-in-shape test
  const B = 240;
  const bx: number[] = [];
  const by: number[] = [];
  for (let k = 0; k < B; k++) {
    const [x, y] = heart2D((k / B) * Math.PI * 2);
    bx.push(x);
    by.push(y);
  }
  const inside = (X: number, Y: number) => {
    let hit = false;
    for (let i = 0, j = B - 1; i < B; j = i++) {
      if (by[i] > Y !== by[j] > Y && X < ((bx[j] - bx[i]) * (Y - by[i])) / (by[j] - by[i]) + bx[i]) hit = !hit;
    }
    return hit;
  };
  const S = 0.115; // scale
  const cy = 1.2; // recentre vertically
  let i = 0;
  let guard = 0;
  while (i < count && guard < count * 60) {
    guard++;
    const X = (Math.random() * 2 - 1) * 17;
    const Y = Math.random() * 34 - 16;
    if (!inside(X, Y)) continue;
    // puff: thicker in the middle, thin at edges -> rounded 3D heart
    const rx = X / 17;
    const ry = (Y - 4) / 17;
    const puff = Math.sqrt(Math.max(0, 1 - rx * rx - ry * ry));
    const z = (Math.random() * 2 - 1) * puff * 6.2;
    p[i * 3] = X * S;
    p[i * 3 + 1] = (Y - cy) * S;
    p[i * 3 + 2] = z * S;
    i++;
  }
  // fill any remainder on the surface (safety)
  for (; i < count; i++) {
    const [x, y] = heart2D(Math.random() * Math.PI * 2);
    p[i * 3] = x * S;
    p[i * 3 + 1] = (y - cy) * S;
    p[i * 3 + 2] = (Math.random() * 2 - 1) * 0.1;
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

const vertexShader = /* glsl */ `
  uniform float uTime, uScatter, uSize, uPixel, uMouseStrength;
  uniform vec3 uMouse;
  attribute vec3 aCloud;
  attribute float aRand, aPhase;
  varying float vShade;
  void main() {
    vec3 p = position;
    // subtle live cursor repulsion (in the form's local space)
    vec2 d = p.xy - uMouse.xy;
    float dist = length(d);
    float infl = smoothstep(0.45, 0.0, dist) * uMouseStrength;
    p.xy += normalize(d + vec2(0.0001)) * infl * 0.22;
    p.z += infl * 0.06;
    // idle drift
    p += 0.022 * vec3(sin(uTime*0.6 + aPhase), cos(uTime*0.5 + aPhase*1.3), sin(uTime*0.4 + aPhase));
    p = mix(p, aCloud, uScatter);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (uSize * (0.5 + aRand)) * uPixel / -mv.z;
    float depth = clamp((9.0 - (-mv.z)) / 7.0, 0.2, 1.0);
    vShade = mix(0.34, 0.92, aRand) * mix(0.6, 1.0, depth) * (1.0 - 0.45 * uScatter);
  }
`;
const fragmentShader = /* glsl */ `
  varying float vShade;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (length(c) > 0.5) discard;
    float a = smoothstep(0.5, 0.06, length(c));
    // cool grey tint so it differs in hue from the warm-white text
    vec3 tint = vec3(0.74, 0.82, 1.0);
    gl_FragColor = vec4(vShade * tint, a);
  }
`;

// Per-section: which shape forms, and which side the form sits on (x>0 = right).
// shape: 0 heart, 1 DNA, 2 globe
const SECTIONS = [
  { id: "accueil", shape: 0, x: 0 },
  { id: "manifeste", shape: 0, x: 2.2 },
  { id: "studio", shape: 2, x: -2.2 },
  { id: "kairos", shape: 0, x: 2.2 },
  { id: "vision", shape: 1, x: -2.2 },
  { id: "contact", shape: 0, x: 0 },
];

export default function ParticleBrain({ lowPower }: { lowPower: boolean }) {
  const group = useRef<THREE.Group>(null);
  const seg = useRef(0);
  const count = lowPower ? 10000 : 32000;

  const { points, shapes } = useMemo(() => {
    const shapes = [shapeHeart(count), shapeDNA(count), shapeGlobe(count)];
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
        uMouse: { value: new THREE.Vector3(999, 999, 0) },
        uMouseStrength: { value: 0 },
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

  useFrame((state, delta) => {
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
    }

    if (group.current) {
      group.current.rotation.y += delta * 0.05;
      const mx = coarse ? 0 : ptr.current.x;
      const my = coarse ? 0 : ptr.current.y;
      // sit on the opposite side of the text (alternating per section)
      const xTarget = (coarse ? 0 : SECTIONS[nearest].x) + mx * 0.25;
      group.current.position.x = lerp(group.current.position.x, xTarget, 0.05);
      group.current.position.y = lerp(group.current.position.y, 0, 0.05);
      group.current.rotation.x = lerp(group.current.rotation.x, coarse ? -0.05 : -0.08 - my * 0.15, 0.04);

      // live cursor interaction: project pointer onto the z=0 plane, then into
      // the form's local space so particles part around the cursor in real time
      if (!coarse) {
        _v.set(mx, my, 0.5).unproject(state.camera);
        _v.sub(state.camera.position).normalize();
        const t = -state.camera.position.z / _v.z;
        _w.copy(state.camera.position).add(_v.multiplyScalar(t));
        group.current.worldToLocal(_w);
        mat.uniforms.uMouse.value.copy(_w);
        mat.uniforms.uMouseStrength.value = lerp(mat.uniforms.uMouseStrength.value, ptr.current.active ? 1 : 0, 0.1);
      }
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
