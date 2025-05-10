/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00739d',
          dark: '#034e6a',
          light: '#1eb7df',
        },
        accent: {
          yellow: '#ffc000',
          green: '#26d1a0',
        },
        content: {
          dark: '#000000',
          light: '#ffffff',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #034e6a 0%, #1eb7df 100%)',
      },
    },
  },
  plugins: [],
};