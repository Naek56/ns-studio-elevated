import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* ============================================================================
   Façade d'immeuble la nuit — wireframe minimaliste.
   Lignes blanches bleutées sur noir, 5 étages x 4 appartements, 5 fenêtres
   illuminées cliquables (raycasting) qui ouvrent une carte d'information.
============================================================================ */

type WinDef = { floor: number; apt: number; title: string; text: string };

const LIT_WINDOWS: WinDef[] = [
  {
    floor: 4, apt: 2,
    title: "L'Analyste",
    text: "Observe chaque visiteur de votre site. Clics, scrolls, hésitations. Il comprend le comportement humain derrière chaque donnée.",
  },
  {
    floor: 3, apt: 1,
    title: "Le Stratège",
    text: "Traduit les données en décisions business. Chaque recommandation a un impact estimé en euros réels.",
  },
  {
    floor: 3, apt: 4,
    title: "Le Veilleur",
    text: "Surveille votre marché, vos concurrents, votre réputation. Il vous alerte avant que vous en ayez besoin.",
  },
  {
    floor: 2, apt: 2,
    title: "Kairos AI",
    text: "L'intelligence artificielle qui se connecte à votre site et devient le cerveau de votre business. Automatiquement.",
  },
  {
    floor: 1, apt: 3,
    title: "WAY Agency",
    text: "On construit votre site. Kairos le fait performer. Ensemble on fait croître votre business.",
  },
];

/* ------------------------------ geometry constants ------------------------ */
const AW = 2.0;            // apartment width
const W = 4 * AW;          // building width
const HALF = W / 2;
const FH = 1.5;            // floor height
const GH = 1.7;            // ground floor height
const H = GH + 5 * FH;     // total height
const D = 2.0;             // depth
const WIN_W = 0.95, WIN_H = 0.9;

const aptX = (apt: number) => -HALF + (apt - 0.5) * AW;             // 1..4
const floorY = (floor: number) => GH + (floor - 0.5) * FH;          // 1..5

const MONO = "'DM Mono', ui-monospace, monospace";
const SERIF = "'Cormorant Garamond', Georgia, serif";

