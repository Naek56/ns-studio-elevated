import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import Problems from "@/components/site/Problems";
import Services from "@/components/site/Services";
import BeforeAfter from "@/components/site/BeforeAfter";
import Process from "@/components/site/Process";
import Pricing from "@/components/site/Pricing";
import Booking from "@/components/site/Booking";
import Testimonials from "@/components/site/Testimonials";
import Faq from "@/components/site/Faq";
import FinalCta from "@/components/site/FinalCta";
import Footer from "@/components/site/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Problems />
        <Services />
        <BeforeAfter />
        <Testimonials />
        <Process />
        <Pricing />
        <Faq />
        <Booking />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
