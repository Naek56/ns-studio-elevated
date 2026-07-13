import { useEffect } from "react";
import MemoryExperience from "@/components/experience/MemoryExperience";
import CursorFollower from "@/components/site/CursorFollower";

/* Le site est une expérience : pas de navbar, pas de logo, pas de scroll.
   (L'ancien site complet est conservé sur la branche backup/site-v1-bleu.) */
const Index = () => {
  useEffect(() => {
    // pas d'intro pixel ici : on libère tout de suite la bannière cookies
    window.dispatchEvent(new Event("way:revealed"));
    try { sessionStorage.setItem("way-revealed", "1"); } catch { /* noop */ }
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      <CursorFollower />
      <MemoryExperience />
    </div>
  );
};

export default Index;
