import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";

const projects = [
  {
    name: "Lumen",
    tags: ["Web Design", "Direction Artistique", "Identité"],
    bg: "linear-gradient(135deg,#1b2a4a,#0c1322 60%,#243b6b)",
  },
  {
    name: "Atlas Finance",
    tags: ["Web Design", "UX", "Motion"],
    bg: "linear-gradient(135deg,#2a2540,#13101f 55%,#3a2b5e)",
  },
  {
    name: "Orbit",
    tags: ["Identité", "Web Design", "Direction Artistique"],
    bg: "linear-gradient(135deg,#103436,#0a1414 55%,#1d5658)",
    wide: true,
  },
];

function Mockup({ bg }: { bg: string }) {
  return (
    <div className="absolute inset-0" style={{ background: bg }}>
      <div className="absolute left-6 right-6 top-6 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-white/30" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
      </div>
      <div className="absolute inset-x-10 top-1/2 -translate-y-1/2 space-y-3">
        <div className="h-6 w-1/2 rounded bg-white/15" />
        <div className="h-2.5 w-3/4 rounded bg-white/10" />
        <div className="h-2.5 w-2/3 rounded bg-white/10" />
        <div className="mt-4 h-8 w-28 rounded-full bg-white/20" />
      </div>
    </div>
  );
}

export default function Realisations() {
  return (
    <section id="realisations" className="relative border-t border-white/5 py-24 md:py-40">
      <div className="container-wide">
        <Reveal>
          <p className="label">Réalisations</p>
          <h2 className="display-xl mt-6 text-5xl sm:text-6xl md:text-7xl">Nos directions.</h2>
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            Redesigns concept &amp; directions créatives.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={(i % 2) * 0.1} className={p.wide ? "sm:col-span-2" : ""}>
              <a
                href="#contact"
                className="group block overflow-hidden rounded-xl border border-white/10 transition-transform duration-300 hover:scale-[1.02]"
              >
                <div className={`relative overflow-hidden ${p.wide ? "aspect-[21/9]" : "aspect-[16/10]"}`}>
                  <Mockup bg={p.bg} />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/65 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 text-white transition-transform duration-300 group-hover:scale-110">
                      <ArrowUpRight className="h-6 w-6" />
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 p-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-2xl font-light">{p.name}</h3>
                    <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">Concept</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded-full border border-white/15 px-3 py-1 font-mono text-[0.65rem] text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
