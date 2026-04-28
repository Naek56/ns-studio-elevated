const projects = [
  { name: "Lumière Studio", category: "Photographie", color: "from-purple-500/20 to-pink-500/20" },
  { name: "Atlas Conseil", category: "Cabinet", color: "from-blue-500/20 to-purple-500/20" },
  { name: "Maison Verte", category: "Restaurant", color: "from-emerald-500/20 to-purple-500/20" },
  { name: "Forge & Co.", category: "Artisanat", color: "from-amber-500/20 to-purple-500/20" },
];

const Work = () => {
  return (
    <section id="work" className="relative py-24 md:py-32">
      <div className="container max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Réalisations</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gradient">
              Des projets qui parlent
            </h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-md">
            Une sélection de sites créés pour des clients exigeants.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, idx) => (
            <div
              key={project.name}
              className="group relative aspect-[4/3] rounded-3xl overflow-hidden glass cursor-pointer"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-60 group-hover:opacity-90 transition-opacity duration-700`} />
              <div className="absolute inset-0 grid-pattern opacity-30" />

              {/* Floating decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-primary/20 blur-3xl group-hover:scale-150 transition-transform duration-1000" />

              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{project.category}</span>
                  <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:bg-primary group-hover:rotate-45 transition-all duration-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-display text-3xl md:text-4xl font-bold transition-transform duration-500 group-hover:translate-x-2">
                  {project.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 overflow-hidden border-y border-border/50 py-6">
          <div className="flex gap-16 animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-16 items-center text-2xl md:text-3xl font-display font-semibold text-muted-foreground/50">
                <span>Performance</span>
                <span className="text-primary">●</span>
                <span>Design</span>
                <span className="text-primary">●</span>
                <span>Sur-mesure</span>
                <span className="text-primary">●</span>
                <span>SEO</span>
                <span className="text-primary">●</span>
                <span>Rapidité</span>
                <span className="text-primary">●</span>
                <span>Élégance</span>
                <span className="text-primary">●</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Work;
