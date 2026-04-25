/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dryft: {
          dark: "#0a0a0a",
          darker: "#050505",
          beige: "#d1c7b7",
          cream: "#f5f5f5",
          accent: "#e5e5e5",
        }
      },
    },
  },
  plugins: [],
}
