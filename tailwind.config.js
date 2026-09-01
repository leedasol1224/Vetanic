/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--color-brand-50, #f2f7f4)',
          100: 'var(--color-brand-100, #e1ede6)',
          200: 'var(--color-brand-200, #c4dcce)',
          300: 'var(--color-brand-300, #9bc2af)',
          400: 'var(--color-brand-400, #6fa38d)',
          500: 'var(--color-brand-500, #4c856e)',
          600: 'var(--color-brand-600, #386a56)',
          700: 'var(--color-brand-700, #2c5344)',
          800: 'var(--color-brand-800, #224136)',
          900: 'var(--color-brand-900, #1b352c)',
          950: 'var(--color-brand-950, #0f1f1a)',
        },
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e4',
          200: '#c7d0c9',
          300: '#a3b2a7',
          400: '#7e9284',
          500: '#64776a',
          600: '#4e5e53',
          700: '#404c44',
          800: '#363e38',
          900: '#2e3530',
        },
        ivory: {
          DEFAULT: 'var(--color-bg-ivory, #FAF8F5)',
          warm: '#F5EFE6',
          light: '#FCFBF9',
          card: '#FFFFFF',
          border: '#E8E2D9',
        },
        charcoal: {
          DEFAULT: 'var(--color-text-charcoal, #212529)',
          muted: '#5A626A',
          light: '#8C95A0',
        }
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Noto Sans KR',
          'sans-serif'
        ],
        serif: [
          'Playfair Display',
          'Georgia',
          'serif'
        ],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'soft-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
