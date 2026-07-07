import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* ============================================================================
   L'Orbite — composition minimale et centrée : un cœur lumineux (Kairos)
   entouré de trois anneaux de particules qui tournent lentement. Les quatre
   rôles sont des points posés sur les anneaux, reliés au cœur. Survol :
   libellé ; clic : carte d'information (Poppins).
============================================================================ */

type Node = { title: string; text: string; angle: number; radius: number; core?: boolean };

const NODES: Node[] = [
  {
    title: "Kairos AI",
    text: "L'intelligence artificielle qui se connecte à votre site et devient le cerveau de votre business. Automatiquement.",
    angle: 0, radius: 0, core: true,
  },
  {
    title: "L'Analyste",
    text: "Observe chaque visiteur de votre site. Clics, scrolls, hésitations. Il comprend le comportement humain derrière chaque donnée.",
    angle: 148, radius: 1.9,
  },
  {
    title: "Le Stratège",
    text: "Traduit les données en décisions business. Chaque recommandation a un impact estimé en euros réels.",
    angle: 216, radius: 2.6,
  },
  {
    title: "Le Veilleur",
    text: "Surveille votre marché, vos concurrents, votre réputation. Il vous alerte avant que vous en ayez besoin.",
    angle: 33, radius: 1.9,
  },
  {
    title: "WAY Agency",
    text: "On construit votre site. Kairos le fait performer. Ensemble on fait croître votre business.",
    angle: 327, radius: 2.6,
  },
];

const RINGS = [1.2, 1.9, 2.6];
const FONT = "'Poppins', system-ui, sans-serif";

const nodeXY = (n: Node): [number, number, number] => {
  const a = (n.angle * Math.PI) / 180;
  return [Math.cos(a) * n.radius, Math.sin(a) * n.radius, 0];
};

const vert = /* glsl */ `
  uniform float uTime, uSize, uPixel;
  attribute float aRand, aPhase;
  varying float vShade;
  void main() {
    vec3 p = position;
    p += 0.012 * vec3(sin(uTime*0.6 + aPhase), cos(uTime*0.5 + aPhase*1.3), sin(uTime*0.4 + aPhase));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (uSize * (0.5 + aRand)) * uPixel / -mv.z;
    vShade = mix(0.4, 1.0, aRand);
  }
`;
const frag = /* glsl */ `
  varying float vShade;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (length(c) > 0.5) discard;
    float a = smoothstep(0.5, 0.08, length(c));
    gl_FragColor = vec4(vec3(vShade), a);
  }
`;

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const x = c.getContext("2d")!;
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.2, "rgba(232,240,255,0.85)");
  g.addColorStop(0.5, "rgba(200,215,255,0.22)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function makePoints(builder: (p: Float32Array, n: number) => void, n: number, size: number) {
  const pos = new Float32Array(n * 3);
  builder(pos, n);
  const rand = new Float32Array(n);
  const phase = new Float32Array(n);
  for (let i = 0; i < n; i++) { rand[i] = Math.random(); phase[i] = Math.random() * Math.PI * 2; }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
  geo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: size },
      uPixel: { value: Math.min(window.devicePixelRatio || 1, 2) },
    },
    vertexShader: vert,
    fragmentShader: frag,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return { points: new THREE.Points(geo, mat), geo, mat };
}

