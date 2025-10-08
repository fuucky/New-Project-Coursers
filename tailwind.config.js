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
        primary: '#1f2937', // gray-800
        secondary: '#374151', // gray-700
        accent: '#3b82f6', // blue-500
        background: '#f9fafb', // gray-50
        text: '#111827', // gray-900
      },
    },
  },
  plugins: [],
}