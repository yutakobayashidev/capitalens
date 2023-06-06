import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        screen: "100dvh",
      },
      borderRadius: {
        "4xl": "1.8rem",
      },
      colors: {
        primary: "#1E50B5",
        "black-rgba": "rgba(0, 0, 0, 0.2)",
      },
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
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
