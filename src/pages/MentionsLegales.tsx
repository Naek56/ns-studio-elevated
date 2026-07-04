import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/site/Logo";
import Footer from "@/components/site/Footer";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-white/10 py-8">
      <h2 className="text-xs font-medium uppercase tracking-[0.28em] text-white/45">{title}</h2>
      <div className="mt-4 space-y-1 text-[15px] leading-relaxed text-white/80">{children}</div>
    </section>
  );
}

export default function MentionsLegales() {
  return (
    <div className="relative flex min-h-screen flex-col bg-black text-white">
      <header className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
        <Logo />
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au site
        </Link>
      </header>

      <main className="mx-auto w-full max-w-[760px] flex-1 px-6 pt-20 pb-24">
        <p className="label">Informations légales</p>
        <h1 className="display-xl mt-4 text-4xl font-semibold sm:text-5xl">Mentions légales.</h1>

        <div className="mt-14">
          <Block title="Éditeur du site">
            <p>WAY Agency</p>
            <p>Forme juridique — Micro-entreprise</p>
            <p>Représentant légal — Stéphanie Hirsch</p>
            <p>Adresse — 3 rue du Four Banal</p>
            <p>
              Email —{" "}
              <a href="mailto:contact@wayagency.fr" className="underline underline-offset-2 hover:text-white">
                contact@wayagency.fr
              </a>
            </p>
            <p>SIRET — En cours d'immatriculation</p>
            <p>Code APE — 6202A</p>
          </Block>

          <Block title="Hébergeur">
            <p>Vercel Inc</p>
            <p>440 N Barranca Ave 4133</p>
            <p>Covina CA 91723</p>
            <p>United States</p>
          </Block>

          <Block title="Directeur de la publication">
            <p>Stéphanie Hirsch</p>
          </Block>

          <Block title="Propriété intellectuelle">
            <p>
              L'ensemble du contenu de ce site (textes, visuels, animations, code) est la propriété exclusive de
              WAY Agency, sauf mention contraire. Toute reproduction, représentation ou diffusion, totale ou
              partielle, sans autorisation écrite préalable est interdite.
            </p>
          </Block>

          <Block title="Données personnelles">
            <p>
              Les traitements de données réalisés sur ce site sont détaillés dans notre{" "}
              <Link to="/confidentialite" className="underline underline-offset-2 hover:text-white">
                politique de confidentialité
              </Link>
              .
            </p>
          </Block>
        </div>
      </main>

      <Footer />
    </div>
  );
}
