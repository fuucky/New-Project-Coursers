/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
    theme: {
    extend: {
      colors: {
        primary: '#303030', // 
        secondary: '#4D4D4D', //  COLOQUEI CORES ALEATORIAS, POREM PUXADAS PARA O CINZA
        accent: '#999999', // 
        background: '#f9fafb', // 
        text: '#17171', // 
      },
    },
  },
  plugins: [],
}