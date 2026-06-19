import { Eye, Brain, TrendingUp } from "lucide-react";
import Reveal from "./Reveal";

const traits = [
  { Icon: Eye, t: "Observe", d: "Votre marché, vos concurrents, vos clients. En continu." },
  { Icon: Brain, t: "Comprend", d: "Au delà des chiffres, le sens et les signaux faibles." },
  { Icon: TrendingUp, t: "Anticipe", d: "Ce qui arrive, avant que ça n'arrive." },
];

export default function Kairos() {
  return (
    <section id="kairos" className="relative py-28 md:py-44" style={{ background: "#0b1322" }}>
      <div className="container-wide text-center">
        <Reveal>
          <p className="label">Notre intelligence</p>
          <h2 className="display-xl mx-auto mt-7 max-w-4xl text-5xl sm:text-6xl md:text-7xl">
            Nous avons créé <span className="italic">Kairos.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            Une intelligence qui voit ce que vos concurrents voient déjà. Et bien plus encore.
          </p>
        </Reveal>

        <div className="mx-auto mt-16 grid max-w-4xl gap-12 sm:grid-cols-3">
          {traits.map((tr, i) => (
            <Reveal key={tr.t} delay={i * 0.1}>
              <div className="flex flex-col items-center">
                <tr.Icon className="h-9 w-9 text-foreground/80" strokeWidth={1} />
                <h3 className="mt-6 font-display text-2xl font-light">{tr.t}</h3>
                <p className="mt-2 max-w-[15rem] text-sm text-muted-foreground">{tr.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-16 font-mono text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
            Intégré à votre site. Invisible pour vos visiteurs. Indispensable pour vous.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
