import { Suspense, lazy } from "react";
import Reveal from "./Reveal";

const Constellation = lazy(() => import("@/components/three/Constellation"));

export default function Realisations() {
  return (
    <section id="realisations" className="relative overflow-hidden bg-black py-20 md:py-28">
      <div className="relative z-10 mx-auto max-w-[1300px] px-6 text-center md:px-12">
        <Reveal>
          <p className="label">Le système</p>
          <h2 className="display-xl mt-5 text-4xl font-semibold text-white sm:text-5xl md:text-6xl">
            Une constellation d'intelligences.
          </h2>
          <p className="mt-4 text-sm text-white/45">Survolez, puis cliquez sur chaque point.</p>
        </Reveal>
      </div>

      <div className="relative mt-6 md:mt-10">
        <Suspense fallback={<div className="h-[70vh] md:h-[78vh]" />}>
          <Constellation />
        </Suspense>
      </div>
    </section>
  );
}
