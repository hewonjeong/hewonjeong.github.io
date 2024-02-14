import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./{app,public}/**/*.{js,ts,jsx,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {},
    },
  },
  plugins: [],
}
export default config
