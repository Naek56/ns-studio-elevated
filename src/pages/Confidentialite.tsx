import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/site/Logo";
import Footer from "@/components/site/Footer";
import { openCookieBanner } from "@/lib/consent";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-white/10 py-8">
      <h2 className="text-xs font-medium uppercase tracking-[0.28em] text-white/45">{title}</h2>
      <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-white/80">{children}</div>
    </section>
  );
}

export default function Confidentialite() {
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
        <p className="label">Vos données</p>
        <h1 className="display-xl mt-4 text-4xl font-semibold sm:text-5xl">
          Politique de confidentialité.
        </h1>

        <div className="mt-14">
          <Block title="Données collectées">
            <p>
              Nous collectons les comportements de navigation des visiteurs via le système Kairos — clics,
              scrolls, pages visitées et durée de visite.
            </p>
            <p>
              Si vous remplissez le formulaire de contact, nous collectons également vos données de contact —
              nom et email uniquement.
            </p>
          </Block>

          <Block title="Finalité du traitement">
            <p>
              Ces données servent à l'amélioration de l'expérience utilisateur et à l'optimisation du site pour
              nos clients.
            </p>
          </Block>

          <Block title="Base légale">
            <p>
              Le traitement repose sur le consentement de l'utilisateur, recueilli via la bannière cookies
              affichée lors de la première visite. Vous pouvez{" "}
              <button onClick={openCookieBanner} className="underline underline-offset-2 hover:text-white">
                modifier votre choix à tout moment
              </button>
              .
            </p>
          </Block>

          <Block title="Durée de conservation">
            <p>Les données sont conservées 12 mois maximum, puis supprimées.</p>
          </Block>

          <Block title="Destinataires">
            <p>WAY Agency uniquement. Aucune transmission à des tiers.</p>
          </Block>

          <Block title="Vos droits">
            <p>
              Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et
              d'opposition sur vos données personnelles.
            </p>
            <p>
              Pour exercer ces droits, contactez-nous à{" "}
              <a href="mailto:contact@wayagency.fr" className="underline underline-offset-2 hover:text-white">
                contact@wayagency.fr
              </a>
              . Nous vous répondons sous 30 jours maximum.
            </p>
          </Block>

          <Block title="Autorité de contrôle">
            <p>
              Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la CNIL — 3 place de
              Fontenoy, 75007 Paris —{" "}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-white"
              >
                cnil.fr
              </a>
              .
            </p>
          </Block>
        </div>
      </main>

      <Footer />
    </div>
  );
}
