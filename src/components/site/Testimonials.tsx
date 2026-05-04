import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Camille Laurent",
    role: "Fondatrice, Atelier Mira",
    text: "Site élégant, rapide, et nos demandes de devis ont doublé en deux mois.",
  },
  {
    name: "Julien Moreau",
    role: "Gérant, Moreau & Fils",
    text: "Process clair, livraison dans les délais. Ils s'occupent de tout, même après le lancement.",
  },
  {
    name: "Sarah Benali",
    role: "Coach indépendante",
    text: "Un site magnifique, et chaque modification est appliquée en moins de 48h.",
  },
  {
    name: "Antoine Rivière",
    role: "Restaurant Le Comptoir",
    text: "Rendu moderne, mobile parfait. Excellent rapport qualité/prix.",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 relative">
      <div className="container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm uppercase tracking-widest text-muted-foreground">Avis</span>
          <h2 className="text-3xl md:text-4xl font-semibold mt-3">Ce que disent nos clients</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {testimonials.map((t) => (
            <article
              key={t.name}
              className="rounded-xl border border-border/60 bg-card/30 p-6 hover:border-primary/40 transition-colors"
            >
              <div className="flex mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/90 leading-relaxed mb-4">"{t.text}"</p>
              <div className="text-sm">
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
