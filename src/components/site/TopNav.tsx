import { useEffect, useRef } from "react";
import Logo from "./Logo";
import { openContact } from "./ContactModal";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsapSetup";

/* Fixed nav with backdrop blur — shrinks slightly once the story starts. */
export default function TopNav() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || REDUCED) return;
    const inner = el.querySelector(".nav-inner");
    const st = ScrollTrigger.create({
      start: 80,
      onEnter: () => {
        gsap.to(el, { paddingTop: 10, paddingBottom: 10, duration: 0.45, ease: "power2.out" });
        gsap.to(inner, { scale: 0.92, duration: 0.45, ease: "power2.out" });
        el.classList.add("nav-scrolled");
      },
      onLeaveBack: () => {
        gsap.to(el, { paddingTop: 24, paddingBottom: 12, duration: 0.45, ease: "power2.out" });
        gsap.to(inner, { scale: 1, duration: 0.45, ease: "power2.out" });
        el.classList.remove("nav-scrolled");
      },
    });
    return () => st.kill();
  }, []);

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 top-0 z-50 px-6 transition-colors duration-500 sm:px-10 [&.nav-scrolled]:bg-black/45 [&.nav-scrolled]:backdrop-blur-md"
      style={{ paddingTop: 24, paddingBottom: 12 }}
    >
      <div className="nav-inner mx-auto flex max-w-[1600px] origin-top items-center justify-between will-change-transform">
        <Logo />
        <button onClick={openContact} className="btn-glass px-7 py-3 text-sm font-medium tracking-wide">
          Contact
        </button>
      </div>
    </header>
  );
}
