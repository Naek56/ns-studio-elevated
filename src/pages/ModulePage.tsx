import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { getModule, colorVar, modules } from "@/lib/modules";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

export default function ModulePage() {
  const { slug } = useParams();
  const mod = getModule(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!mod) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center">
        <p className="text-2xl font-bold">Module introuvable.</p>
        <Link to="/" className="btn-liquid">Retour à l'accueil</Link>
      </div>
    );
  }

  const accent = colorVar[mod.color];
  const others = modules.filter((m) => m.slug !== mod.slug);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container-tight pt-32 pb-24">
        <Link to="/#modules" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Tous les modules
        </Link>

        <div className="relative mt-10">
          <div className="pointer-events-none absolute -left-10 -top-16 h-48 w-48 rounded-full opacity-30 blur-[90px]" style={{ background: accent }} />
          <span className="relative text-xs font-semibold uppercase tracking-wider" style={{ color: accent }}>
            {mod.tag}
          </span>
          <h1 className="relative mt-4 font-display text-5xl font-extrabold tracking-tight md:text-6xl">{mod.title}</h1>
          <p className="relative mt-5 max-w-xl text-lg text-muted-foreground">{mod.desc}</p>
        </div>

        <ul className="mt-12 max-w-xl space-y-4 border-t border-border/70 pt-10">
          {mod.points.map((p) => (
            <li key={p} className="flex items-start gap-3">
              <Check className="mt-1 h-5 w-5 shrink-0" style={{ color: accent }} />
              <span className="text-foreground/90">{p}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <a href="mailto:hello@nsintelligence.com" className="btn-liquid-accent group">
            Activer ce module
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="mt-20 border-t border-border/70 pt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">Autres modules</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {others.map((m) => (
              <Link
                key={m.slug}
                to={`/module/${m.slug}`}
                className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/25"
              >
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colorVar[m.color] }}>
                  {m.tag}
                </span>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-display text-lg font-bold tracking-tight">{m.title}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
