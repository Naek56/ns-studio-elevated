import { Suspense, lazy } from "react";
import Reveal from "./Reveal";

const WireBuilding = lazy(() => import("@/components/three/WireBuilding"));

export default function Realisations() {
  return (
    <section id="realisations" className="relative overflow-hidden bg-black py-20 md:py-28">
      <div className="relative z-10 mx-auto max-w-[1300px] px-6 text-center md:px-12">
        <Reveal>
          <p className="label">L'immeuble WAY</p>
          <h2 className="display-xl mt-5 text-4xl font-semibold text-white sm:text-5xl md:text-6xl">
            Il y a de la lumière.
          </h2>
          <p className="mt-4 text-sm text-white/45">Cliquez sur les fenêtres illuminées.</p>
        </Reveal>
      </div>

      <div className="relative mt-6 md:mt-10">
        <Suspense fallback={<div className="h-[72vh] md:h-[80vh]" />}>
          <WireBuilding />
        </Suspense>
      </div>
    </section>
  );
}
