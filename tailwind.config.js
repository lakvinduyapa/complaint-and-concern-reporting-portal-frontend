/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          50: '#f3f9ff',
          100: '#e5f1ff',
          200: '#c6def8',
          300: '#9dc4ee',
          400: '#67a0dc',
          500: '#2a75c4',
          600: '#1f5ea8',
          700: '#174b86',
          800: '#143e6d',
          900: '#102f52',
        },
        green: {
          50: '#f3fcf5',
          100: '#e5f9ea',
          200: '#c5efcf',
          300: '#95e0a9',
          400: '#64cf82',
          500: '#3ac25a',
          600: '#31a64d',
          700: '#288640',
          800: '#216d34',
          900: '#1a5529',
        },
      },
    },
  },
  plugins: [],
}