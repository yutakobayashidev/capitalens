import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      borderRadius: {
        "4xl": "1.8rem",
      },
      colors: {
        "black-rgba": "rgba(0, 0, 0, 0.2)",
        primary: "#1E50B5",
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
      height: {
        screen: "100dvh",
      },
    },
  },
} satisfies Config;
