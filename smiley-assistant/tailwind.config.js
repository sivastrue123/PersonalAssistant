/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FFD1DC',
          lavender: '#E6E6FA',
          blue: '#AEC6CF',
          green: '#77DD77',
          yellow: '#FDFD96',
          orange: '#FFB347',
        }
      },
      animation: {
        'heart-beat': 'heart-beat 1.5s infinite',
        'breathe': 'breathe 12s infinite ease-in-out',
      },
      keyframes: {
        'heart-beat': {
          '0%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.3)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.3)' },
          '70%': { transform: 'scale(1)' },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.5)' },
        }
      }
    },
  },
  plugins: [],
}
