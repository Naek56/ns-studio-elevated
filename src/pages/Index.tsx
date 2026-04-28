import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import Services from "@/components/site/Services";
import Process from "@/components/site/Process";
import Work from "@/components/site/Work";
import Booking from "@/components/site/Booking";
import Faq from "@/components/site/Faq";
import Footer from "@/components/site/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Process />
        <Work />
        <Booking />
        <Faq />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
