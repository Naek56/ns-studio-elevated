import { motion } from "framer-motion";
import { ArrowUpRight, Users, MousePointerClick, TrendingUp } from "lucide-react";
import Reveal from "./Reveal";

const bars = [38, 52, 44, 67, 59, 78, 71, 88, 82, 96];

export default function Intelligence() {
  return (
    <section id="intelligence" className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[hsl(var(--primary-glow))]">
            La couche intelligence
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            Votre site vous <span className="font-serif-accent italic text-gradient-primary">parle enfin.</span>
          </h2>
          <p className="mt-5 max-w-xl text-muted-foreground">
            Chaque site NSI est livré avec un tableau de bord clair : d'où viennent vos visiteurs,
            ce qu'ils regardent, où ils cliquent, et ce qui déclenche une vente. Vous arrêtez de deviner.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              { icon: Users, t: "Audience en temps réel", d: "Qui visite, depuis où, sur quel appareil — en direct." },
              { icon: MousePointerClick, t: "Cartes de chaleur & parcours", d: "Visualisez chaque clic et chaque point de friction." },
              { icon: TrendingUp, t: "Conversions attribuées", d: "Sachez précisément quelle page génère du chiffre." },
            ].map((f) => (
              <li key={f.t} className="flex gap-4">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-[hsl(var(--primary-glow))]">
                  <f.icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-medium text-foreground">{f.t}</div>
                  <div className="text-sm text-muted-foreground">{f.d}</div>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-primary/15 blur-3xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] liquid-glass p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Revenu attribué · 30 j</div>
                  <div className="font-display text-3xl font-bold text-foreground">€ 48 920</div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400">
                  <ArrowUpRight className="h-3.5 w-3.5" /> +213%
                </span>
              </div>

              {/* animated bars */}
              <div className="mt-7 flex h-40 items-end gap-2.5">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0, opacity: 0.4 }}
                    whileInView={{ height: `${h}%`, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.06, ease: "easeOut" }}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-primary/40 to-[hsl(var(--primary-glow))]"
                  />
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { k: "Visiteurs", v: "12 480" },
                  { k: "Taux conv.", v: "6,8 %" },
                  { k: "Temps moyen", v: "3 m 12" },
                ].map((s) => (
                  <div key={s.k} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">{s.k}</div>
                    <div className="mt-1 font-display text-lg font-semibold text-foreground">{s.v}</div>
                  </div>
                ))}
              </div>

              <div className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[0.65rem] text-muted-foreground">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Live
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
