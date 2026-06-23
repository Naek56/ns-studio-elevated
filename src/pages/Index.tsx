import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import IntroPuzzle from "@/components/site/IntroPuzzle";
import SmoothScroll from "@/components/site/SmoothScroll";
import TopNav from "@/components/site/TopNav";
import Hero from "@/components/site/Hero";
import Approach from "@/components/site/Approach";
import StoryScroll from "@/components/site/StoryScroll";
import Realisations from "@/components/site/Realisations";
import Contact from "@/components/site/Contact";

const Index = () => {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!entered) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [entered]);

  return (
    <div className="relative min-h-screen bg-black text-foreground">
      <AnimatePresence>
        {!entered && <IntroPuzzle key="intro" onComplete={() => setEntered(true)} />}
      </AnimatePresence>

      {entered && <SmoothScroll />}
      <TopNav />
      <main>
        <Hero />
        {/* clean, compact fade from the black hero into the white section */}
        <div className="h-16 w-full bg-gradient-to-b from-black to-white sm:h-20" />
        <Approach />
        {/* fade back from white into the black storytelling section */}
        <div className="h-16 w-full bg-gradient-to-b from-white to-black sm:h-20" />
        <StoryScroll />
        <Realisations />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
