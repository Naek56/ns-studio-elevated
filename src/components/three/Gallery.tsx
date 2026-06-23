import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Project = { name: string; tag: string; a: string; b: string };

const PROJECTS: Project[] = [
  { name: "Lumen", tag: "Identité · Web", a: "#3a3a42", b: "#0d0d11" },
  { name: "Atlas", tag: "Direction artistique", a: "#2b2b30", b: "#101014" },
  { name: "Orbit", tag: "Web · Motion", a: "#42424c", b: "#0e0e12" },
  { name: "Nova", tag: "E-commerce", a: "#33333a", b: "#0c0c0f" },
  { name: "Vertex", tag: "Branding · UI", a: "#3d3d46", b: "#101015" },
];

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function makeTexture(p: Project) {
  const W = 640, H = 480;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);
  roundRect(ctx, 4, 4, W - 8, H - 8, 26);
  ctx.clip();
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, p.a);
  g.addColorStop(1, p.b);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  // top browser bar
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  [40, 70, 100].forEach((x) => { ctx.beginPath(); ctx.arc(x, 44, 7, 0, Math.PI * 2); ctx.fill(); });
  // faux content lines
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(40, 110, 300, 14);
  ctx.fillRect(40, 138, 220, 10);
  // name + tag
  ctx.fillStyle = "#fff";
  ctx.font = "600 60px Poppins, sans-serif";
  ctx.fillText(p.name, 40, 360);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "500 22px Poppins, sans-serif";
  ctx.fillText(p.tag.toUpperCase(), 42, 400);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function Gallery({ lowPower }: { lowPower: boolean }) {
  const group = useRef<THREE.Group>(null);
  const cardRefs = useRef<(THREE.Mesh | null)[]>([]);
  const [hover, setHover] = useState(-1);
  const { gl } = useThree();
  const drag = useRef({ on: false, lastX: 0, vel: 0 });

  const N = PROJECTS.length;
  const R = lowPower ? 2.3 : 2.8;
  const cards = useMemo(
    () =>
      PROJECTS.map((p, i) => {
        const a = (i / N) * Math.PI * 2;
        return { tex: makeTexture(p), angle: a, pos: [Math.sin(a) * R, 0, Math.cos(a) * R] as [number, number, number] };
      }),
    [N, R]
  );

  useEffect(() => {
    const el = gl.domElement;
    el.style.cursor = "grab";
    el.style.touchAction = "pan-y";
    const down = (e: PointerEvent) => { drag.current.on = true; drag.current.lastX = e.clientX; drag.current.vel = 0; el.style.cursor = "grabbing"; };
    const move = (e: PointerEvent) => {
      if (!drag.current.on || !group.current) return;
      const dx = e.clientX - drag.current.lastX;
      drag.current.lastX = e.clientX;
      const d = dx * 0.006;
      group.current.rotation.y += d;
      drag.current.vel = d;
    };
    const up = () => { drag.current.on = false; el.style.cursor = "grab"; };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [gl]);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    if (!drag.current.on) {
      g.rotation.y += 0.0016 + drag.current.vel;
      drag.current.vel *= 0.93;
    }
    // hovered card pops forward; the one facing the camera lifts slightly
    cardRefs.current.forEach((m, i) => {
      if (!m) return;
      const worldAngle = cards[i].angle + g.rotation.y;
      const facing = Math.cos(worldAngle); // 1 = front
      const target = (hover === i ? 1.16 : 1) + Math.max(0, facing) * 0.06;
      m.scale.x += (target - m.scale.x) * 0.12;
      m.scale.y = m.scale.x;
      const mat = m.material as THREE.MeshBasicMaterial;
      const op = 0.35 + Math.max(0, facing) * 0.65; // neighbours stay visible, true backs are culled
      mat.opacity += ((hover === i ? 1 : op) - mat.opacity) * 0.12;
    });
  });

  return (
    <group ref={group}>
      {cards.map((c, i) => (
        <mesh
          key={i}
          ref={(m) => (cardRefs.current[i] = m)}
          position={c.pos}
          rotation={[0, c.angle, 0]}
          onPointerOver={() => !drag.current.on && setHover(i)}
          onPointerOut={() => setHover((h) => (h === i ? -1 : h))}
        >
          <planeGeometry args={[1.7, 1.275]} />
          <meshBasicMaterial map={c.tex} transparent toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
