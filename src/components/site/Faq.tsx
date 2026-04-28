import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "Combien de temps prend la création d'un site ?",
    a: "En général entre 2 et 6 semaines selon la complexité. Nous établissons un planning précis dès le premier appel.",
  },
  {
    q: "Quel est le tarif pour un site ?",
    a: "Chaque projet est unique. Le tarif dépend du périmètre, du design et des fonctionnalités. Nous établissons un devis sur-mesure après notre premier échange.",
  },
  {
    q: "Puis-je modifier mon site après la livraison ?",
    a: "Oui, c'est nous qui nous occupons directement de toutes les modifications. Vous nous envoyez votre demande et elle est appliquée en moins de 48h, sans que vous ayez à toucher à quoi que ce soit.",
  },
  {
    q: "Mon site sera-t-il optimisé pour le SEO ?",
    a: "Oui. Tous nos sites sont conçus avec les bonnes pratiques SEO : structure sémantique, performance, balises optimisées et mobile-first.",
  },
  {
    q: "L'hébergement est-il inclus ?",
    a: "Oui, l'hébergement est inclus dans le service. Après le paiement initial du site, un abonnement mensuel couvre l'hébergement, la maintenance et les modifications à la demande.",
  },
];

const Faq = () => {
  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">FAQ</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gradient">
            Questions fréquentes
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="glass rounded-2xl border-border/60 px-6 data-[state=open]:border-primary/40 transition-colors"
            >
              <AccordionTrigger className="text-left font-display font-semibold hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default Faq;
