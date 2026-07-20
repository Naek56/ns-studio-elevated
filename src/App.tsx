import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CookieBanner from "@/components/site/CookieBanner";
import Index from "./pages/Index.tsx";
import Agence from "./pages/Agence.tsx";
import MentionsLegales from "./pages/MentionsLegales.tsx";
import Confidentialite from "./pages/Confidentialite.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/* Pas de bannière cookies sur l'expérience (désormais route "/experience").
   Elle s'affiche sur l'accueil agence ("/") et les pages légales. */
function CookieGate() {
  const { pathname } = useLocation();
  if (pathname === "/experience") return null;
  return <CookieBanner />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* La 1re partie (l'expérience, <Index/>) a été retirée du parcours :
             l'accueil ouvre directement le site agence. L'expérience reste
             sauvegardée et accessible sur /experience (+ branche backup/experience-full). */}
          <Route path="/" element={<Agence />} />
          <Route path="/agence" element={<Agence />} />
          <Route path="/experience" element={<Index />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* bannière consentement : sur toutes les pages SAUF l'expérience */}
        <CookieGate />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
