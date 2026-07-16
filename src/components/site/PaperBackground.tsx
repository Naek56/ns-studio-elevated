import { useEffect, useRef } from "react";

/**
 * Le fond du site agence : la photo (background.svg), LÉGÈREMENT PIXELISÉE.
 * On dessine l'image sur un petit canvas (~230 px de large) puis on l'étire
 * en plein écran avec image-rendering: pixelated → une mosaïque de pixels
 * (~8 px à l'écran), subtile car les teintes voisines sont proches.
 * Si le canvas échoue, le fond lisse d'origine reste visible dessous.
 */
const PHOTO_URL = "/background.svg";
const PIX_W = 230; // largeur du canvas → taille des pixels à l'écran (plus petit = plus gros pixels)

export default function PaperBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = new Image();
    img.src = PHOTO_URL;
    img.onload = () => {
      const ratio = window.innerHeight / window.innerWidth || 0.5625;
      canvas.width = PIX_W;
      canvas.height = Math.max(1, Math.round(PIX_W * ratio));
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      // dessin « cover » : remplit le canvas en conservant les proportions
      const s = Math.max(canvas.width / img.width, canvas.height / img.height);
      const w = img.width * s, h = img.height * s;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    };
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
      {/* version pixelisée par-dessus */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
