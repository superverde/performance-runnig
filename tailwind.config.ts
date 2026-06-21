import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#00C896',
          blue: '#0066FF',
          dark: '#0A0A0A',
          gray: '#111111',
          muted: '#1A1A1A',
          border: '#222222',
          text: '#A0A0A0',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        display: ['var(--font-display)', 'Impact', 'Arial Narrow', 'sans-serif'],
      },
      typography: {
        invert: {
          css: {
            '--tw-prose-body': '#d4d4d4',
            '--tw-prose-headings': '#ffffff',
            '--tw-prose-links': '#00C896',
            '--tw-prose-bold': '#ffffff',
            '--tw-prose-code': '#00C896',
            '--tw-prose-pre-bg': '#111111',
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
