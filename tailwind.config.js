/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)"],
        notojp: ["var(--font-noto-sans-jp)"],
        sans: [
          "var(--font-inter)",
          "var(--font-noto-sans-jp)",
          ...fontFamily.sans,
        ],
      },
    },
  },
  plugins: [],
};
