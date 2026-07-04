import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* ============================================================================
   Constellation d'intelligences — réseau de points lumineux sur fond noir.
   Kairos au centre relie L'Analyste, Le Stratège, Le Veilleur et WAY Agency.
   Chaque point est survolable (halo + label) et cliquable (carte d'info).
============================================================================ */

type Node = { title: string; text: string; pos: [number, number, number]; size: number; core?: boolean };

const NODES: Node[] = [
  {
    title: "L'Analyste",
    text: "Observe chaque visiteur de votre site. Clics, scrolls, hésitations. Il comprend le comportement humain derrière chaque donnée.",
    pos: [-3.7, 1.9, -0.3], size: 1,
  },
  {
    title: "Le Stratège",
    text: "Traduit les données en décisions business. Chaque recommandation a un impact estimé en euros réels.",
    pos: [-2.5, -2.1, 0.4], size: 1,
  },
  {
    title: "Le Veilleur",
    text: "Surveille votre marché, vos concurrents, votre réputation. Il vous alerte avant que vous en ayez besoin.",
    pos: [2.9, 2.2, -0.5], size: 1,
  },
  {
    title: "Kairos AI",
    text: "L'intelligence artificielle qui se connecte à votre site et devient le cerveau de votre business. Automatiquement.",
    pos: [0.15, -0.1, 0.6], size: 1.7, core: true,
  },
  {
    title: "WAY Agency",
    text: "On construit votre site. Kairos le fait performer. Ensemble on fait croître votre business.",
    pos: [3.9, -1.3, 0.2], size: 1.15,
  },
];

// hub links (Kairos = index 3) + an outer constellation loop
const LINKS: [number, number][] = [
  [3, 0], [3, 1], [3, 2], [3, 4],
  [0, 2], [2, 4], [4, 1], [1, 0],
];

const MONO = "'DM Mono', ui-monospace, monospace";
const SERIF = "'Cormorant Garamond', Georgia, serif";

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const x = c.getContext("2d")!;
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.18, "rgba(232,240,255,0.9)");
  g.addColorStop(0.5, "rgba(200,215,255,0.25)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export default function Constellation() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [card, setCard] = useState<{ i: number; x: number; y: number } | null>(null);
  const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    const disposables: { dispose: () => void }[] = [];
    const group = new THREE.Group();
    scene.add(group);

    /* ------------------------------- starfield ------------------------------ */
    const starN = 320;
    const sp = new Float32Array(starN * 3);
    for (let i = 0; i < starN; i++) {
      sp[i * 3] = (Math.random() - 0.5) * 26;
      sp[i * 3 + 1] = (Math.random() - 0.5) * 16;
      sp[i * 3 + 2] = -4 - Math.random() * 12;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xe8f0ff, size: 0.05, transparent: true, opacity: 0.5, depthWrite: false });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);
    disposables.push(starGeo, starMat);

    /* -------------------------------- links --------------------------------- */
    const linkPts: number[] = [];
    LINKS.forEach(([a, b]) => { linkPts.push(...NODES[a].pos, ...NODES[b].pos); });
    const linkGeo = new THREE.BufferGeometry();
    linkGeo.setAttribute("position", new THREE.Float32BufferAttribute(linkPts, 3));
    const linkMat = new THREE.LineBasicMaterial({ color: 0xe8f0ff, transparent: true, opacity: 0.16 });
    group.add(new THREE.LineSegments(linkGeo, linkMat));
    disposables.push(linkGeo, linkMat);

    /* -------------------------------- nodes --------------------------------- */
    const tex = glowTexture();
    disposables.push(tex);
    const glows: THREE.Sprite[] = [];
    const cores: THREE.Mesh[] = [];
    const hits: THREE.Mesh[] = [];
    const nodeWorld: THREE.Vector3[] = [];

    NODES.forEach((n, i) => {
      const p = new THREE.Vector3(...n.pos);
      nodeWorld.push(p);

      const gm = new THREE.SpriteMaterial({ map: tex, color: 0xffffff, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending });
      const glow = new THREE.Sprite(gm);
      glow.position.copy(p);
      glow.scale.setScalar(n.size);
      group.add(glow);
      glows.push(glow);
      disposables.push(gm);

      const cg = new THREE.SphereGeometry(0.055 * (n.core ? 1.6 : 1), 16, 16);
      const cmat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const core = new THREE.Mesh(cg, cmat);
      core.position.copy(p);
      group.add(core);
      cores.push(core);
      disposables.push(cg, cmat);

      const hg = new THREE.SphereGeometry(0.62 * (n.core ? 1.3 : 1), 12, 12);
      const hmat = new THREE.MeshBasicMaterial({ visible: false });
      const hit = new THREE.Mesh(hg, hmat);
      hit.position.copy(p);
      hit.userData.i = i;
      group.add(hit);
      hits.push(hit);
      disposables.push(hg, hmat);
    });

    /* ----------------------------- camera / resize -------------------------- */
    const isMobile = () => window.innerWidth < 768;
    const sizeCam = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      camera.aspect = w / h;
      camera.position.set(0, 0, isMobile() ? 13 : 9.2);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      setMobile(isMobile());
    };
    sizeCam();
    window.addEventListener("resize", sizeCam);

    const project = (p: THREE.Vector3) => {
      const r = renderer.domElement.getBoundingClientRect();
      const v = p.clone();
      group.localToWorld(v); // account for parallax rotation
      v.project(camera);
      return { x: (v.x * 0.5 + 0.5) * r.width, y: (-v.y * 0.5 + 0.5) * r.height };
    };

    /* ----------------------------- interactions ----------------------------- */
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const mouse = new THREE.Vector2(0, 0);
    let hoveredIdx = -1;

    const pick = (ev: PointerEvent | MouseEvent) => {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(hits, false)[0];
      return hit ? (hit.object.userData.i as number) : -1;
    };

    const onMove = (ev: PointerEvent) => {
      const r = renderer.domElement.getBoundingClientRect();
      mouse.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
      const i = pick(ev);
      if (i !== hoveredIdx) {
        hoveredIdx = i;
        renderer.domElement.style.cursor = i >= 0 ? "pointer" : "default";
        setHover(i >= 0 ? { i, ...project(nodeWorld[i]) } : null);
      } else if (i >= 0) {
        setHover({ i, ...project(nodeWorld[i]) });
      }
    };
    const onClick = (ev: MouseEvent) => {
      const i = pick(ev);
      if (i < 0) { setCard(null); return; }
      setCard({ i, ...project(nodeWorld[i]) });
    };
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("click", onClick);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setCard(null); };
    window.addEventListener("keydown", onKey);

    /* -------------------------------- animate -------------------------------- */
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phases = NODES.map(() => Math.random() * Math.PI * 2);
    const freqs = NODES.map(() => 0.5 + Math.random() * 0.6);
    const clock = new THREE.Clock();
    let raf = 0;
    const loop = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      // gentle parallax toward the cursor
      const tx = mouse.y * 0.12;
      const ty = mouse.x * 0.2;
      group.rotation.x += (tx - group.rotation.x) * Math.min(1, dt * 3);
      group.rotation.y += (ty - group.rotation.y) * Math.min(1, dt * 3);
      if (!reduced) { stars.rotation.y += dt * 0.01; stars.rotation.x += dt * 0.004; }

      // per-node breathing + hover boost
      for (let i = 0; i < glows.length; i++) {
        const base = NODES[i].size * (1 + Math.sin(t * freqs[i] + phases[i]) * 0.08);
        const target = hoveredIdx === i ? base * 1.5 : base;
        const s = glows[i].scale.x + (target - glows[i].scale.x) * Math.min(1, dt * 8);
        glows[i].scale.setScalar(s);
        const mat = glows[i].material as THREE.SpriteMaterial;
        mat.opacity += ((hoveredIdx === i ? 1 : 0.85) - mat.opacity) * Math.min(1, dt * 8);
      }
      linkMat.opacity = 0.13 + Math.sin(t * 0.6) * 0.05;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", sizeCam);
      window.removeEventListener("keydown", onKey);
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("click", onClick);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  /* ------------------------------ card placement --------------------------- */
  const cardStyle = (): React.CSSProperties => {
    if (!card) return {};
    if (mobile) return { position: "fixed", left: 12, right: 12, bottom: 12, zIndex: 30, minHeight: 200 };
    const mount = mountRef.current;
    const w = mount?.clientWidth ?? 1200;
    const h = mount?.clientHeight ?? 700;
    const CW = 320, CH = 210;
    let left = card.x + 40;
    if (left + CW > w - 12) left = card.x - CW - 40;
    left = Math.max(12, left);
    const top = Math.min(Math.max(card.y - CH / 2, 12), h - CH - 12);
    return { position: "absolute", left, top, width: CW, zIndex: 30 };
  };

  const node = card ? NODES[card.i] : null;

  return (
    <div className="relative h-[70vh] w-full md:h-[78vh]">
      <div ref={mountRef} className="absolute inset-0 h-full w-full" />

      {/* hover label */}
      {hover && !card && (
        <div
          className="pointer-events-none absolute select-none uppercase"
          style={{
            left: hover.x, top: hover.y - 26,
            transform: "translate(-50%, -100%)",
            fontFamily: MONO, fontSize: 11, letterSpacing: "0.2em",
            color: "#fff", textShadow: "0 0 10px rgba(232,240,255,0.8)",
          }}
        >
          {NODES[hover.i].title}
        </div>
      )}

      {/* information card */}
      {node && (
        <div
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
            {node.title}
          </p>
          <p className="mt-3 text-white" style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 300, lineHeight: 1.6 }}>
            {node.text}
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
