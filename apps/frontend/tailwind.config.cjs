/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        title: ["var(--font-title, 'Figtree Variable')"],
        body: ["var(--font-body, 'Inter Variable')"],
        mono: ["var(--font-mono, 'Google Sans Code Variable')"],
      },
    },
  },
}
