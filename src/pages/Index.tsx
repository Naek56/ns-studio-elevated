import SmoothScroll from "@/components/site/SmoothScroll";
import TopNav from "@/components/site/TopNav";
import Hero from "@/components/site/Hero";
import Approach from "@/components/site/Approach";
import StoryScroll from "@/components/site/StoryScroll";
import Contact from "@/components/site/Contact";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-black text-foreground">
      <SmoothScroll />
      <TopNav />
      <main>
        <Hero />
        {/* clean, compact fade from the black hero into the white section */}
        <div className="h-16 w-full bg-gradient-to-b from-black to-white sm:h-20" />
        <Approach />
        {/* fade back from white into the black storytelling section */}
        <div className="h-16 w-full bg-gradient-to-b from-white to-black sm:h-20" />
        <StoryScroll />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
