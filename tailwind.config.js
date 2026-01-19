/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
