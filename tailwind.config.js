/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b1020",
        surface: "#f7f8fb",
        brand: "#0f766e",
        accent: "#f97316",
        background: "var(--bg)",
        foreground: "var(--fg)",
        muted: "var(--muted)"
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: [
          "var(--font-mono, ui-monospace)",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace"
        ]
      },
      boxShadow: {
        soft: "0 20px 70px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: []
};
