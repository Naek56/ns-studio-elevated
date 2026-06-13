import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

const lerp = THREE.MathUtils.lerp;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function radialTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(120,170,255,0.7)");
  g.addColorStop(1, "rgba(120,170,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

/* ---- finger built from segments (pivots) ---- */
function addFinger(parent: THREE.Object3D, lengths: number[], radius: number, curl: number, robotic: boolean) {
  let node: THREE.Object3D = parent;
  lengths.forEach((len, i) => {
    const pivot = new THREE.Group();
    pivot.rotation.z = -(i === 0 ? curl * 0.5 : curl);
    node.add(pivot);
    const seg = new THREE.Mesh(new THREE.CapsuleGeometry(radius, len, 4, 10));
    seg.rotation.z = Math.PI / 2;
    seg.position.x = len / 2;
    pivot.add(seg);
    if (robotic) {
      const j = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.12, 10, 10));
      pivot.add(j);
    }
    const next = new THREE.Group();
    next.position.x = len;
    pivot.add(next);
    node = next;
  });
}

function buildHandMeshes(robotic: boolean) {
  const g = new THREE.Group();
  const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.26, 1.5, 6, 14));
  arm.rotation.z = Math.PI / 2;
  arm.position.x = -1.0;
  g.add(arm);
  const palm = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.3, 0.92, 6, 3, 6));
  palm.position.set(0.12, 0, 0);
  g.add(palm);
  if (robotic) {
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.07, 0.7, 4, 2, 4));
    plate.position.set(0.12, 0.19, 0);
    g.add(plate);
  }
  const fingerZ = [-0.34, -0.12, 0.12, 0.34];
  const lens = [
    [0.36, 0.32, 0.26],
    [0.4, 0.34, 0.27],
    [0.38, 0.32, 0.26],
    [0.3, 0.26, 0.2],
  ];
  const curls = [0.05, 1.2, 1.35, 1.45];
  fingerZ.forEach((z, k) => {
    const f = new THREE.Group();
    f.position.set(0.58, 0, z);
    addFinger(f, lens[k], 0.1, curls[k], robotic);
    g.add(f);
  });
  const thumb = new THREE.Group();
  thumb.position.set(0.2, -0.02, -0.5);
  thumb.rotation.y = 1.0;
  thumb.rotation.z = 0.2;
  addFinger(thumb, [0.32, 0.26], 0.11, 0.35, robotic);
  g.add(thumb);
  g.rotation.x = -0.15;
  return g;
}

// sample the hand surface into a dense point cloud
function sampleHand(robotic: boolean, count: number) {
  const hand = buildHandMeshes(robotic);
  hand.updateMatrixWorld(true);
  const geos: THREE.BufferGeometry[] = [];
  hand.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) {
      const gg = (m.geometry as THREE.BufferGeometry).clone();
      gg.applyMatrix4(m.matrixWorld);
      gg.deleteAttribute("uv");
      gg.deleteAttribute("normal");
      geos.push(gg);
    }
  });
  const merged = BufferGeometryUtils.mergeGeometries(geos, false);
  const sampler = new MeshSurfaceSampler(new THREE.Mesh(merged)).build();
  const pos = new Float32Array(count * 3);
  const tmp = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    sampler.sample(tmp);
    pos[i * 3] = tmp.x;
    pos[i * 3 + 1] = tmp.y;
    pos[i * 3 + 2] = tmp.z;
  }
  return pos;
}

const vertexShader = /* glsl */ `
  uniform float uTime, uSize, uPixel;
  attribute float aRand, aPhase;
  varying float vR;
  void main() {
    vec3 p = position;
    p += 0.006 * vec3(sin(uTime*1.2 + aPhase), cos(uTime + aPhase*1.3), sin(uTime*0.9 + aPhase));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (uSize * (0.55 + aRand)) * uPixel / -mv.z;
    vR = aRand;
  }
`;
const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vR;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (length(c) > 0.5) discard;
    float a = smoothstep(0.5, 0.12, length(c));
    gl_FragColor = vec4(uColor * (0.75 + 0.25 * vR), a);
  }
`;

function makePoints(robotic: boolean, count: number, color: string, lowPower: boolean) {
  const pos = sampleHand(robotic, count);
  const rand = new Float32Array(count);
  const phase = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    rand[i] = Math.random();
    phase[i] = Math.random() * Math.PI * 2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
  geo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: lowPower ? 12 : 14 },
      uPixel: { value: Math.min(window.devicePixelRatio || 1, 2) },
      uColor: { value: new THREE.Color(color) },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
  });
  return new THREE.Points(geo, mat);
}

function Hands() {
  const human = useRef<THREE.Group>(null);
  const robot = useRef<THREE.Group>(null);
  const orb = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Sprite>(null);

  const lowPower = useMemo(
    () => typeof window !== "undefined" && (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 820),
    []
  );
  const count = lowPower ? 9000 : 20000;

  const humanPts = useMemo(() => makePoints(false, count, "#5a5560", lowPower), [count, lowPower]);
  const robotPts = useMemo(() => makePoints(true, count, "#3d4658", lowPower), [count, lowPower]);
  const glow = useMemo(() => radialTexture(), []);

  useFrame((state) => {
    const tt = easeInOut((Math.sin(state.clock.elapsedTime * 0.45) + 1) / 2);
    const bob = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    (humanPts.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.elapsedTime;
    (robotPts.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.elapsedTime;

    if (human.current) {
      human.current.position.set(lerp(-3.4, -1.95, tt), bob, 0);
      human.current.rotation.z = lerp(-0.05, 0.02, tt);
    }
    if (robot.current) robot.current.position.set(lerp(3.4, 1.95, tt), -bob, 0);

    const near = Math.pow(tt, 3);
    if (orb.current) {
      orb.current.scale.setScalar(0.05 + near * 0.13);
      (orb.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + near * 0.85;
    }
    if (halo.current) {
      const s = 0.5 + near * 1.8;
      halo.current.scale.set(s, s, s);
      (halo.current.material as THREE.SpriteMaterial).opacity = 0.1 + near * 0.7;
    }
  });

  return (
    <>
      <group ref={human}>
        <primitive object={humanPts} />
      </group>
      <group ref={robot} rotation={[0, Math.PI, 0]}>
        <primitive object={robotPts} />
      </group>

      <mesh ref={orb} position={[0, 0, 0.1]}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshBasicMaterial color="#bcd6ff" transparent toneMapped={false} />
      </mesh>
      <sprite ref={halo} position={[0, 0, 0.05]}>
        <spriteMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </>
  );
}

export default function HandsScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 34, position: [0, 0, 7.5], near: 0.1, far: 100 }}
    >
      <Hands />
    </Canvas>
  );
}
