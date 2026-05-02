import { ArrowRight } from "lucide-react";

const BeforeAfter = () => {
  return (
    <section id="before-after" className="py-24 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-destructive/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm uppercase tracking-widest text-muted-foreground">La différence</span>
          <h2 className="text-4xl md:text-5xl font-semibold mt-3">Avant / Après</h2>
          <p className="text-muted-foreground mt-4">
            Voyez ce qu'un site moderne et bien conçu peut changer pour votre image.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-6 items-center">
          {/* AVANT */}
          <div className="group">
            <div className="text-center mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wider bg-destructive/10 text-destructive border border-destructive/20">
                Avant
              </span>
            </div>
            <div className="relative animate-fade-in" style={{ animation: "float 6s ease-in-out infinite" }}>
              {/* Ordinateur */}
              <div className="relative">
                {/* Écran */}
                <div className="rounded-t-xl bg-zinc-800 p-3 border-2 border-zinc-700 shadow-2xl">
                  <div className="rounded-md bg-[#d4c5a0] aspect-[4/3] overflow-hidden relative">
                    {/* Vieux site moche */}
                    <div className="absolute inset-0 p-3 font-serif text-[10px] md:text-xs text-black">
                      <div className="bg-red-600 text-yellow-300 text-center py-1 font-bold border-2 border-blue-700 mb-2 animate-pulse">
                        ★ BIENVENUE SUR MON SITE ★
                      </div>
                      <div className="text-blue-800 underline mb-2 overflow-hidden whitespace-nowrap">
                        <span className="inline-block" style={{ animation: "scroll-text 6s linear infinite" }}>
                          🔥 PROMO !!! CLIQUEZ ICI !!! 🔥 GRATUIT !!! 🔥 PROMO !!!
                        </span>
                      </div>
                      <div className="flex gap-1 mb-2">
                        <div className="bg-lime-400 px-1 border border-black">Accueil</div>
                        <div className="bg-pink-400 px-1 border border-black">Produit</div>
                        <div className="bg-cyan-400 px-1 border border-black">Contact</div>
                      </div>
                      <p className="text-purple-700 underline">Comic Sans Forever</p>
                      <div className="mt-1 bg-yellow-200 border border-red-500 p-1 text-[8px]">
                        <span className="text-red-600 font-bold">!!! </span>
                        Texte mal aligné partout
                        <span className="text-red-600 font-bold"> !!!</span>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-1">
                        <div className="bg-orange-500 h-3" />
                        <div className="bg-green-600 h-3" />
                        <div className="bg-fuchsia-500 h-3" />
                      </div>
                      <div className="absolute bottom-1 right-1 text-[7px] text-gray-600">
                        © 2003 - GeoCities
                      </div>
                    </div>
                  </div>
                </div>
                {/* Pied */}
                <div className="mx-auto w-1/4 h-3 bg-zinc-700 rounded-b-md" />
                <div className="mx-auto w-1/2 h-2 bg-zinc-800 rounded-full mt-1" />
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Lent, daté, peu crédible
            </p>
          </div>

          {/* Flèche */}
          <div className="flex justify-center">
            <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 animate-pulse">
              <ArrowRight className="w-8 h-8 text-primary" />
            </div>
            <div className="md:hidden flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/30 rotate-90">
              <ArrowRight className="w-6 h-6 text-primary" />
            </div>
          </div>

          {/* APRÈS */}
          <div className="group">
            <div className="text-center mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wider bg-primary/10 text-primary border border-primary/30">
                Après
              </span>
            </div>
            <div className="relative" style={{ animation: "float 6s ease-in-out infinite", animationDelay: "1.5s" }}>
              {/* Glow autour */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-primary/10 rounded-2xl blur-2xl opacity-70" />
              {/* Ordinateur moderne */}
              <div className="relative">
                <div className="rounded-xl bg-zinc-900 p-2 border border-zinc-700 shadow-2xl">
                  {/* Barre macOS */}
                  <div className="flex gap-1.5 px-2 py-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                  <div className="rounded-md bg-background aspect-[4/3] overflow-hidden relative border border-border">
                    {/* Site moderne */}
                    <div className="absolute inset-0 p-3 text-[10px] md:text-xs">
                      {/* Nav */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-primary/50" />
                        <div className="flex gap-2 text-muted-foreground text-[8px]">
                          <span>Home</span>
                          <span>Shop</span>
                          <span>About</span>
                        </div>
                        <div className="px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[8px]">
                          Buy
                        </div>
                      </div>
                      {/* Hero */}
                      <div className="space-y-1.5 mb-3">
                        <div className="h-2 w-3/4 bg-foreground/80 rounded" />
                        <div className="h-2 w-1/2 bg-foreground/60 rounded" />
                        <div className="h-1 w-2/3 bg-muted-foreground/40 rounded mt-1" />
                      </div>
                      {/* Cards */}
                      <div className="grid grid-cols-3 gap-1.5">
                        <div className="aspect-square rounded-md bg-gradient-to-br from-primary/20 to-primary/5 border border-border" />
                        <div className="aspect-square rounded-md bg-gradient-to-br from-primary/30 to-primary/10 border border-border" />
                        <div className="aspect-square rounded-md bg-gradient-to-br from-primary/15 to-primary/5 border border-border" />
                      </div>
                      {/* Curseur animé */}
                      <div
                        className="absolute w-2 h-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]"
                        style={{ animation: "cursor-move 4s ease-in-out infinite" }}
                      />
                    </div>
                  </div>
                </div>
                {/* Pied */}
                <div className="mx-auto w-1/4 h-3 bg-zinc-800 rounded-b-md" />
                <div className="mx-auto w-1/2 h-2 bg-zinc-900 rounded-full mt-1" />
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Rapide, élégant, qui inspire confiance
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes cursor-move {
          0% { top: 70%; left: 20%; }
          25% { top: 30%; left: 60%; }
          50% { top: 80%; left: 80%; }
          75% { top: 20%; left: 40%; }
          100% { top: 70%; left: 20%; }
        }
        @keyframes scroll-text {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </section>
  );
};

export default BeforeAfter;
