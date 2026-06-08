import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { modules, colorVar } from "@/lib/modules";
import Reveal from "./Reveal";

export default function Modules() {
  return (
    <section id="modules" className="border-t border-border/60">
      <div className="container-tight py-28 md:py-32">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Les modules</p>
          <h2 className="mt-5 max-w-2xl font-display text-4xl font-bold tracking-tight md:text-5xl">
            Quatre modules. Une vision complète.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {modules.map((m, i) => (
            <Reveal key={m.slug} delay={(i % 2) * 0.08}>
              <Link
                to={`/module/${m.slug}`}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-7 transition-colors duration-200 hover:border-foreground/25"
              >
                <div
                  className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: colorVar[m.color] }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: colorVar[m.color] }}
                    >
                      {m.tag}
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold tracking-tight">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.desc}</p>
                </div>
                <span className="relative mt-8 text-sm font-medium text-foreground/80 group-hover:text-foreground">
                  Découvrir
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
