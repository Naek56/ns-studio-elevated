import { useState } from "react";
import ContactModal, { openContact } from "@/components/site/ContactModal";

/* Accueil — nouvelle direction : papier crème + encre chaude, et un grand
   panneau « ciel peint » monté avec les vrais visuels de WAY (le nuage à
   l'impasto). Le dégradé du panneau se termine sur la teinte exacte du
   papier : l'horizon fond dans la page. */

const NAV = [
  { label: "Réalisations", href: "#realisations" },
  { label: "Services", href: "#services" },
  { label: "Kairos", href: "#kairos" },
];

/* nuages : position et taille en % du panneau, pour rester justes à toutes
   les largeurs. Volontairement immobiles. */
const CLOUDS = [
  { top: "12%", left: "4%", w: "11%", o: 0.5, flip: false },
  { top: "26%", left: "17%", w: "8%", o: 0.38, flip: true },
  { top: "18%", left: "70%", w: "15%", o: 0.75, flip: true },
  { top: "44%", left: "8%", w: "18%", o: 0.9, flip: false },
  { top: "52%", left: "56%", w: "13%", o: 0.6, flip: true },
  { top: "62%", left: "30%", w: "10%", o: 0.45, flip: false },
  { top: "38%", left: "86%", w: "9%", o: 0.4, flip: false },
];

export default function Accueil() {
  const [email, setEmail] = useState("");

  return (
    <div className="wy min-h-screen" style={{ background: "#F2EDE3", color: "#16120E" }}>
      <ContactModal />

      {/* ── nav flottante ── */}
      <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <nav
          className="flex w-full max-w-[860px] items-center gap-1 rounded-full py-1.5 pl-4 pr-1.5"
          style={{ background: "#16120E", boxShadow: "0 8px 24px -12px rgba(22,18,14,0.5)" }}
        >
          <a href="#top" className="flex items-center gap-2 pr-3 text-[#F2EDE3]" aria-label="WAY, accueil">
            <svg viewBox="0 0 48 48" className="h-[22px] w-[22px]" fill="none" aria-hidden>
              <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="3" />
              <path d="M13 18 L18.75 31 L24 21 L29.25 31 L35 18" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[17px] font-semibold tracking-[-0.02em]">way</span>
          </a>

          <div className="ml-auto hidden items-center gap-1 sm:flex">
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="rounded-full px-3.5 py-2 text-[14px] text-[#F2EDE3]/70 transition-colors hover:text-[#F2EDE3]"
              >
                {n.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => openContact()}
            className="ml-auto shrink-0 rounded-full px-4 py-2 text-[14px] font-semibold transition-transform duration-200 hover:-translate-y-px sm:ml-1"
            style={{ background: "#F2EDE3", color: "#16120E" }}
          >
            Prendre rendez-vous
          </button>
        </nav>
      </header>

      <main id="top" className="mx-auto max-w-[1140px] px-4 pb-24 pt-[92px] sm:px-6 sm:pt-[104px]">
        {/* ── panneau ciel ── */}
        <section
          className="wy-sky relative overflow-hidden rounded-[18px]"
          style={{
            background:
              "linear-gradient(180deg,#0A3578 0%,#14539F 26%,#2E83C8 47%,#72B6E2 65%,#B6D9EC 79%,#DCDCCF 91%,#F2EDE3 100%)",
          }}
          aria-label="Un ciel peint : les nuages de WAY, à la peinture épaisse"
        >
          {/* soleil bas, chaud, derrière les nuages */}
          <div
            aria-hidden
            className="absolute"
            style={{
              left: "68%", top: "52%", width: "46%", aspectRatio: "1",
              transform: "translate(-50%,-50%)",
              background: "radial-gradient(circle, rgba(255,246,214,0.95) 0%, rgba(255,231,170,0.55) 22%, rgba(255,216,150,0.18) 42%, rgba(255,216,150,0) 68%)",
            }}
          />
          {CLOUDS.map((c, i) => (
            <img
              key={i}
              src="/nuage.png"
              alt=""
              aria-hidden
              className="absolute"
              style={{
                top: c.top, left: c.left, width: c.w, opacity: c.o,
                transform: c.flip ? "scaleX(-1)" : undefined,
              }}
            />
          ))}
          {/* grain : la texture papier du reste de la page, posée sur le ciel */}
          <div aria-hidden className="grain pointer-events-none absolute inset-0" style={{ opacity: 0.16, mixBlendMode: "overlay" }} />
        </section>

        {/* ── titre + accroche ── */}
        <section className="mt-10 grid gap-10 sm:mt-12 md:grid-cols-[1.25fr_0.75fr] md:gap-14">
          <div>
            <h1
              className="wy-display max-w-[13ch] text-[clamp(1.8rem,3.9vw,2.6rem)] font-bold leading-[1.08] tracking-[-0.035em] sm:max-w-none"
            >
              On ne livre pas des sites.
              <br />
              On construit des <span className="wy-italic">présences.</span>
            </h1>
            <p className="mt-6 max-w-[34ch] text-[15px] leading-relaxed" style={{ color: "rgba(22,18,14,0.6)" }}>
              Studio créatif à Strasbourg, au travail partout ailleurs.
            </p>
          </div>

          <div className="md:pt-6">
            <p className="max-w-[42ch] text-[15px] leading-relaxed" style={{ color: "rgba(22,18,14,0.72)" }}>
              Sites sur mesure, identités et expériences web. On s'occupe de la stratégie,
              du design et du code — du premier croquis à la mise en ligne.
            </p>

            <form
              onSubmit={(e) => { e.preventDefault(); openContact(); }}
              className="mt-6 flex items-center gap-1.5 rounded-full p-1.5"
              style={{ background: "#FFFDF8", boxShadow: "inset 0 0 0 1px rgba(22,18,14,0.1)" }}
            >
              <label htmlFor="wy-email" className="sr-only">Votre e-mail</label>
              <input
                id="wy-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre e-mail"
                className="min-w-0 flex-1 bg-transparent px-4 py-2 text-[15px] outline-none placeholder:text-[rgba(22,18,14,0.4)]"
                style={{ color: "#16120E" }}
              />
              <button
                type="submit"
                className="shrink-0 rounded-full px-5 py-2.5 text-[14px] font-semibold transition-transform duration-200 hover:-translate-y-px"
                style={{ background: "#16120E", color: "#F2EDE3" }}
              >
                Envoyer
              </button>
            </form>
            <p className="mt-2.5 pl-1 text-[13px]" style={{ color: "rgba(22,18,14,0.5)" }}>
              On répond sous 24 h.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
