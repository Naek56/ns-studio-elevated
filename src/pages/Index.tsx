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
  return (
    <div className="min-h-screen bg-background text-foreground">
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
    </div>
  );
};

export default Index;
