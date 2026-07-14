import { useEffect } from "react";
import MemoryExperience from "@/components/experience/MemoryExperience";

/* Le site est une expérience : pas de navbar, pas de logo, curseur normal.
   (Le site complet de l'agence vit sur /agence — sauvegarde : backup/site-v1-bleu.) */
const Index = () => {
  useEffect(() => {
    // pas d'intro pixel ici : on libère tout de suite la bannière cookies
    window.dispatchEvent(new Event("way:revealed"));
    try { sessionStorage.setItem("way-revealed", "1"); } catch { /* noop */ }
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      <MemoryExperience />
    </div>
  );
};

export default Index;
