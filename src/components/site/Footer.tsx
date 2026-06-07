import Logo from "./Logo";

export default function Footer() {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="relative border-t border-border/60 px-6 py-14">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Agence de création de sites web haut de gamme et pilotés par la data.
            Le design qui séduit, la donnée qui décide.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Navigation</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {[
              { l: "Approche", id: "approche" },
              { l: "Services", id: "services" },
              { l: "Intelligence", id: "intelligence" },
              { l: "Réalisations", id: "realisations" },
            ].map((i) => (
              <li key={i.id}>
                <button onClick={() => go(i.id)} className="transition-colors hover:text-foreground">{i.l}</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Contact</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><a href="mailto:hello@nsintelligence.com" className="transition-colors hover:text-foreground">hello@nsintelligence.com</a></li>
            <li><button onClick={() => go("contact")} className="transition-colors hover:text-foreground">Démarrer un projet</button></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
        <span>© {new Date().getFullYear()} NS Intelligence (NSI). Tous droits réservés.</span>
        <span>Conçu &amp; mesuré avec soin.</span>
      </div>
    </footer>
  );
}
