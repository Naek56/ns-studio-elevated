import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Camille Laurent",
    role: "Coach business",
    text: "Mes demandes de devis ont doublé en 2 mois. Le site est élégant, rapide, et je n'ai plus à toucher à rien.",
    metric: "+120% de leads",
  },
  {
    name: "Julien Moreau",
    role: "Restaurant — Lyon",
    text: "Process clair, livraison dans les délais. Les réservations en ligne ont explosé dès le premier mois.",
    metric: "+85% de réservations",
  },
  {
    name: "Sarah Benali",
    role: "Architecte d'intérieur",
    text: "Un site magnifique qui inspire confiance. Chaque modification est appliquée en moins de 48h, c'est confortable.",
    metric: "+3 projets / mois",
  },
  {
    name: "Antoine Rivière",
    role: "Artisan",
    text: "Rendu moderne, mobile parfait. J'ai récupéré mon investissement en moins de 3 mois.",
    metric: "ROI < 90 jours",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 relative">
      <div className="container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm uppercase tracking-widest text-muted-foreground">Résultats clients</span>
          <h2 className="text-3xl md:text-4xl font-semibold mt-3">Ils ont fait le pas. Vous ?</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {testimonials.map((t) => (
            <article
              key={t.name}
              className="rounded-xl border border-border/60 bg-card/30 p-6 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-primary px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
                  {t.metric}
                </span>
              </div>
              <p className="text-foreground/90 leading-relaxed mb-4">"{t.text}"</p>
              <div className="text-sm font-medium">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.role}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
