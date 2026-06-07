import DoorIntro from "@/components/intro/DoorIntro";
import SiteBackground from "@/components/site/SiteBackground";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import Marquee from "@/components/site/Marquee";
import Approche from "@/components/site/Approche";
import Services from "@/components/site/Services";
import Intelligence from "@/components/site/Intelligence";
import Realisations from "@/components/site/Realisations";
import Process from "@/components/site/Process";
import FinalCta from "@/components/site/FinalCta";
import Footer from "@/components/site/Footer";

const Index = () => {
  return (
    <>
      {/* Immersive 3D door — scroll to step into the light */}
      <DoorIntro />

      {/* Homepage */}
      <div id="home" className="relative">
        <SiteBackground />
        <Navbar />
        <main>
          <Hero />
          <Marquee />
          <Approche />
          <Services />
          <Intelligence />
          <Realisations />
          <Process />
          <FinalCta />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
