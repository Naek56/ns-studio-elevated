import SmoothScroll from "@/components/site/SmoothScroll";
import TopNav from "@/components/site/TopNav";
import Hero from "@/components/site/Hero";
import Approach from "@/components/site/Approach";
import Contact from "@/components/site/Contact";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-black text-foreground">
      <SmoothScroll />
      <TopNav />
      <main>
        <Hero />
        {/* smooth gradient from the black hero into the white section */}
        <div className="h-32 w-full bg-gradient-to-b from-black to-white sm:h-44" />
        <Approach />
        {/* gradient back from white into the black contact section */}
        <div className="h-32 w-full bg-gradient-to-b from-white to-black sm:h-44" />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
