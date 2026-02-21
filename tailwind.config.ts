import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#22d3ee',
          muted: '#67e8f9',
          deep: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'sans-serif'],
        display: ['var(--font-sora)', 'sans-serif'],
      },
    },
  },
};

export default config;
