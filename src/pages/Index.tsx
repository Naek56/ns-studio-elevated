import { useEffect, useState } from "react";
import IntroPuzzle from "@/components/site/IntroPuzzle";
import ScrollProgress from "@/components/site/ScrollProgress";
import SmoothScroll from "@/components/site/SmoothScroll";
import CursorFollower from "@/components/site/CursorFollower";
import ContactModal from "@/components/site/ContactModal";
import TopNav from "@/components/site/TopNav";
import Hero from "@/components/site/Hero";
import Narrative from "@/components/site/Narrative";
import Impact from "@/components/site/Impact";
import Way from "@/components/site/Way";
import KairosSection from "@/components/site/KairosSection";
import Contact from "@/components/site/Contact";
import { ScrollTrigger } from "@/lib/gsapSetup";

const Index = () => {
  // solve the puzzle once per session — coming back from a legal page skips it
  const [entered, setEntered] = useState(() => {
    try { return sessionStorage.getItem("way-entered") === "1"; } catch { return false; }
  });
  const enter = () => {
    try { sessionStorage.setItem("way-entered", "1"); } catch { /* noop */ }
    setEntered(true);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (!entered) {
      // lock the page fully while the intro puzzle is up (html + body)
      root.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      root.style.overflow = "";
      document.body.style.overflow = "";
      // pinned sections need a fresh measure once the page unlocks
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
    return () => {
      root.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [entered]);

  return (
    <div className="relative min-h-screen bg-black text-foreground">
      {!entered && <IntroPuzzle onComplete={enter} />}

      {entered && <SmoothScroll />}
      {entered && <ScrollProgress />}
      {entered && <CursorFollower />}

      {/* filmic grain over the whole site for a premium texture */}
      <div className="grain pointer-events-none fixed inset-0 z-[45] opacity-[0.05] mix-blend-soft-light" />

      <TopNav />
      <ContactModal />
      <main>
        <Hero play={entered} />
        <Narrative />
        <Impact />
        <Way />
        <KairosSection />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
