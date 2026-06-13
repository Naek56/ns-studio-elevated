import SmoothScroll from "@/components/site/SmoothScroll";
import TopNav from "@/components/site/TopNav";
import Hero from "@/components/site/Hero";
import Manifesto from "@/components/site/Manifesto";
import Studio from "@/components/site/Studio";
import Kairos from "@/components/site/Kairos";
import Vision from "@/components/site/Vision";
import Contact from "@/components/site/Contact";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <SmoothScroll />
      <TopNav />
      <main>
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
