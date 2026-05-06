import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "Sous combien de temps vais-je voir des résultats ?",
    a: "Dès la mise en ligne (2 à 6 semaines après le démarrage), votre site commence à convertir. Les premiers résultats SEO apparaissent en 4 à 8 semaines. Nos clients constatent en moyenne +180% de prospects dans les 3 premiers mois.",
  },
  {
    q: "Combien ça coûte vraiment ?",
    a: "Nos formules démarrent à 350€ pour un site vitrine et 750€ pour un site Pro multi-pages. Pas de frais cachés : devis transparent, hébergement et HTTPS inclus. Comparé à une agence classique (3 000–10 000€), vous économisez sans rien sacrifier sur la qualité.",
  },
  {
    q: "Suis-je engagé sur la durée ?",
    a: "Aucun engagement long. Vous payez le site une fois, puis un abonnement mensuel léger pour l'hébergement et les modifications illimitées. Vous pouvez arrêter quand vous voulez, le site reste à votre nom.",
  },
  {
    q: "Comment se passe l'onboarding ?",
    a: "1) Appel découverte de 15 min (gratuit). 2) Brief créatif et validation de la direction. 3) Conception et développement avec validations à chaque étape. 4) Mise en ligne et formation. C'est simple, rapide, transparent.",
  },
  {
    q: "Pourquoi vous plutôt qu'une autre agence ?",
    a: "Parce qu'on ne livre pas juste un site joli : on livre un site qui convertit. Performance < 2s, SEO intégré, design premium, et surtout : modifications sous 48h à vie. Vous n'avez plus jamais à toucher à rien.",
  },
  {
    q: "Et si je veux modifier mon site après livraison ?",
    a: "C'est nous qui nous occupons de tout. Vous nous envoyez votre demande, on l'applique en moins de 48h. Pas besoin de compétences techniques, pas de logiciel à apprendre.",
  },
  {
    q: "Mon site sera-t-il bien référencé sur Google ?",
    a: "Oui. SEO technique intégré dès le départ : structure sémantique, performance, balises optimisées, sitemap, mobile-first. Tous les fondamentaux pour bien se positionner.",
  },
  {
    q: "Puis-je vous faire confiance ?",
    a: "Contrat clair, devis détaillé, validations à chaque étape, site à votre nom. Aucun paiement engagé sans votre accord. Vous pouvez consulter nos réalisations et échanger avec nous lors d'un appel sans engagement avant de décider.",
  },
];

const Faq = () => {
  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">On répond à vos doutes</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gradient">
            Vous hésitez encore ?
          </h2>
          <p className="text-muted-foreground text-lg mt-4">
            Voici les réponses aux questions qu'on nous pose le plus souvent.
          </p>
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
