import Scene3D from "@/components/site/Scene3D";
import SmoothScroll from "@/components/site/SmoothScroll";
import BottomNav from "@/components/site/BottomNav";
import Hero from "@/components/site/Hero";
import Manifesto from "@/components/site/Manifesto";
import Studio from "@/components/site/Studio";
import Kairos from "@/components/site/Kairos";
import Vision from "@/components/site/Vision";
import Contact from "@/components/site/Contact";

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <SmoothScroll />
      <Scene3D />
      <main className="relative z-10">
        <Hero />
        <Manifesto />
        <Studio />
        <Kairos />
        <Vision />
        <Contact />
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;
