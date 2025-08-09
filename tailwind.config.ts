import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#0B132B',
          800: '#1C2541',
          700: '#3A506B',
          600: '#5BC0BE',
          500: '#6FFFE9'
        }
      }
    }
  },
  plugins: []
};

export default config;

