import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const lerp = THREE.MathUtils.lerp;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function radialTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(210,228,255,0.8)");
  g.addColorStop(1, "rgba(210,228,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function buildFinger(lengths: number[], radius: number, curl: number, skin: THREE.Material, robotic: boolean, jointMat: THREE.Material) {
  const base = new THREE.Group();
  let parent: THREE.Group = base;
  lengths.forEach((len, i) => {
    const pivot = new THREE.Group();
    pivot.rotation.z = -(i === 0 ? curl * 0.5 : curl);
    parent.add(pivot);
    const seg = new THREE.Mesh(new THREE.CapsuleGeometry(radius, len, 6, 12), skin);
    seg.rotation.z = Math.PI / 2;
    seg.position.x = len / 2;
    pivot.add(seg);
    if (robotic) {
      const j = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.08, 12, 12), jointMat);
      pivot.add(j);
    }
    const next = new THREE.Group();
    next.position.x = len;
    pivot.add(next);
    parent = next;
  });
  return base;
}

function buildHand(robotic: boolean) {
  const g = new THREE.Group();
  const skin = robotic
    ? new THREE.MeshStandardMaterial({ color: "#cdd3dd", roughness: 0.32, metalness: 0.9 })
    : new THREE.MeshStandardMaterial({ color: "#ecdcd0", roughness: 0.6, metalness: 0.05 });
  const jointMat = new THREE.MeshStandardMaterial({ color: "#8b94a6", roughness: 0.4, metalness: 0.95 });

  const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.26, 1.5, 8, 16), skin);
  arm.rotation.z = Math.PI / 2;
  arm.position.x = -1.0;
  g.add(arm);

  const palm = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.3, 0.92), skin);
  palm.position.set(0.12, 0, 0);
  g.add(palm);
  if (robotic) {
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.06, 0.7), jointMat);
    plate.position.set(0.12, 0.18, 0);
    g.add(plate);
  }

  const fingerZ = [-0.34, -0.12, 0.12, 0.34];
  const lens = [
    [0.36, 0.32, 0.26], // index (extended)
    [0.4, 0.34, 0.27],
    [0.38, 0.32, 0.26],
    [0.3, 0.26, 0.2],
  ];
  const curls = [0.05, 1.2, 1.35, 1.45];
  fingerZ.forEach((z, k) => {
    const f = buildFinger(lens[k], 0.1, curls[k], skin, robotic, jointMat);
    f.position.set(0.58, 0, z);
    g.add(f);
  });

  const thumb = buildFinger([0.32, 0.26], 0.11, 0.35, skin, robotic, jointMat);
  thumb.position.set(0.2, -0.02, -0.5);
  thumb.rotation.y = 1.0;
  thumb.rotation.z = 0.2;
  g.add(thumb);

  g.rotation.x = -0.15;
  return g;
}

function Hands() {
  const human = useRef<THREE.Group>(null);
  const robot = useRef<THREE.Group>(null);
  const orb = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Sprite>(null);
  const light = useRef<THREE.PointLight>(null);

  const humanHand = useMemo(() => buildHand(false), []);
  const robotHand = useMemo(() => buildHand(true), []);
  const glow = useMemo(() => radialTexture(), []);

  useFrame((state) => {
    const t = easeInOut((Math.sin(state.clock.elapsedTime * 0.45) + 1) / 2);
    const bob = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;

    if (human.current) {
      human.current.position.set(lerp(-3.4, -1.95, t), bob, 0);
      human.current.rotation.z = lerp(-0.05, 0.02, t);
    }
    if (robot.current) {
      robot.current.position.set(lerp(3.4, 1.95, t), -bob, 0);
    }
    const near = Math.pow(t, 3);
    if (orb.current) {
      orb.current.scale.setScalar(0.06 + near * 0.12);
      (orb.current.material as THREE.MeshBasicMaterial).opacity = 0.2 + near * 0.8;
    }
    if (halo.current) {
      const s = 0.6 + near * 1.6;
      halo.current.scale.set(s, s, s);
      (halo.current.material as THREE.SpriteMaterial).opacity = 0.15 + near * 0.7;
    }
    if (light.current) light.current.intensity = near * 3;
  });

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 5]} intensity={1.3} />
      <directionalLight position={[-4, 1, 2]} intensity={0.5} color="#bcd2ff" />
      <pointLight ref={light} position={[0, 0, 0.6]} color="#dceaff" intensity={0} distance={6} />

      <group ref={human}>
        <primitive object={humanHand} />
      </group>
      <group ref={robot} rotation={[0, Math.PI, 0]}>
        <primitive object={robotHand} />
      </group>

      <mesh ref={orb} position={[0, 0, 0.1]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#eaf3ff" transparent toneMapped={false} />
      </mesh>
      <sprite ref={halo} position={[0, 0, 0.1]}>
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
