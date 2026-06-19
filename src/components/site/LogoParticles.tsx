import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// W-in-a-circle as a 3D particle cloud (torus ring + extruded W)
function buildLogo(count: number) {
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
  const R = 22 * s, tube = 0.16, depth = 0.5;
  for (let i = 0; i < count; i++) {
    if (i < nW) {
      let r = Math.random() * total, si = 0;
      while (si < segs.length - 1 && r > segs[si].len) { r -= segs[si].len; si++; }
      const sg = segs[si], t = Math.random();
      p[i * 3] = sg.ax + (sg.bx - sg.ax) * t + (Math.random() - 0.5) * 0.1;
      p[i * 3 + 1] = sg.ay + (sg.by - sg.ay) * t + (Math.random() - 0.5) * 0.1;
      p[i * 3 + 2] = (Math.random() - 0.5) * depth;
    } else {
      const a = Math.random() * Math.PI * 2, ta = Math.random() * Math.PI * 2;
      const rr = R + tube * Math.cos(ta);
      p[i * 3] = Math.cos(a) * rr;
      p[i * 3 + 1] = Math.sin(a) * rr;
      p[i * 3 + 2] = tube * Math.sin(ta);
    }
  }
  return p;
}

const vertexShader = /* glsl */ `
  uniform float uTime, uSize, uPixel;
  attribute float aRand, aPhase;
  varying float vShade;
  void main() {
    vec3 p = position;
    p += 0.02 * vec3(sin(uTime*0.6 + aPhase), cos(uTime*0.5 + aPhase*1.3), sin(uTime*0.4 + aPhase));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (uSize * (0.5 + aRand)) * uPixel / -mv.z;
    vShade = mix(0.55, 1.0, aRand);
  }
`;
const fragmentShader = /* glsl */ `
  varying float vShade;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (length(c) > 0.5) discard;
    float a = smoothstep(0.5, 0.08, length(c));
    gl_FragColor = vec4(vec3(vShade), a);
  }
`;

function Cloud() {
  const points = useMemo(() => {
    const count = 9000;
    const pos = buildLogo(count);
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
        uSize: { value: 16 },
        uPixel: { value: Math.min(window.devicePixelRatio || 1, 2) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Points(geo, mat);
  }, []);

  useFrame((state) => {
    (points.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.elapsedTime;
  });

  return <primitive object={points} />;
}

export default function LogoParticles({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 45, position: [0, 0, 5], near: 0.1, far: 50 }}
      >
        <Cloud />
      </Canvas>
    </div>
  );
}
