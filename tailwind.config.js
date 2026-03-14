/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          950: '#0a0a0f',
          900: '#111118',
          800: '#1a1a24',
          700: '#252530',
        },
      },
    },
  },
  plugins: [],
}
