import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";

// Lenis inertia scrolling, driven by GSAP's ticker so ScrollTrigger and the
// smooth scroll share one clock (the standard Lenis+GSAP integration).
export default function SmoothScroll() {
  useEffect(() => {
    if (REDUCED) return;

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // layout settles after webfonts load
    const refresh = () => ScrollTrigger.refresh();
    (document as Document & { fonts?: FontFaceSet }).fonts?.ready.then(refresh).catch(() => {});

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      (window as unknown as { lenis?: Lenis }).lenis = undefined;
    };
  }, []);

  return null;
}
