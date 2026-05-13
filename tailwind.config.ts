import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display:  ['var(--font-bebas)', 'sans-serif'],
        terminal: ['var(--font-vt323)', 'monospace'],
        mono:     ['var(--font-share-tech)', 'monospace'],
        body:     ['var(--font-rajdhani)', 'sans-serif'],
      },
      colors: {
        bg:      '#060605',
        surface: '#0d0d0b',
        green: {
          DEFAULT: '#39ff14',
          dim:     '#1c6b09',
          mid:     '#4ade80',
        },
        red: {
          DEFAULT: '#7a0c1b',
          bright:  '#c41a2e',
        },
        amber: {
          DEFAULT: '#c8a832',
          bright:  '#e8c040',
        },
        silver: '#b0aca4',
      },
      letterSpacing: {
        game: '0.18em',
        wide: '0.12em',
        code: '0.28em',
      },
    },
  },
  plugins: [],
};

export default config;
