/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 950: "#040d1a", 900: "#071224", 800: "#0c1c38", 700: "#102448", 600: "#1a3a6e" },
        saffron: { 500: "#FF6B00", 400: "#ff8533", 300: "#ffaa66" },
        accent: { 500: "#3b82f6", 400: "#60a5fa", 300: "#93c5fd" },
      },
      fontFamily: { sans: ["Inter", "sans-serif"] },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)",
      },
      backgroundSize: { "grid-pattern": "40px 40px" },
    },
  },
  plugins: [],
};
