import { useState } from "react";
import PaintedCloud from "./PaintedCloud";

/* Affiche le nuage « mixed media » envoyé par le client (/cloud.png, PNG
   transparent). Tant que le fichier n'est pas déposé dans /public, on retombe
   sur le nuage peint en SVG pour ne rien casser. */

export default function CloudSprite({
  size = 130,
  flip = false,
  base = "#4d86cf",
  seed = 12,
}: {
  size?: number;
  flip?: boolean;
  base?: string;
  seed?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) return <PaintedCloud size={size} base={base} seed={seed} />;

  return (
    <img
      src="/cloud.png"
      alt=""
      aria-hidden
      width={size}
      onError={() => setFailed(true)}
      style={{ height: "auto", display: "block", transform: flip ? "scaleX(-1)" : undefined }}
    />
  );
}
