import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

type Project = { name: string; tag: string };

const PROJECTS: Project[] = [
  { name: "Lumen", tag: "Identité · Web" },
  { name: "Atlas", tag: "Direction artistique" },
  { name: "Orbit", tag: "Web · Motion" },
];

/* transparent texture holding just the project text + a thin frame */
function makeLabel(p: Project) {
  const S = 512;
  const c = document.createElement("canvas");
  c.width = S; c.height = S;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, S, S);
  // thin frame
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, S - 56, S - 56);
  // browser dots
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  [56, 80, 104].forEach((x) => { ctx.beginPath(); ctx.arc(x, 60, 5, 0, Math.PI * 2); ctx.fill(); });
  // name + tag
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 64px Poppins, sans-serif";
  ctx.fillText(p.name, 48, S - 96);
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "500 24px Poppins, sans-serif";
  ctx.fillText(p.tag.toUpperCase(), 50, S - 56);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Card({
  project,
  position,
  hovered,
  onOver,
  onOut,
}: {
  project: Project;
  position: [number, number, number];
  hovered: boolean;
  onOver: () => void;
  onOut: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const label = useMemo(() => makeLabel(project), [project]);
  const idle = useRef(Math.random() * 10);
  const center = useRef(new THREE.Vector3());

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    idle.current += dt;
    let rx: number, ry: number, s: number;
    if (hovered) {
      // tilt around the card's own centre, toward the cursor
      center.current.setFromMatrixPosition(g.matrixWorld).project(state.camera);
      const dx = state.pointer.x - center.current.x;
      const dy = state.pointer.y - center.current.y;
      ry = THREE.MathUtils.clamp(dx * 3.2, -1.0, 1.0);
      rx = THREE.MathUtils.clamp(-dy * 3.2, -1.0, 1.0);
      s = 1.16;
    } else {
      // gentle idle float
      ry = Math.sin(idle.current * 0.5) * 0.08;
      rx = Math.cos(idle.current * 0.4) * 0.05;
      s = 1;
    }
    g.rotation.y += (ry - g.rotation.y) * 0.12;
    g.rotation.x += (rx - g.rotation.x) * 0.12;
    const cs = g.scale.x + (s - g.scale.x) * 0.12;
    g.scale.setScalar(cs);
  });

  return (
    <group ref={group} position={position} onPointerOver={onOver} onPointerOut={onOut}>
      <RoundedBox args={[3.8, 3.8, 0.2]} radius={0.14} smoothness={4}>
        <meshStandardMaterial color="#26262b" metalness={0.95} roughness={0.22} envMapIntensity={1.1} />
      </RoundedBox>
      <mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[3.8, 3.8]} />
        <meshBasicMaterial map={label} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function Gallery({ lowPower }: { lowPower: boolean }) {
  const { scene } = useThree();
  const [hover, setHover] = useState(-1);

  // procedural studio gradient as the reflection environment (metallic sheen)
  useEffect(() => {
    const c = document.createElement("canvas");
    c.width = 64; c.height = 256;
    const x = c.getContext("2d")!;
    const g = x.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.4, "#9aa1ad");
    g.addColorStop(0.72, "#3a3a42");
    g.addColorStop(1, "#0a0a0a");
    x.fillStyle = g;
    x.fillRect(0, 0, 64, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    const prev = scene.environment;
    scene.environment = tex;
    return () => { scene.environment = prev; tex.dispose(); };
  }, [scene]);

  const gap = lowPower ? 4.0 : 6.0;
  const positions: [number, number, number][] = lowPower
    ? [[0, gap, 0], [0, 0, 0], [0, -gap, 0]]
    : [[-gap, 0, 0], [0, 0, 0], [gap, 0, 0]];

  return (
    <group>
      {PROJECTS.map((p, i) => (
        <Card
          key={p.name}
          project={p}
          position={positions[i]}
          hovered={hover === i}
          onOver={() => setHover(i)}
          onOut={() => setHover((h) => (h === i ? -1 : h))}
        />
      ))}
    </group>
  );
}
