/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tali: { bg: "#fdfaf6", card: "#ffffff", border: "#f0e8df", text: "#2c1f0f", muted: "#9c7c5c", accent: "#c8956c", accentLight: "#fdf3e7", green: "#4a9e6b" }
      },
      fontFamily: { sans: ["Inter", "system-ui", "-apple-system", "sans-serif"] },
      animation: { "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)", "fade-in": "fadeIn 0.3s ease-out" },
      keyframes: {
        slideUp: { "0%": { transform: "translateY(100%)" }, "100%": { transform: "translateY(0)" } },
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } }
      }
    },
  },
  plugins: [],
}
