import { useEffect, useState } from "react";
import PixelIntro from "@/components/site/PixelIntro";
import PaperBackground from "@/components/site/PaperBackground";
import PaperNav from "@/components/site/PaperNav";
import SmoothScroll from "@/components/site/SmoothScroll";
import CursorFollower from "@/components/site/CursorFollower";
import ContactModal from "@/components/site/ContactModal";
import AwarenessHero from "@/components/site/AwarenessHero";
import EyesSection from "@/components/site/EyesSection";
import KairosIntro from "@/components/site/KairosIntro";
import HorizontalStory from "@/components/site/HorizontalStory";
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
    }
    return () => { root.style.overflow = ""; document.body.style.overflow = ""; };
  }, [revealed]);

  return (
    <div className="relative min-h-screen text-neutral-900">
      <PaperBackground />
      {!revealed && <PixelIntro onDone={done} />}

      {revealed && <SmoothScroll />}
      {revealed && <CursorFollower />}

      <PaperNav />
      <ContactModal />

      <main>
        <AwarenessHero play={revealed} />
        <EyesSection />
        <KairosIntro />
        <HorizontalStory />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
