import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:       ["'DM Sans'", "sans-serif"],
        cormorant:  ["'Cormorant Garamond'", "serif"],
      },
      colors: {
        blush:    { DEFAULT: "#e8a0b4", light: "#f5d0de", dark: "#8B4B5A" },
        cream:    { DEFAULT: "#fdf6f0", dark: "#f5e6dc" },
        beige:    "#e8d5c4",
        lavender: { DEFAULT: "#c9b8e8", light: "#e8e0f5" },
        brown:    { DEFAULT: "#5c3a2e", light: "#8a6355" },
        border:        "#f0d9d0",
        background:    "#fff9f6",
        foreground:    "#5c3a2e",
        primary:   { DEFAULT: "#8B4B5A", foreground: "#ffffff" },
        secondary: { DEFAULT: "#f5e6dc", foreground: "#5c3a2e" },
        muted:     { DEFAULT: "#fdf6f0", foreground: "#8a6355" },
        accent:    { DEFAULT: "#c9b8e8", foreground: "#5c3a2e" },
      },
      borderRadius: { lg: "1rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "2rem" },
      boxShadow: {
        soft:   "0 4px 24px rgba(139,75,90,0.08)",
        medium: "0 8px 40px rgba(139,75,90,0.15)",
        strong: "0 16px 60px rgba(139,75,90,0.2)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
