import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#8B6FFF",
          deep: "#6B4FEF",
          light: "#B8A5FF",
          blue: "#A8C6FF",
          soft: "rgba(139,111,255,0.14)",
          softer: "rgba(139,111,255,0.28)",
        },
        bg: {
          page: "#0a0915",
          app: "#07061a",
          panel: "#120f24",
          card: "#1a1635",
        },
        line: {
          DEFAULT: "rgba(184,165,255,0.08)",
          strong: "rgba(184,165,255,0.18)",
        },
        ink: {
          DEFAULT: "#efedf8",
          dim: "#8b86a5",
          faint: "#4d4865",
        },
        positive: {
          DEFAULT: "#7DD987",
          soft: "rgba(125,217,135,0.12)",
        },
        warning: {
          DEFAULT: "#FFB366",
          soft: "rgba(255,179,102,0.12)",
        },
      },
      fontFamily: {
        serif: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Figtree"', "-apple-system", "sans-serif"],
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #A8C6FF 0%, #8B6FFF 50%, #6B4FEF 100%)",
      },
      boxShadow: {
        cta: "0 8px 24px -6px rgba(139,111,255,0.5)",
        orb: "0 0 60px rgba(139,111,255,0.5), 0 0 120px rgba(139,111,255,0.25), inset 0 -20px 40px rgba(75,47,207,0.5)",
      },
    },
  },
  plugins: [],
} satisfies Config;
