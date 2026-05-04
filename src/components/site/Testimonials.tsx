import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Camille Laurent",
    role: "Fondatrice, Atelier Mira",
    initials: "CL",
    rating: 5,
    text: "NS Studio a transformé notre image en ligne. Le site est élégant, rapide, et nos demandes de devis ont doublé en deux mois. Une équipe vraiment à l'écoute.",
  },
  {
    name: "Julien Moreau",
    role: "Gérant, Moreau & Fils",
    initials: "JM",
    rating: 5,
    text: "Process clair, livraison dans les délais et zéro stress. Ils s'occupent de tout, même après le lancement. Je recommande sans hésiter.",
  },
  {
    name: "Sarah Benali",
    role: "Coach indépendante",
    initials: "SB",
    rating: 5,
    text: "Je voulais un site qui me ressemble, sans perdre des semaines à m'en occuper. Résultat : un site magnifique, et chaque modification est appliquée en moins de 48h.",
  },
  {
    name: "Antoine Rivière",
    role: "Restaurant Le Comptoir",
    initials: "AR",
    rating: 5,
    text: "Un vrai bond en avant. Le rendu est moderne, mobile parfait, et les clients nous font régulièrement des compliments sur le site. Excellent rapport qualité/prix.",
  },
  {
    name: "Léa Dumont",
    role: "Architecte d'intérieur",
    initials: "LD",
    rating: 5,
    text: "Au-delà du design, c'est l'accompagnement qui m'a marqué. Réactifs, pédagogues, et toujours force de proposition. Une collaboration que je renouvellerai.",
  },
  {
    name: "Marc Lefèvre",
    role: "CEO, Lefèvre Conseil",
    initials: "ML",
    rating: 5,
    text: "Sérieux, professionnels et créatifs. Notre site reflète enfin la qualité de nos services. Le suivi post-lancement fait toute la différence.",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      </div>
      {/* Soft edges */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent z-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent z-0" />

      <div className="container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm uppercase tracking-widest text-muted-foreground">Témoignages</span>
          <h2 className="text-4xl md:text-5xl font-semibold mt-3">Ce que disent nos clients</h2>
          <p className="text-muted-foreground mt-4">
            Des entrepreneurs et entreprises qui nous ont fait confiance pour transformer leur présence en ligne.
          </p>

          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">5,0</span> · Basé sur les retours clients
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <article
              key={t.name}
              className="group relative rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-6 hover:border-primary/40 hover:bg-card/60 transition-all duration-500 hover:-translate-y-1"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20 group-hover:text-primary/40 transition-colors" />

              <div className="flex mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-foreground/90 leading-relaxed mb-6">"{t.text}"</p>

              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center text-sm font-medium text-foreground">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
