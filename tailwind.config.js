/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'surface-page': '#DDD0C8',   // beige page background
        'surface-column': '#D5C2AB', // Distinct, warm deeper beige column background
      },
    },
  },
  plugins: [],
};