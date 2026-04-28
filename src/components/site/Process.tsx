const steps = [
  {
    num: "01",
    title: "Découverte",
    description: "On échange sur votre projet, vos objectifs et votre vision. Sans engagement.",
  },
  {
    num: "02",
    title: "Conception",
    description: "Maquettes haute-fidélité, choix de la direction artistique, validation ensemble.",
  },
  {
    num: "03",
    title: "Développement",
    description: "Construction du site avec les meilleures technologies. Suivi en temps réel.",
  },
  {
    num: "04",
    title: "Lancement",
    description: "Mise en ligne, formation, et accompagnement post-lancement pour assurer le succès.",
  },
];

const Process = () => {
  return (
    <section id="process" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />

      <div className="container relative z-10 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Process</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Une méthode éprouvée
          </h2>
          <p className="text-muted-foreground text-lg">
            Un process clair, transparent et efficace.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div key={step.num} className="relative group">
              <div className="relative p-7 rounded-2xl glass h-full hover:border-primary/40 transition-all duration-500">
                <div className="font-display text-5xl font-bold text-gradient-primary mb-4 opacity-80">
                  {step.num}
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-primary/50 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
