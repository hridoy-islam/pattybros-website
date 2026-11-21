import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

// Brand: the logo's gold on warm ivory, espresso ink. Change a colour here and it updates everywhere.
const config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      // side margins: 24px on phones, 48px on tablets, 120px on large screens (content 1200px wide at 1440)
      padding: { DEFAULT: "1.5rem", md: "3rem", xl: "7.5rem" },
      screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1440px" },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#c8a048", // logo gold: buttons, accents
          hover: "#b98f3a",
          dark: "#7d5a1e", // deep gold: small text, focus rings
          foreground: "#1b150f", // text on gold
        },
        ink: "#1b150f", // text and the espresso footer
        ivory: "#fbf8f3", // page background
        cream: "#f4ede2", // panels
        muted: "#5c5349", // secondary text
        line: "#e4dccf", // hairlines
        espresso: { DEFAULT: "#1b150f", soft: "#2a231b", muted: "#b9afa2" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-text)", "system-ui", "sans-serif"],
      },
      maxWidth: { prose: "62ch" },
      keyframes: {
        "fade-up": { "0%": { opacity: "0", transform: "translateY(14px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
      },
      animation: {
        "fade-up": "fade-up .8s cubic-bezier(.22,1,.36,1) both",
        "fade-in": "fade-in 1.1s ease both",
        "spin-slow": "spin-slow 30s linear infinite",
      },
    },
  },
  plugins: [animate], // open and close animations for the shadcn Select (admin)
} satisfies Config;

export default config;
