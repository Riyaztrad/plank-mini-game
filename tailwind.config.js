/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Fonts are being loaded on `src/pages/_document.tsx`, so if you want to
      // change the font, you need to change the url there and name here.
      fontFamily: {
        inter: 'Inter',
        sans: ['var(--font-roboto)'],
        mono: ['var(--font-roboto-mono)'],
        tacticSans: 'Tactic Sans',
        gumdrop: 'Gumdrop',
      },
      colors: {
        'telegram-white': 'var(--telegram-bg-color)',
        'telegram-black': 'var(--telegram-text-color)',
        'telegram-hint': 'var(--telegram-hint-color)',
        'telegram-link': 'var(--telegram-link-color)',
        'telegram-primary': 'var(--telegram-button-color)',
        'telegram-primary-text': 'var(--telegram-button-text-color)',
        'telegram-secondary-white': 'var(--telegram-secondary-bg-color)',
        primary: {
          DEFAULT: '#00EDFF',
        },
        secondary: {
          DEFAULT: '#3FFECF',
        },
        danger: {
          DEFAULT: '#FF4F6A',
        },
        warning: {
          DEFAULT: '#FFF500',
        },
        appBlue: {
          DEFAULT: '#286EF0',
        },
        appPurple: {
          DEFAULT: '#8028F0',
        },
        appGreen: {
          DEFAULT: '#61E694',
        },
        appOrange: {
          DEFAULT: '#EB8F67',
        },
        appSky: {
          DEFAULT: '#28F0F0',
        },
        appPink: {
          DEFAULT: '#C828F0',
        },
      },
    },
  },
  plugins: [],
};
