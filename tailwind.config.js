/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
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
        },
        gray: {
          850: "#1a1d29",
          950: "#0a0c14"
        }
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
      },
      scale: {
        '102': '1.02',
      }
    }
  },
  plugins: []
} 