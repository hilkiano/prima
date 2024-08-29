import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");

const config: Config = {
  corePlugins: {
    preflight: false,
  },
  darkMode: ["class", '[data-mantine-color-scheme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "36em",
      sm: "48em",
      md: "64em",
      lg: "74em",
      xl: "90em",
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-outfit)", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
export default config;
