export type ModuleColor = "orange" | "yellow" | "red";

export interface KairosModule {
  slug: string;
  title: string;
  tag: string;
  desc: string;
  color: ModuleColor;
  points: string[];
}

export const modules: KairosModule[] = [
  {
    slug: "marche",
    title: "Marché",
    tag: "Tendances",
    desc: "Les tendances et la demande de votre secteur, suivies en continu.",
    color: "orange",
    points: [
      "Les sujets qui montent dans votre secteur",
      "La demande réelle, mois après mois",
      "Les signaux faibles avant qu'ils deviennent évidents",
    ],
  },
  {
    slug: "concurrents",
    title: "Concurrents",
    tag: "Surveillance",
    desc: "Ce que vos concurrents lancent, changent et facturent.",
    color: "yellow",
    points: [
      "Leurs nouvelles offres et leurs prix",
      "Leurs changements de site et de discours",
      "Ce qui marche chez eux, repéré pour vous",
    ],
  },
  {
    slug: "clients",
    title: "Clients",
    tag: "Compréhension",
    desc: "Ce que vos visiteurs cherchent vraiment avant d'acheter.",
    color: "red",
    points: [
      "Les questions que se posent vos visiteurs",
      "Les freins qui les font partir",
      "Les mots qui les décident à acheter",
    ],
  },
  {
    slug: "reputation",
    title: "Réputation",
    tag: "Veille",
    desc: "Vos avis et votre image en ligne, surveillés jour et nuit.",
    color: "orange",
    points: [
      "Chaque nouvel avis, dès sa publication",
      "Le ton général autour de votre marque",
      "Une alerte quand quelque chose dérape",
    ],
  },
];

export const getModule = (slug?: string) => modules.find((m) => m.slug === slug);

export const colorVar: Record<ModuleColor, string> = {
  orange: "hsl(var(--primary))",
  yellow: "hsl(var(--yellow))",
  red: "hsl(var(--red))",
};
