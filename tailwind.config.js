const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/templates/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Helvetica', ...defaultTheme.fontFamily.sans],
        montserrat: 'Montserrat',
      },
      boxShadow: {
        highlight: 'inset 0 -.5em 0 0 black',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'inherit',
            '--tw-prose-headings': 'inherit',
            '--tw-prose-lead': 'inherit',
            '--tw-prose-links': 'inherit',
            '--tw-prose-bold': 'inherit',
            '--tw-prose-counters': 'inherit',
            '--tw-prose-bullets': 'inherit',
            '--tw-prose-hr': 'inherit',
            '--tw-prose-quotes': 'inherit',
            '--tw-prose-quote-borders': 'inherit',
            '--tw-prose-captions': 'inherit',
            '--tw-prose-counters': 'inherit',
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
