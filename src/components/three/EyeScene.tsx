import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* ============================================================================
   L'Œil — l'œil Kairos en particules blanches. Il suit le curseur, cligne
   de temps en temps, et relie quatre points lumineux (les rôles du système).
   Chaque point (et l'œil lui-même) est cliquable : carte d'information.
   Typo des libellés et cartes : Poppins (la police de base du site).
============================================================================ */

type Node = { title: string; text: string; pos: [number, number, number]; eye?: boolean };

const NODES: Node[] = [
  {
    title: "Kairos AI",
    text: "L'intelligence artificielle qui se connecte à votre site et devient le cerveau de votre business. Automatiquement.",
    pos: [0, 0, 0], eye: true,
  },
  {
    title: "L'Analyste",
    text: "Observe chaque visiteur de votre site. Clics, scrolls, hésitations. Il comprend le comportement humain derrière chaque donnée.",
    pos: [-3.9, 1.7, -0.4],
  },
  {
    title: "Le Stratège",
    text: "Traduit les données en décisions business. Chaque recommandation a un impact estimé en euros réels.",
    pos: [-3.4, -1.9, 0.2],
  },
  {
    title: "Le Veilleur",
    text: "Surveille votre marché, vos concurrents, votre réputation. Il vous alerte avant que vous en ayez besoin.",
    pos: [3.6, 1.9, -0.3],
  },
  {
    title: "WAY Agency",
    text: "On construit votre site. Kairos le fait performer. Ensemble on fait croître votre business.",
    pos: [3.9, -1.6, 0.3],
  },
];

const FONT = "'Poppins', system-ui, sans-serif";

/* the hand-drawn eye: almond outline with a left tail, SPIRAL iris, and
   lashes fanning out from the upper lid (matches the sketch reference) */
function shapeEye(p: Float32Array, count: number) {
  const W = 1.9;
  const thick = 0.045; // stroke thickness (marker feel)
  let i = 0;
  const put = (x: number, y: number) => {
    p[i * 3] = x + (Math.random() - 0.5) * thick * 2;
    p[i * 3 + 1] = y + (Math.random() - 0.5) * thick * 2;
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
    i++;
  };

  const nOut = Math.floor(count * 0.32);
  const nSpi = Math.floor(count * 0.36);
  // outline: upper curve (55%), lower curve (33%), left tail (12%)
  for (let k = 0; k < nOut && i < count; k++) {
    const r = Math.random();
    if (r < 0.55) {
      const t = Math.random();
      put(-W + 2 * W * t, 0.68 * Math.sin(Math.PI * t));
    } else if (r < 0.88) {
      const t = Math.random();
      put(-W + 2 * W * t, -0.52 * Math.sin(Math.PI * t));
    } else {
      const s = Math.random() * 0.55; // the swooping tail, lower-left
      put(-W - s * 0.55, -s * 0.38);
    }
  }
  // spiral iris — big, ~2.6 turns with clearly separated coils (like the sketch)
  const turns = 2.6, cx = -0.02, cy = 0.03;
  for (let k = 0; k < nSpi && i < count; k++) {
    const u = Math.sqrt(Math.random()); // uniform along the coil length
    const th = u * turns * Math.PI * 2;
    const r = 0.07 + 0.43 * u;
    put(cx + Math.cos(th) * r, cy + Math.sin(th) * r * 0.92);
  }
  // lashes fanning from the upper lid
  const LASH_T = [0.13, 0.27, 0.41, 0.55, 0.69, 0.82];
  const per = Math.max(1, Math.floor((count - i) / LASH_T.length));
  for (const t of LASH_T) {
    const bx = -W + 2 * W * t;
    const by = 0.68 * Math.sin(Math.PI * t) + 0.02;
    // radiate away from a point below the eye so the fan opens outward
    const dx = bx - 0, dy = by + 1.1;
    const len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len;
    const L = 0.3 + 0.22 * Math.sin(Math.PI * t);
    for (let k = 0; k < per && i < count; k++) {
      const s = 0.06 + Math.random() * L;
      put(bx + ux * s, by + uy * s);
    }
  }
  while (i < count) { // safety fill on the outline
    const t = Math.random();
    put(-W + 2 * W * t, 0.68 * Math.sin(Math.PI * t));
  }
}

const vert = /* glsl */ `
  uniform float uTime, uSize, uPixel;
  attribute float aRand, aPhase;
  varying float vShade;
  void main() {
    vec3 p = position;
    p += 0.015 * vec3(sin(uTime*0.6 + aPhase), cos(uTime*0.5 + aPhase*1.3), sin(uTime*0.4 + aPhase));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (uSize * (0.5 + aRand)) * uPixel / -mv.z;
    vShade = mix(0.45, 1.0, aRand);
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

export default function EyeScene() {
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

    // on phone: satellites sit above/below the eye instead of far left/right
    const nodePos: [number, number, number][] = isMobile()
      ? [[0, 0, 0], [-1.5, 2.5, -0.2], [-1.5, -2.5, 0.2], [1.5, 2.5, -0.2], [1.5, -2.5, 0.2]]
      : NODES.map((n) => n.pos);

    /* --------------------------------- l'œil -------------------------------- */
    const eyeGroup = new THREE.Group();
    scene.add(eyeGroup);
    const count = lowPower ? 5000 : 9000;
    const pos = new Float32Array(count * 3);
    shapeEye(pos, count);
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
        uSize: { value: lowPower ? 13 : 15 },
        uPixel: { value: Math.min(window.devicePixelRatio || 1, 2) },
      },
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const eye = new THREE.Points(geo, mat);
    eye.scale.setScalar(1.35);
    eyeGroup.add(eye);
    disposables.push(geo, mat);

    /* ------------------------- liens + points satellites --------------------- */
    const linkPts: number[] = [];
    for (let i = 1; i < NODES.length; i++) linkPts.push(0, 0, 0, ...nodePos[i]);
    const linkGeo = new THREE.BufferGeometry();
    linkGeo.setAttribute("position", new THREE.Float32BufferAttribute(linkPts, 3));
    const linkMat = new THREE.LineBasicMaterial({ color: 0xe8f0ff, transparent: true, opacity: 0.14 });
    scene.add(new THREE.LineSegments(linkGeo, linkMat));
    disposables.push(linkGeo, linkMat);

    const tex = glowTexture();
    disposables.push(tex);
    const glows: THREE.Sprite[] = [];
    const hits: THREE.Mesh[] = [];
    const nodeWorld = nodePos.map((p3) => new THREE.Vector3(...p3));

    NODES.forEach((n, i) => {
      if (!n.eye) {
        const gm = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending });
        const s = new THREE.Sprite(gm);
        s.position.set(...nodePos[i]);
        s.scale.setScalar(0.9);
        scene.add(s);
        glows.push(s);
        disposables.push(gm);

        const cg = new THREE.SphereGeometry(0.05, 12, 12);
        const cm = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const core = new THREE.Mesh(cg, cm);
        core.position.set(...nodePos[i]);
        scene.add(core);
        disposables.push(cg, cm);
      }
      const hg = new THREE.SphereGeometry(n.eye ? 1.5 : 0.6, 12, 12);
      const hm = new THREE.MeshBasicMaterial({ visible: false });
      const hit = new THREE.Mesh(hg, hm);
      hit.position.set(...nodePos[i]);
      hit.userData.i = i;
      scene.add(hit);
      hits.push(hit);
      disposables.push(hg, hm);
    });

    /* ----------------------------- caméra / resize --------------------------- */
    const sizeCam = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      camera.aspect = w / h;
      camera.position.set(0, 0, isMobile() ? 12.5 : 8.6);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      setMobile(isMobile());
    };
    sizeCam();
    window.addEventListener("resize", sizeCam);

    const project = (p: THREE.Vector3) => {
      const r = renderer.domElement.getBoundingClientRect();
      const v = p.clone().project(camera);
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
    const phases2 = NODES.map(() => Math.random() * Math.PI * 2);
    const clock = new THREE.Clock();
    let raf = 0;
    let nextBlink = 3 + Math.random() * 3;
    const loop = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      mat.uniforms.uTime.value = t;

      // l'œil suit le curseur (rotation douce), avec une petite dérive au repos
      const tx = -mouse.y * 0.28 + Math.sin(t * 0.4) * 0.04;
      const ty = mouse.x * 0.45 + Math.cos(t * 0.3) * 0.05;
      eyeGroup.rotation.x += (tx - eyeGroup.rotation.x) * Math.min(1, dt * 4);
      eyeGroup.rotation.y += (ty - eyeGroup.rotation.y) * Math.min(1, dt * 4);

      // clignement naturel
      if (!reduced) {
        nextBlink -= dt;
        if (nextBlink <= 0) nextBlink = 3.5 + Math.random() * 3.5;
        const b = nextBlink < 0.24 ? Math.abs(Math.sin((0.24 - nextBlink) / 0.24 * Math.PI)) : 0;
        eyeGroup.scale.y = 1 - b * 0.85;
      }

      // respiration des points satellites (+ boost au survol)
      glows.forEach((g, gi) => {
        const nodeIdx = gi + 1; // glows exclude the eye (index 0)
        const base = 0.9 * (1 + Math.sin(t * 0.7 + phases2[nodeIdx]) * 0.08);
        const target = hoveredIdx === nodeIdx ? base * 1.5 : base;
        g.scale.setScalar(g.scale.x + (target - g.scale.x) * Math.min(1, dt * 8));
      });
      linkMat.opacity = 0.11 + Math.sin(t * 0.6) * 0.04;

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
            left: hover.x, top: hover.y - (NODES[hover.i].eye ? 96 : 26),
            transform: "translate(-50%, -100%)",
            fontFamily: FONT, fontSize: 12, fontWeight: 500, letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#fff", textShadow: "0 0 12px rgba(232,240,255,0.8)",
          }}
        >
          {NODES[hover.i].title}
        </div>
      )}

      {/* carte d'information — Poppins (police de base) */}
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
