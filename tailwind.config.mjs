/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#40cab7',
          50: '#ebfaf8',
          100: '#d7f4f0',
          200: '#b3e9e2',
          300: '#83d9ce',
          400: '#40cab7',
          500: '#2ab3a0',
          600: '#1f8f81',
          700: '#1d726a',
          800: '#1b5b55',
          900: '#1a4b47',
        },
        secondary: {
          DEFAULT: '#1a5eb9',
          50: '#f0f4fc',
          100: '#dde7f7',
          200: '#c2d4f2',
          300: '#96b8e8',
          400: '#6494dc',
          500: '#1a5eb9',
          600: '#1452a3',
          700: '#144086',
          800: '#153670',
          900: '#162f5d',
        },
      },
    },
  },
  plugins: [],
}

export default config
