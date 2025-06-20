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
          '.px-common-sp': {
            paddingLeft: '10.5%',
            paddingRight: '7%',
          },
          '.px-common-pc': {
            paddingLeft: '5%',
            paddingRight: '5%',
          },
        },
        ['responsive']
      );
    },
  ],
};

export default config;
