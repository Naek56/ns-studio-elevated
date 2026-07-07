import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        kairos: {
          bg: "#0A0A0A",
          panel: "#0F0F0F",
          surface: "#141414",
          elevated: "#1A1A1A",
          border: "#262626",
          accent: "#FF6B2B",
          "accent-dim": "#C9531F",
          text: "#E8E6E0",
          muted: "#8A877E",
          green: "#3FB950",
          red: "#F05D5D",
        },
      },
      fontFamily: {
        mono: ['"DM Mono"', "ui-monospace", "monospace"],
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease forwards",
        "pulse-dot": "pulse-dot 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
