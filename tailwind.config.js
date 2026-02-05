/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,ts}",
    "./public/**/*.html"
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "twinkle": "twinkle 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 1.5s ease-in-out infinite",
        "fade-in-scale": "fade-in-scale 0.3s ease-out",
        "zoom-in": "zoom-in 0.25s ease-out",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 8px 2px rgba(255, 215, 0, 0.4)" },
          "50%": { boxShadow: "0 0 16px 4px rgba(255, 215, 0, 0.7)" },
        },
        "fade-in-scale": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "zoom-in": {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      backgroundImage: {
        "space-gradient": "linear-gradient(180deg, #0a0a0f 0%, #0f0f1a 30%, #1a1a2e 60%, #16213e 100%)",
      },
    },
  },
  plugins: [],
};
