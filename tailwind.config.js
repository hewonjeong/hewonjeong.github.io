const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/templates/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Helvetica', ...defaultTheme.fontFamily.sans],
        montserrat: 'Montserrat',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
