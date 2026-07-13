import { useEffect, useState } from "react";
import PixelIntro from "@/components/site/PixelIntro";
import PaperBackground from "@/components/site/PaperBackground";
import PaperNav from "@/components/site/PaperNav";
import SmoothScroll from "@/components/site/SmoothScroll";
import CursorFollower from "@/components/site/CursorFollower";
import ContactModal from "@/components/site/ContactModal";
import Hero from "@/components/site/Hero";
import AwarenessHero from "@/components/site/AwarenessHero";
import ReviewsSection from "@/components/site/ReviewsSection";
import InvisibleSection from "@/components/site/InvisibleSection";
import AgencySection from "@/components/site/AgencySection";
import KairosSection from "@/components/site/KairosSection";
import Contact from "@/components/site/Contact";
import { ScrollTrigger } from "@/lib/gsapSetup";

const Index = () => {
  // the pixel intro plays once per session
  const [revealed, setRevealed] = useState(() => {
    try { return sessionStorage.getItem("way-revealed") === "1"; } catch { return false; }
  });
  const done = () => {
    try { sessionStorage.setItem("way-revealed", "1"); } catch { /* noop */ }
    setRevealed(true);
  };

  // lock scroll during the intro; refresh triggers once revealed
  useEffect(() => {
    const root = document.documentElement;
    if (!revealed) {
      root.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      root.style.overflow = "";
      document.body.style.overflow = "";
      requestAnimationFrame(() => ScrollTrigger.refresh());
      // signale la fin de l'intro pixel → la bannière cookies peut s'afficher
      window.dispatchEvent(new Event("way:revealed"));
    }
    return () => { root.style.overflow = ""; document.body.style.overflow = ""; };
  }, [revealed]);

  return (
    <div className="relative min-h-screen text-neutral-900">
      <PaperBackground />
      {/* grain papier global (par-dessus la photo, sous le contenu) */}
      <div aria-hidden className="grain pointer-events-none fixed inset-0 -z-[5] opacity-[0.12] mix-blend-overlay" />
      {!revealed && <PixelIntro onDone={done} />}

      {revealed && <SmoothScroll />}
      {revealed && <CursorFollower />}

      <PaperNav />
      <ContactModal />

      <main>
        <Hero play={revealed} />
        <AwarenessHero />
        <ReviewsSection />
        <InvisibleSection />
        <AgencySection />
        <KairosSection />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
