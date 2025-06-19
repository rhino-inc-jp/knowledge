// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // @ts-ignore
    function ({ addUtilities }) {
      addUtilities(
        {
          '.px-common-5p': {
            paddingLeft: '5%',
            paddingRight: '5%',
          },
          '.px-common-8p': {
            paddingLeft: '7%',
            paddingRight: '7%',
          },
        },
        ['responsive']
      );
    },
  ],
};

export default config;
