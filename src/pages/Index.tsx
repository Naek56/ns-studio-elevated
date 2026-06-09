import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BlackHoleIntro from "@/components/intro/BlackHoleIntro";
import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import Probleme from "@/components/site/Probleme";
import ChiffreChoc from "@/components/site/ChiffreChoc";
import Modules from "@/components/site/Modules";
import CeQueKairosFait from "@/components/site/CeQueKairosFait";
import Frequence from "@/components/site/Frequence";
import Plans from "@/components/site/Plans";
import PromesseFinale from "@/components/site/PromesseFinale";
import Footer from "@/components/site/Footer";

const Index = () => {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = introDone ? "" : "hidden";
    if (!introDone) window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = "";
    };
  }, [introDone]);

  return (
    <>
      <AnimatePresence>
        {!introDone && <BlackHoleIntro key="intro" onEnter={() => setIntroDone(true)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="min-h-screen bg-background text-foreground"
      >
        <Header />
        <main>
          <Hero />
          <Probleme />
          <ChiffreChoc />
          <Modules />
          <CeQueKairosFait />
          <Frequence />
          <Plans />
          <PromesseFinale />
        </main>
        <Footer />
      </motion.div>
    </>
  );
};

export default Index;
