import { useId } from "react";

/* Nuage « mixed media » : peinture épaisse (impasto) au couteau, en SVG.
   Un corps bleu + reliefs blancs sur les crêtes + bords granuleux, obtenus
   par feTurbulence + feDisplacementMap + éclairages diffus/spéculaire.
   Chaque instance a un id de filtre unique (useId). */

const SHAPE = (
  <g>
    <ellipse cx="100" cy="86" rx="70" ry="30" />
    <ellipse cx="52" cy="84" rx="34" ry="24" />
    <ellipse cx="150" cy="86" rx="36" ry="24" />
    <ellipse cx="80" cy="58" rx="34" ry="30" />
    <ellipse cx="126" cy="62" rx="30" ry="26" />
    <ellipse cx="104" cy="50" rx="26" ry="24" />
  </g>
);

export default function PaintedCloud({
  size = 130,
  base = "#4d86cf",
  seed = 12,
  className = "",
  style,
}: {
  size?: number;
  base?: string;
  seed?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, "");
  const fid = `pc-${raw}`;
  return (
    <svg
      width={size}
      height={size * 0.63}
      viewBox="0 0 200 140"
      className={className}
      style={style}
      aria-hidden
    >
      <defs>
        <filter id={fid} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.06" numOctaves="5" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" result="disp" />
          <feGaussianBlur in="n" stdDeviation="1.2" result="bump" />
          <feDiffuseLighting in="bump" surfaceScale="3.2" diffuseConstant="1.15" lightingColor="#ffffff" result="dif">
            <feDistantLight azimuth="230" elevation="56" />
          </feDiffuseLighting>
          <feComposite in="dif" in2="disp" operator="in" result="difc" />
          <feBlend in="disp" in2="difc" mode="multiply" result="paint" />
          <feSpecularLighting in="bump" surfaceScale="4" specularConstant="0.4" specularExponent="22" lightingColor="#ffffff" result="spec">
            <feDistantLight azimuth="230" elevation="60" />
          </feSpecularLighting>
          <feComposite in="spec" in2="disp" operator="in" result="specc" />
          <feBlend in="paint" in2="specc" mode="screen" />
        </filter>
      </defs>
      <g filter={`url(#${fid})`} fill={base}>
        {SHAPE}
      </g>
    </svg>
  );
}
