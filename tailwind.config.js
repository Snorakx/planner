/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4338CA",
        secondary: "#9333EA",
        accent: "#EC4899",
        background: "#F3F4F6",
        surface: "#FFFFFF",
        error: "#EF4444",
        success: "#10B981",
        warning: "#F59E0B",
        text: {
          primary: "#111827",
          secondary: "#4B5563",
          disabled: "#9CA3AF"
        }
      }
    }
  },
  plugins: []
} 