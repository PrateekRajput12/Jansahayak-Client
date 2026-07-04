/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 900: "#0a1628", 800: "#1a2d4f", 700: "#1a3c6e", 600: "#1e4d8c" },
        saffron: { 500: "#FF6B00", 400: "#ff8533", 300: "#ffaa66" },
      },
      fontFamily: { sans: ["Inter", "sans-serif"] },
    },
  },
  plugins: [],
};
