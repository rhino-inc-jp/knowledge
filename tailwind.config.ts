import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        noto: ["noto-sans", "sans-serif"],
        hel: ["helvetica-lt-pro", "sans-serif"],
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        in: "fade-in-up .8s ease-out both",
      },
    },
  },
  plugins: [
    // @ts-ignore
    function ({ addUtilities }) {
      addUtilities(
        {
          ".px-common-sp": {
            // 共通padding
            paddingLeft: "40px",
            paddingRight: "25px",
          },
          ".px-common-pc": {
            // 共通padding PC
            paddingLeft: "70px",
            paddingRight: "52px",
          },
          ".mx-common-sp": {
            // 共通margin
            marginLeft: "40px",
            marginRight: "25px",
          },
          ".mx-common-pc": {
            // 共通margin PC
            marginLeft: "70px",
            marginRight: "52px",
          },
        },
        ["responsive"]
      );
    },
  ],
};

export default config;
