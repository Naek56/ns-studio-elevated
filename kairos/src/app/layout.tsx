import type { Metadata } from "next";
import { DM_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kairos — WAY Agency",
  description: "Le système IA de WAY Agency.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${dmMono.variable} ${cormorant.variable}`}>
      <body className="bg-kairos-bg text-kairos-text antialiased">{children}</body>
    </html>
  );
}
