/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'homebase-dark': '#0f172a',
        'homebase-darker': '#020617',
        'homebase-blue': '#3b82f6',
        'homebase-light-blue': '#60a5fa',
      },
    },
  },
  plugins: [],
}
