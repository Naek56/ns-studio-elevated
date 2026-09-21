import { cn } from "@/lib/utils";

/* Fond en dégradé radial : une source claire posée quelque part dans le cadre,
   qui s'éteint vers une teinte sombre sur les bords.

   Les props sont typées plutôt que laissées implicites : le tsconfig du projet
   a `noImplicitAny: false`, donc des props non annotées compileraient en `any`
   sans rien signaler — et ce composant est exactement le genre de brique qu'on
   réutilise avec des valeurs inventées six mois plus tard. */
export interface BgGradientProps {
  className?: string;
  /** la couleur du cœur — ce que l'on voit au point de départ */
  gradientFrom?: string;
  /** la couleur des bords, atteinte à 100 % du rayon */
  gradientTo?: string;
  /** rayons horizontal et vertical, en % de la boîte : « 125% 125% » */
  gradientSize?: string;
  /** le centre du dégradé dans la boîte : « 50% 10% » */
  gradientPosition?: string;
  /** jusqu'où la couleur du cœur tient avant de commencer à virer */
  gradientStop?: string;
}

export const Component = ({
  className,
  gradientFrom = "#fff",
  gradientTo = "#63e",
  gradientSize = "125% 125%",
  gradientPosition = "50% 10%",
  gradientStop = "40%",
}: BgGradientProps) => {
  return (
    <div
      className={cn("absolute inset-0 -z-10 h-full w-full bg-white", className)}
      style={{
        background: `radial-gradient(${gradientSize} at ${gradientPosition}, ${gradientFrom} ${gradientStop}, ${gradientTo} 100%)`,
      }}
    />
  );
};

export default Component;
