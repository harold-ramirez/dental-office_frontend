/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        whiteBlue: '#D6E8EE',
        lightBlue: '#97CADB',
        pureBlue: '#018ABE',
        darkBlue: '#02457A',
        blackBlue: '#001B48'
      }
    },
  },
  plugins: [],
};