export default function WireBuilding() {
  const mountRef = useRef<HTMLDivElement>(null);
  const signRef = useRef<HTMLDivElement>(null);
  const [card, setCard] = useState<{ i: number; x: number; y: number } | null>(null);
  const [mobile, setMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.02);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    /* ------------------------------- materials ------------------------------ */
    const LINE = 0xe8f0ff;
    const matBase = new THREE.LineBasicMaterial({ color: LINE, transparent: true, opacity: 0.6 });
    const matDim = new THREE.LineBasicMaterial({ color: LINE, transparent: true, opacity: 0.2 });
    const matSoft = new THREE.LineBasicMaterial({ color: LINE, transparent: true, opacity: 0.35 });

    const disposables: { dispose: () => void }[] = [matBase, matDim, matSoft];

    const seg = (pts: number[], mat: THREE.LineBasicMaterial) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
      const l = new THREE.LineSegments(g, mat);
      disposables.push(g);
      scene.add(l);
      return l;
    };
    // rectangle (4 segments) in the XY plane at depth z
    const rectPts = (cx: number, cy: number, w: number, h: number, z: number) => {
      const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2;
      return [x0, y0, z, x1, y0, z, x1, y0, z, x1, y1, z, x1, y1, z, x0, y1, z, x0, y1, z, x0, y0, z];
    };

    /* ------------------------------ building shell -------------------------- */
    const shell: number[] = [];
    // front face
    shell.push(-HALF, 0, 0, HALF, 0, 0, HALF, 0, 0, HALF, H, 0, HALF, H, 0, -HALF, H, 0, -HALF, H, 0, -HALF, 0, 0);
    // depth edges + back top (subtle 3D)
    const bz = -D;
    shell.push(-HALF, H, 0, -HALF, H, bz, HALF, H, 0, HALF, H, bz, -HALF, H, bz, HALF, H, bz);
    shell.push(-HALF, 0, 0, -HALF, 0, bz, HALF, 0, 0, HALF, 0, bz, -HALF, 0, bz, -HALF, H, bz, HALF, 0, bz, HALF, H, bz);
    seg(shell, matBase);

    // street line
    seg([-16, 0, 0.6, 16, 0, 0.6], matSoft);

    // cornices between floors (two parallel protruding lines)
    const cor: number[] = [];
    for (let k = 0; k <= 5; k++) {
      const y = GH + k * FH;
      if (y > H - 0.01) break;
      cor.push(-HALF - 0.18, y, 0.06, HALF + 0.18, y, 0.06);
      cor.push(-HALF - 0.18, y + 0.07, 0.06, HALF + 0.18, y + 0.07, 0.06);
    }
    seg(cor, matSoft);

    /* -------------------------------- windows ------------------------------- */
    const litSet = new Map<string, number>();
    LIT_WINDOWS.forEach((wd, i) => litSet.set(`${wd.floor}-${wd.apt}`, i));

    const dimPts: number[] = [];
    const sillPts: number[] = [];
    const litOutlineMats: THREE.LineBasicMaterial[] = [];
    const glowMats: THREE.MeshBasicMaterial[] = [];
    const glowMeshes: THREE.Mesh[] = [];
    const litWorldPos: THREE.Vector3[] = [];

    for (let f = 1; f <= 5; f++) {
      for (let a = 1; a <= 4; a++) {
        const cx = aptX(a), cy = floorY(f);
        const litIdx = litSet.get(`${f}-${a}`);
        // sill (rebord) under every window
        sillPts.push(cx - WIN_W / 2 - 0.12, cy - WIN_H / 2 - 0.02, 0.05, cx + WIN_W / 2 + 0.12, cy - WIN_H / 2 - 0.02, 0.05);
        if (litIdx === undefined) {
          dimPts.push(...rectPts(cx, cy, WIN_W, WIN_H, -0.06));
          // inner cross of dark windows, very faint
          dimPts.push(cx, cy - WIN_H / 2, -0.06, cx, cy + WIN_H / 2, -0.06);
        } else {
          // bright outline with its own material (for hover pulse)
          const m = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 });
          litOutlineMats[litIdx] = m; // indexed by LIT_WINDOWS order
          disposables.push(m);
          seg(rectPts(cx, cy, WIN_W, WIN_H, -0.05), m);
          // warm inner glow
          const gm = new THREE.MeshBasicMaterial({ color: 0xfff3cc, transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false });
          const gg = new THREE.PlaneGeometry(WIN_W - 0.06, WIN_H - 0.06);
          const mesh = new THREE.Mesh(gg, gm);
          mesh.position.set(cx, cy, -0.09);
          mesh.userData.lit = litIdx;
          scene.add(mesh);
          glowMats[litIdx] = gm;
          glowMeshes.push(mesh);
          disposables.push(gm, gg);
          litWorldPos[litIdx] = new THREE.Vector3(cx, cy, 0);
        }
      }
    }
    seg(dimPts, matDim);
    seg(sillPts, matSoft);

    /* ----------------------------- door + steps ----------------------------- */
    const door: number[] = [];
    door.push(...rectPts(0, 0.75, 1.15, 1.5, 0)); // door frame
    door.push(0, 0, 0, 0, 1.5, 0); // double door split
    // steps
    door.push(-0.85, 0.12, 0.18, 0.85, 0.12, 0.18);
    door.push(-1.0, 0.0, 0.38, 1.0, 0.0, 0.38);
    door.push(-0.85, 0.12, 0.18, -1.0, 0.0, 0.38, 0.85, 0.12, 0.18, 1.0, 0.0, 0.38);
    seg(door, matBase);

    /* ------------------------------ streetlamp ------------------------------ */
    const lampX = HALF + 1.9;
    const lamp: number[] = [];
    lamp.push(lampX, 0, 0.4, lampX, 3.1, 0.4);                       // pole
    lamp.push(lampX, 3.1, 0.4, lampX - 0.7, 3.1, 0.4);               // arm
    lamp.push(...rectPts(lampX - 0.7, 2.95, 0.34, 0.22, 0.4));        // head
    seg(lamp, matBase);
    const pl = new THREE.PointLight(0xffffff, 0.5, 8);
    pl.position.set(lampX - 0.7, 2.8, 1.2);
    scene.add(pl);
    // soft glow sprite under the lamp
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = glowCanvas.height = 128;
    const gctx = glowCanvas.getContext("2d")!;
    const grad = gctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(255,255,255,0.55)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    gctx.fillStyle = grad;
    gctx.fillRect(0, 0, 128, 128);
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const spriteMat = new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: 0.16, depthWrite: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(lampX - 0.7, 2.2, 0.5);
    sprite.scale.set(4.5, 4.5, 1);
    scene.add(sprite);
    disposables.push(glowTex, spriteMat);

    /* --------------------------------- stars -------------------------------- */
    const starPts: number[] = [];
    for (let i = 0; i < 300; i++) {
      starPts.push((Math.random() - 0.5) * 34, H + 0.5 + Math.random() * 10, -6 - Math.random() * 4);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPts, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.4, depthWrite: false });
    scene.add(new THREE.Points(starGeo, starMat));
    disposables.push(starGeo, starMat);

    /* --------------------------------- rain --------------------------------- */
    const RAIN = 200;
    const rainPos = new Float32Array(RAIN * 6);
    const rainSpeed = new Float32Array(RAIN);
    const rainLen = new Float32Array(RAIN);
    const resetDrop = (i: number, spread = false) => {
      const x = (Math.random() - 0.5) * 30;
      const y = spread ? Math.random() * (H + 8) : H + 6 + Math.random() * 3;
      const z = -2 + Math.random() * 4;
      const len = 0.25 + Math.random() * 0.3;
      rainPos[i * 6] = x; rainPos[i * 6 + 1] = y + len; rainPos[i * 6 + 2] = z;
      rainPos[i * 6 + 3] = x; rainPos[i * 6 + 4] = y; rainPos[i * 6 + 5] = z;
      rainSpeed[i] = 2.6 + Math.random() * 3.2;
      rainLen[i] = len;
    };
    for (let i = 0; i < RAIN; i++) resetDrop(i, true);
    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPos, 3));
    const rainMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 });
    scene.add(new THREE.LineSegments(rainGeo, rainMat));
    disposables.push(rainGeo, rainMat);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ------------------------------ camera / resize ------------------------- */
    const isMobileNow = () => window.innerWidth < 768;
    const sizeCamera = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      camera.aspect = w / h;
      const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      // pull back until both the width and the height of the building fit
      const zForH = (H / 2 + 2.2) / tan;
      const zForW = (HALF + (isMobileNow() ? 1.2 : 3.2)) / (tan * camera.aspect);
      camera.position.set(0, H / 2 - 0.4, Math.max(zForH, zForW));
      camera.lookAt(0, H / 2 - 0.4, 0);
      camera.updateProjectionMatrix();
      setMobile(isMobileNow());
      // project the WAY sign anchor (right above the door) into screen space
      if (signRef.current) {
        const v = new THREE.Vector3(0, GH - 0.04, 0.12).project(camera);
        signRef.current.style.left = `${(v.x * 0.5 + 0.5) * w}px`;
        signRef.current.style.top = `${(-v.y * 0.5 + 0.5) * h}px`;
        const v2 = new THREE.Vector3(1.1, GH - 0.04, 0.12).project(camera);
        const px = Math.abs((v2.x - v.x) * 0.5) * w; // half-width reference in px
        signRef.current.style.fontSize = `${Math.max(11, Math.min(20, px * 0.34))}px`;
      }
    };
    sizeCamera();
    window.addEventListener("resize", sizeCamera);

    /* ----------------------------- interactions ----------------------------- */
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let hovered = -1;

    const pick = (ev: PointerEvent | MouseEvent): number => {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(glowMeshes, false)[0];
      return hit ? (hit.object.userData.lit as number) : -1;
    };

    const onMove = (ev: PointerEvent) => {
      const i = pick(ev);
      if (i !== hovered) {
        hovered = i;
        renderer.domElement.style.cursor = i >= 0 ? "pointer" : "default";
      }
    };
    const onClick = (ev: MouseEvent) => {
      const i = pick(ev);
      if (i < 0) { setCard(null); return; }
      // screen position of the window, for the card placement
      const r = renderer.domElement.getBoundingClientRect();
      const v = litWorldPos[i].clone().project(camera);
      setCard({ i, x: (v.x * 0.5 + 0.5) * r.width, y: (-v.y * 0.5 + 0.5) * r.height });
    };
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("click", onClick);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setCard(null); };
    window.addEventListener("keydown", onKey);

    /* -------------------------------- animate -------------------------------- */
    const phases = LIT_WINDOWS.map(() => Math.random() * Math.PI * 2);
    const freqs = LIT_WINDOWS.map(() => 0.4 + Math.random() * 0.5);
    const clock = new THREE.Clock();
    let raf = 0;
    const loop = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      if (!reducedMotion) {
        for (let i = 0; i < RAIN; i++) {
          rainPos[i * 6 + 1] -= rainSpeed[i] * dt;
          rainPos[i * 6 + 4] -= rainSpeed[i] * dt;
          if (rainPos[i * 6 + 1] < 0) resetDrop(i);
        }
        rainGeo.attributes.position.needsUpdate = true;
      }

      // natural interior light flicker + hover states
      for (let i = 0; i < glowMats.length; i++) {
        const base = 0.4 + Math.sin(t * freqs[i] + phases[i]) * 0.05; // 0.35..0.45
        const target = hovered === i ? 0.7 : base;
        glowMats[i].opacity += (target - glowMats[i].opacity) * Math.min(1, dt * 8);
        litOutlineMats[i].opacity = hovered === i ? 0.9 + Math.sin(t * 6) * 0.1 : 1;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", sizeCamera);
      window.removeEventListener("keydown", onKey);
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("click", onClick);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  /* ----------------------------- card placement ---------------------------- */
  const cardStyle = (): React.CSSProperties => {
    if (!card) return {};
    if (mobile) {
      return { position: "fixed", left: 12, right: 12, bottom: 12, zIndex: 30, minHeight: 200 };
    }
    const mount = mountRef.current;
    const w = mount?.clientWidth ?? 1200;
    const h = mount?.clientHeight ?? 700;
    const CW = 320, CH = 210;
    let left = card.x + 46;
    if (left + CW > w - 12) left = card.x - CW - 46;
    const top = Math.min(Math.max(card.y - CH / 2, 12), h - CH - 12);
    return { position: "absolute", left, top, width: CW, zIndex: 30 };
  };

  const win = card ? LIT_WINDOWS[card.i] : null;

  return (
    <div className="relative h-[72vh] w-full md:h-[80vh]">
      <div ref={mountRef} className="absolute inset-0 h-full w-full" />

      {/* WAY sign, anchored above the door via 3D projection */}
      <div
        ref={signRef}
        className="pointer-events-none absolute select-none"
        style={{
          transform: "translate(-50%, -100%)",
          fontFamily: MONO,
          letterSpacing: "0.45em",
          paddingLeft: "0.45em",
          color: "#fff",
          textShadow: "0 0 10px rgba(232,240,255,0.9), 0 0 26px rgba(232,240,255,0.45)",
        }}
      >
        WAY
      </div>

      {/* information card */}
      {win && (
        <div
          ref={cardRef}
          key={card!.i}
          style={{
            ...cardStyle(),
            background: "rgba(4,4,10,0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: 32,
            maxWidth: 320,
            animation: mobile ? "way-card-up 0.4s cubic-bezier(0.16,1,0.3,1)" : "way-card-in 0.4s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <span className="absolute left-4 top-4 h-1.5 w-1.5 rounded-full bg-white" style={{ boxShadow: "0 0 8px rgba(255,255,255,0.9)" }} />
          <button
            onClick={() => setCard(null)}
            aria-label="Fermer"
            className="absolute right-4 top-3 transition-opacity hover:opacity-100"
            style={{ fontFamily: MONO, fontSize: 12, color: "rgba(255,255,255,0.4)" }}
          >
            X
          </button>
          <p className="uppercase" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.2em", color: "rgba(255,255,255,0.5)" }}>
            {win.title}
          </p>
          <p className="mt-3 text-white" style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 300, lineHeight: 1.6 }}>
            {win.text}
          </p>
        </div>
      )}

      <style>{`
        @keyframes way-card-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes way-card-up { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
