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
        <Approach />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
