import { useEffect, useRef } from "react";

/**
 * Le fond du site agence : la photo (background.svg), PIXELISÉE et un peu
 * ANIMÉE. On dessine l'image sur un petit canvas (~140 px de large) étiré en
 * plein écran avec image-rendering: pixelated → gros pixels (~13 px).
 * Toutes les ~450 ms, on redessine avec un léger décalage de source : les
 * pixels « clignotent » subtilement, façon mosaïque vivante (stop-motion).
 * Si le canvas échoue, le fond lisse d'origine reste visible dessous.
 */
const PHOTO_URL = "/background.svg";
const PIX_W = 140; // largeur du canvas → taille des pixels (plus petit = plus gros)
const STEP_MS = 450; // cadence de l'animation (coupes, pas de fondu)

// petits décalages de la source, en px canvas — cycle de 6 poses
const OFFSETS: [number, number][] = [[0, 0], [0.7, -0.4], [-0.5, 0.6], [0.3, 0.8], [-0.8, -0.3], [0.5, -0.7]];

export default function PaperBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const img = new Image();
    img.src = PHOTO_URL;
    let timer: number | undefined;
    let pose = 0;

    const draw = (dx: number, dy: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx || !img.complete) return;
      const s = Math.max(canvas.width / img.width, canvas.height / img.height);
      const w = img.width * s, h = img.height * s;
      ctx.imageSmoothingEnabled = true;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, (canvas.width - w) / 2 + dx, (canvas.height - h) / 2 + dy, w, h);
    };

    const size = () => {
      const ratio = window.innerHeight / window.innerWidth || 0.5625;
      canvas.width = PIX_W;
      canvas.height = Math.max(1, Math.round(PIX_W * ratio));
      draw(0, 0);
    };

    img.onload = () => {
      size();
      if (!reduced) {
        timer = window.setInterval(() => {
          pose = (pose + 1) % OFFSETS.length;
          draw(OFFSETS[pose][0], OFFSETS[pose][1]);
        }, STEP_MS);
      }
    };
    window.addEventListener("resize", size);
    return () => { window.clearInterval(timer); window.removeEventListener("resize", size); };
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 -z-10 bg-black">
      {/* repli lisse (si le canvas ne peut pas dessiner) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${PHOTO_URL}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* version pixelisée animée par-dessus */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
