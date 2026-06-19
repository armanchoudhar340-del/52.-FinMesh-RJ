/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandDark: "#030712",
        brandDarker: "#090d16",
        brandCard: "rgba(17, 24, 39, 0.45)",
        brandBorder: "rgba(255, 255, 255, 0.08)",
        brandGlow: "rgba(99, 102, 241, 0.15)",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
