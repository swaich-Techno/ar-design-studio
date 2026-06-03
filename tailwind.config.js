/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b1020",
        surface: "#f7f8fb",
        brand: "#0f766e",
        accent: "#f97316"
      },
      boxShadow: {
        soft: "0 20px 70px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: []
};
