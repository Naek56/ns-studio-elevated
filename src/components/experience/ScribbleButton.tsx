/* Un vrai bouton rouge, physique et brillant (plus de dessin au crayon).
   Il reste ROUGE : le quiz « De quelle couleur était le bouton ? » attend
   la réponse « Rouge ».
   `variant="alt"` = le même bouton, légèrement différent (rouge un peu plus
   sombre, un poil plus petit) — pour le moment où l'on demande si le cerveau
   n'a pas simplement « reconstruit » le souvenir. */

export default function ScribbleButton({
  onClick,
  variant = "base",
  label = "appuie",
}: {
  onClick?: () => void;
  variant?: "base" | "alt";
  label?: string;
}) {
  const alt = variant === "alt";
  const size = alt ? 138 : 154;

  const face = alt
    ? "radial-gradient(120% 120% at 34% 24%, #ff7a68 0%, #ec3a2d 34%, #c11a12 66%, #8c0c06 100%)"
    : "radial-gradient(120% 120% at 34% 24%, #ff9384 0%, #ff4b3c 32%, #e11f14 66%, #a6100a 100%)";

  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="rb-btn group relative inline-flex items-center justify-center outline-none"
      style={{ width: size, height: size, WebkitTapHighlightColor: "transparent" }}
    >
      {/* ombre portée au sol */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-full h-3 -translate-x-1/2 -translate-y-1 rounded-[50%]"
        style={{ width: size * 0.6, background: "radial-gradient(closest-side, rgba(0,0,0,0.45), transparent 75%)", filter: "blur(2px)" }}
      />

      {/* corps du bouton */}
      <span
        aria-hidden
        className="relative h-full w-full rounded-full transition-transform duration-300 group-hover:scale-[1.06] group-active:scale-95"
        style={{
          background: face,
          boxShadow: [
            "0 22px 40px -14px rgba(180,14,6,0.6)",   // halo rouge diffus
            "0 8px 16px -5px rgba(0,0,0,0.55)",        // ombre nette
            "inset 0 4px 7px rgba(255,255,255,0.5)",   // arête lumineuse en haut
            "inset 0 -12px 24px rgba(120,8,4,0.6)",    // creux sombre en bas
            "inset 0 0 0 1px rgba(255,130,110,0.45)",  // fin liseré
          ].join(", "),
        }}
      >
        {/* reflet spéculaire */}
        <span
          aria-hidden
          className="absolute left-1/2 top-[13%] h-[24%] w-[50%] -translate-x-1/2 rounded-[50%]"
          style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.9), rgba(255,255,255,0) 72%)", filter: "blur(1px)" }}
        />
      </span>
    </button>
  );
}
