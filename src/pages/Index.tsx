import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Intro from "@/components/site/Intro";
import SmoothScroll from "@/components/site/SmoothScroll";
import Scene3D from "@/components/site/Scene3D";
import TopNav from "@/components/site/TopNav";
import Hero from "@/components/site/Hero";
import Manifesto from "@/components/site/Manifesto";
import Studio from "@/components/site/Studio";
import Kairos from "@/components/site/Kairos";
import Vision from "@/components/site/Vision";
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
    return () => {
      document.body.style.overflow = "";
    };
  }, [entered]);

  return (
    <div className="relative min-h-screen text-foreground">
      <AnimatePresence>{!entered && <Intro key="intro" onEnter={() => setEntered(true)} />}</AnimatePresence>

      {entered && <SmoothScroll />}
      <Scene3D />
      <TopNav show={entered} />

      <main className="relative z-10">
        <Hero />
        <Manifesto />
        <Studio />
        <Kairos />
        <Vision />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
