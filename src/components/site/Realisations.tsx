import { Suspense, lazy } from "react";
import Reveal from "./Reveal";
import WordReveal from "./WordReveal";

const OrbScene = lazy(() => import("@/components/three/OrbScene"));

export default function Realisations() {
  return (
    <section id="realisations" className="relative overflow-hidden bg-black py-20 md:py-28">
      <div className="relative z-10 mx-auto max-w-[1300px] px-6 text-center md:px-12">
        <Reveal>
          <p className="label">Le système</p>
        </Reveal>
        <WordReveal
          text="Tout gravite autour de Kairos."
          className="display-xl mt-5 text-4xl font-semibold text-white sm:text-5xl md:text-6xl"
        />
        <Reveal delay={0.3}>
          <p className="mt-4 text-sm text-white/45">Survolez, puis cliquez sur chaque point.</p>
        </Reveal>
      </div>

      <div className="relative mt-4 md:mt-8">
        <Suspense fallback={<div className="h-[64vh] md:h-[76vh]" />}>
          <OrbScene />
        </Suspense>
      </div>
    </section>
  );
}
