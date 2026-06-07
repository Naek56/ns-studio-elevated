// Animated orange-on-black ambience shared across the homepage.
export default function SiteBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* drifting ember blobs */}
      <div className="absolute -left-40 top-[-10%] h-[42rem] w-[42rem] rounded-full bg-[hsl(24_100%_50%/0.18)] blur-[140px] animate-drift" />
      <div className="absolute right-[-15%] top-[20%] h-[36rem] w-[36rem] rounded-full bg-[hsl(36_100%_52%/0.14)] blur-[150px] animate-drift-slow" />
      <div className="absolute bottom-[-20%] left-[20%] h-[40rem] w-[40rem] rounded-full bg-[hsl(14_100%_45%/0.12)] blur-[160px] animate-drift" style={{ animationDelay: "6s" }} />

      {/* slow rotating conic sheen */}
      <div className="absolute left-1/2 top-1/2 h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2 opacity-[0.06] animate-spin-slow"
        style={{ background: "conic-gradient(from 0deg, transparent, hsl(28 100% 55% / 0.6), transparent 40%)" }} />

      {/* grid + vignette + grain */}
      <div className="absolute inset-0 grid-pattern opacity-60" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 30%, transparent 40%, hsl(24 30% 4% / 0.9) 100%)" }} />
      <div className="absolute inset-0 grain opacity-[0.15] mix-blend-soft-light" />
    </div>
  );
}
