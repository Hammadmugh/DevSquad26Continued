import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        spartan: ['var(--font-league-spartan)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
