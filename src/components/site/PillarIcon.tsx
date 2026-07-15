/* Icônes soignées pour les colonnes des sections Agence & Kairos.
   Line-art blanc + accents bleu clair, posées dans un badge dégradé, avec
   une micro-animation discrète (meilleurs graphismes que les ex-pixels). */

const ACCENT = "#bfe0ff";
const stroke = {
  fill: "none",
  stroke: "#ffffff",
  strokeWidth: 2.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ICONS: Record<string, React.ReactNode> = {
  // Stratégie — cible + flèche au centre
  strategy: (
    <g {...stroke}>
      <circle cx="22" cy="26" r="15" />
      <circle cx="22" cy="26" r="8.5" />
      <circle cx="22" cy="26" r="3" fill={ACCENT} stroke="none" className="pi-pulse" />
      <path d="M23 25 L39 9" />
      <path d="M33 9 h6 v6" />
    </g>
  ),
  // Design — courbe de Bézier + poignées (outil vectoriel)
  design: (
    <g {...stroke}>
      <path d="M9 37 C 19 37, 23 14, 39 14" />
      <path d="M9 37 L16 30 M39 14 L32 21" strokeWidth={1.6} stroke={ACCENT} />
      <circle cx="9" cy="37" r="3" fill="#0b2b4a" />
      <circle cx="39" cy="14" r="3" fill={ACCENT} stroke="#fff" />
    </g>
  ),
  // Performance — jauge (compteur) + aiguille
  performance: (
    <g {...stroke}>
      <path d="M8 33 A16 16 0 0 1 40 33" />
      <path d="M9 33 l3 -0.4 M39 33 l-3 -0.4 M24 17 v3" strokeWidth={1.6} stroke={ACCENT} />
      <path className="pi-needle" d="M24 33 L32 22" stroke={ACCENT} />
      <circle cx="24" cy="33" r="2.6" fill="#fff" stroke="none" />
    </g>
  ),
  // Observe — œil + pupille qui bat
  observe: (
    <g {...stroke}>
      <path d="M6 24 C 14 14, 34 14, 42 24 C 34 34, 14 34, 6 24 Z" />
      <circle cx="24" cy="24" r="6.5" />
      <circle cx="24" cy="24" r="2.6" fill={ACCENT} stroke="none" className="pi-pulse" />
    </g>
  ),
  // Comprend — ampoule + filament qui palpite
  understand: (
    <g {...stroke}>
      <path d="M24 7 a12 12 0 0 1 7.5 21.4 c-1.6 1.4-2.6 3-2.7 5.1 h-9.6 c-.1-2.1-1.1-3.7-2.7-5.1 A12 12 0 0 1 24 7 Z" />
      <path d="M20 37 h8 M21.5 41 h5" />
      <path d="M24 17 v7 M20.5 21 h7" strokeWidth={1.7} stroke={ACCENT} className="pi-pulse" />
    </g>
  ),
  // Analyse — histogramme qui respire + axe
  analyze: (
    <g {...stroke}>
      <path d="M9 40 h30 M9 40 V13" />
      <rect className="pi-bar" style={{ animationDelay: "0s" }} x="14" y="28" width="5" height="12" rx="1" fill={ACCENT} />
      <rect className="pi-bar" style={{ animationDelay: "0.2s" }} x="22" y="22" width="5" height="18" rx="1" fill={ACCENT} />
      <rect className="pi-bar" style={{ animationDelay: "0.4s" }} x="30" y="16" width="5" height="24" rx="1" fill={ACCENT} />
    </g>
  ),
};

export type PillarIconName = keyof typeof ICONS;

export default function PillarIcon({ name }: { name: PillarIconName }) {
  return (
    <span
      className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl md:h-[68px] md:w-[68px]"
      style={{
        background: "linear-gradient(158deg, rgba(130,185,240,0.34) 0%, rgba(28,66,124,0.5) 100%)",
        border: "1px solid rgba(255,255,255,0.28)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 12px 26px -14px rgba(0,0,0,0.55)",
      }}
    >
      <svg viewBox="0 0 48 48" className="h-9 w-9 md:h-10 md:w-10" aria-hidden>
        {ICONS[name]}
      </svg>
    </span>
  );
}