export default function OrbScene() {
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
    const isMobile = () => window.innerWidth < 768;
    const lowPower = isMobile() || window.matchMedia("(pointer: coarse)").matches;
    const group = new THREE.Group();
    scene.add(group);

    /* ------------------------------ les anneaux ------------------------------ */
    const total = lowPower ? 5200 : 9000;
    const ringMats: THREE.ShaderMaterial[] = [];
    const ringObjs: THREE.Points[] = [];
    const circumSum = RINGS.reduce((s, r) => s + r, 0);
    const nCore = Math.floor(total * 0.3);
    RINGS.forEach((R) => {
      const n = Math.floor((total - nCore) * (R / circumSum));
      const { points, geo, mat } = makePoints((p, m) => {
        for (let i = 0; i < m; i++) {
          const a = Math.random() * Math.PI * 2;
          const rr = R + (Math.random() - 0.5) * 0.035;
          p[i * 3] = Math.cos(a) * rr;
          p[i * 3 + 1] = Math.sin(a) * rr;
          p[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
        }
      }, n, lowPower ? 11 : 13);
      group.add(points);
      ringObjs.push(points);
      ringMats.push(mat);
      disposables.push(geo, mat);
    });

    /* -------------------------------- le cœur -------------------------------- */
    const core = makePoints((p, m) => {
      for (let i = 0; i < m; i++) {
        // fibonacci sphere surface, softly jittered
        const t = (i + 0.5) / m;
        const incl = Math.acos(1 - 2 * t);
        const az = i * Math.PI * (3 - Math.sqrt(5));
        const r = 0.48 * (0.94 + Math.random() * 0.12);
        p[i * 3] = Math.sin(incl) * Math.cos(az) * r;
        p[i * 3 + 1] = Math.cos(incl) * r;
        p[i * 3 + 2] = Math.sin(incl) * Math.sin(az) * r;
      }
    }, nCore, lowPower ? 12 : 14);
    group.add(core.points);
    disposables.push(core.geo, core.mat);

    // soft glow behind the core
    const tex = glowTexture();
    disposables.push(tex);
    const coreGlowMat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending });
    const coreGlow = new THREE.Sprite(coreGlowMat);
    coreGlow.scale.setScalar(2.6);
    group.add(coreGlow);
    disposables.push(coreGlowMat);

    /* -------------------------- liens + points des rôles ---------------------- */
    const nodeWorld = NODES.map((n) => new THREE.Vector3(...nodeXY(n)));
    const linkPts: number[] = [];
    for (let i = 1; i < NODES.length; i++) linkPts.push(0, 0, 0, ...nodeXY(NODES[i]));
    const linkGeo = new THREE.BufferGeometry();
    linkGeo.setAttribute("position", new THREE.Float32BufferAttribute(linkPts, 3));
    const linkMat = new THREE.LineBasicMaterial({ color: 0xe8f0ff, transparent: true, opacity: 0.1 });
    group.add(new THREE.LineSegments(linkGeo, linkMat));
    disposables.push(linkGeo, linkMat);

    const glows: THREE.Sprite[] = [];
    const hits: THREE.Mesh[] = [];
    NODES.forEach((n, i) => {
      if (!n.core) {
        const gm = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending });
        const s = new THREE.Sprite(gm);
        s.position.copy(nodeWorld[i]);
        s.scale.setScalar(0.7);
        group.add(s);
        glows.push(s);
        disposables.push(gm);

        const cg = new THREE.SphereGeometry(0.045, 12, 12);
        const cm = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const dot = new THREE.Mesh(cg, cm);
        dot.position.copy(nodeWorld[i]);
        group.add(dot);
        disposables.push(cg, cm);
      }
      const hg = new THREE.SphereGeometry(n.core ? 0.9 : 0.55, 12, 12);
      const hm = new THREE.MeshBasicMaterial({ visible: false });
      const hit = new THREE.Mesh(hg, hm);
      hit.position.copy(nodeWorld[i]);
      hit.userData.i = i;
      group.add(hit);
      hits.push(hit);
      disposables.push(hg, hm);
    });

    /* ----------------------------- caméra / resize --------------------------- */
    const sizeCam = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      camera.aspect = w / h;
      const tan = Math.tan(THREE.MathUtils.degToRad(22.5));
      // fit the outer ring (+ margin) in both axes
      const need = 3.2;
      camera.position.set(0, 0, Math.max(need / tan / camera.aspect, need / tan) + 1);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      setMobile(isMobile());
    };
    sizeCam();
    window.addEventListener("resize", sizeCam);

    const project = (p: THREE.Vector3) => {
      const r = renderer.domElement.getBoundingClientRect();
      const v = p.clone();
      group.localToWorld(v);
      v.project(camera);
      return { x: (v.x * 0.5 + 0.5) * r.width, y: (-v.y * 0.5 + 0.5) * r.height };
    };

    /* ------------------------------ interactions ----------------------------- */
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
      }
      setHover(i >= 0 ? { i, ...project(nodeWorld[i]) } : null);
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

    /* --------------------------------- animer -------------------------------- */
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speeds = [0.055, -0.038, 0.024];
    const phases = NODES.map(() => Math.random() * Math.PI * 2);
    const clock = new THREE.Clock();
    let raf = 0;
    const loop = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      ringMats.forEach((m) => (m.uniforms.uTime.value = t));
      core.mat.uniforms.uTime.value = t;

      // slow in-plane rotation of each ring (circles stay circles)
      if (!reduced) ringObjs.forEach((r, ri) => { r.rotation.z += speeds[ri] * dt; });

      // core breathing
      const cs = 1 + Math.sin(t * 0.8) * 0.045;
      core.points.scale.setScalar(cs);
      coreGlowMat.opacity = 0.5 + Math.sin(t * 0.8) * 0.08 + (hoveredIdx === 0 ? 0.25 : 0);
      coreGlow.scale.setScalar(2.6 * cs + (hoveredIdx === 0 ? 0.5 : 0));

      // gentle parallax
      const tx = -mouse.y * 0.16;
      const ty = mouse.x * 0.22;
      group.rotation.x += (tx - group.rotation.x) * Math.min(1, dt * 3);
      group.rotation.y += (ty - group.rotation.y) * Math.min(1, dt * 3);

      // satellites breathing (+ hover boost)
      glows.forEach((g, gi) => {
        const nodeIdx = gi + 1;
        const base = 0.7 * (1 + Math.sin(t * 0.7 + phases[nodeIdx]) * 0.08);
        const target = hoveredIdx === nodeIdx ? base * 1.6 : base;
        g.scale.setScalar(g.scale.x + (target - g.scale.x) * Math.min(1, dt * 8));
      });
      linkMat.opacity = 0.08 + Math.sin(t * 0.5) * 0.03;

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

  /* ------------------------------ carte / placement ------------------------- */
  const cardStyle = (): React.CSSProperties => {
    if (!card) return {};
    if (mobile) return { position: "fixed", left: 12, right: 12, bottom: 12, zIndex: 30, minHeight: 180 };
    const mount = mountRef.current;
    const w = mount?.clientWidth ?? 1200;
    const h = mount?.clientHeight ?? 700;
    const CW = 320, CH = 200;
    let left = card.x + 44;
    if (left + CW > w - 12) left = card.x - CW - 44;
    left = Math.max(12, left);
    const top = Math.min(Math.max(card.y - CH / 2, 12), h - CH - 12);
    return { position: "absolute", left, top, width: CW, zIndex: 30 };
  };

  const node = card ? NODES[card.i] : null;

  return (
    <div className="relative h-[64vh] w-full md:h-[76vh]">
      <div ref={mountRef} className="absolute inset-0 h-full w-full" />

      {/* libellé au survol — Poppins */}
      {hover && !card && (
        <div
          className="pointer-events-none absolute select-none"
          style={{
            left: hover.x, top: hover.y - (NODES[hover.i].core ? 60 : 24),
            transform: "translate(-50%, -100%)",
            fontFamily: FONT, fontSize: 12, fontWeight: 500, letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#fff", textShadow: "0 0 12px rgba(232,240,255,0.8)",
          }}
        >
          {NODES[hover.i].title}
        </div>
      )}

      {/* carte d'information — Poppins */}
      {node && (
        <div
          key={card!.i}
          style={{
            ...cardStyle(),
            background: "rgba(4,4,10,0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: mobile ? 24 : 32,
            maxWidth: mobile ? undefined : 320,
            animation: mobile ? "way-card-up 0.4s cubic-bezier(0.16,1,0.3,1)" : "way-card-in 0.4s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <span className="absolute left-4 top-4 h-1.5 w-1.5 rounded-full bg-white" style={{ boxShadow: "0 0 8px rgba(255,255,255,0.9)" }} />
          <button
            onClick={() => setCard(null)}
            aria-label="Fermer"
            className="absolute right-4 top-3 transition-opacity hover:opacity-100"
            style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.45)" }}
          >
            ✕
          </button>
          <p style={{ fontFamily: FONT, fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
            {node.title}
          </p>
          <p className="mt-3 text-white" style={{ fontFamily: FONT, fontSize: mobile ? 14 : 15, fontWeight: 300, lineHeight: 1.7 }}>
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
