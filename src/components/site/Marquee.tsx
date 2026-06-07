const items = [
  "Design haut de gamme",
  "Analytics temps réel",
  "Next.js & React",
  "SEO technique",
  "Performance < 1s",
  "Conversion",
  "Motion design",
  "A/B testing",
];

export default function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-border/60 py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="flex w-max animate-marquee gap-10">
        {[...items, ...items].map((it, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {it}
            <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
