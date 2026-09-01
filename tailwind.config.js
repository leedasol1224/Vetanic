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
          50: 'var(--color-brand-50, #FBF2F2)',
          100: 'var(--color-brand-100, #F6E3E4)',
          200: 'var(--color-brand-200, #ECC7C9)',
          300: 'var(--color-brand-300, #DE9FA2)',
          400: 'var(--color-brand-400, #CC6F74)',
          500: 'var(--color-brand-500, #B5454B)',
          600: 'var(--color-brand-600, #9E2328)',
          700: 'var(--color-brand-700, #841C21)',
          800: 'var(--color-brand-800, #6C161A)',
          900: 'var(--color-brand-900, #551215)',
          950: 'var(--color-brand-950, #330709)',
        },
        sage: {
          50: 'var(--color-sage-50, #F6F8F4)',
          100: 'var(--color-sage-100, #EBF0E7)',
          200: 'var(--color-sage-200, #D6E0CE)',
          300: 'var(--color-sage-300, #BED0B3)',
          400: 'var(--color-sage-400, #A8B89A)',
          500: 'var(--color-sage-500, #8D9F7F)',
          600: 'var(--color-sage-600, #718264)',
          700: 'var(--color-sage-700, #57654C)',
          800: 'var(--color-sage-800, #414C39)',
          900: 'var(--color-sage-900, #2E3628)',
        },
        ivory: {
          DEFAULT: 'var(--color-bg-main, #FAF7F2)',
          warm: 'var(--color-bg-main, #FAF7F2)',
          light: '#FCFAF7',
          card: '#FFFFFF',
          border: 'var(--color-border-main, #DED7CE)',
        },
        beige: {
          DEFAULT: 'var(--color-bg-secondary, #E9E0D4)',
          50: '#FAF7F2',
          100: '#F4EFE7',
          200: '#E9E0D4',
          300: '#D8CBBA',
          400: '#C4B39D',
          500: '#AF9B83',
        },
        charcoal: {
          DEFAULT: 'var(--color-text-main, #222222)',
          muted: 'var(--color-text-muted, #6F6A65)',
          light: '#958E87',
        }
      },
      fontFamily: {
        heading: [
          'Manrope',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
        serif: [
          'Manrope',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif'
        ],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(34, 34, 34, 0.05), 0 4px 6px -2px rgba(34, 34, 34, 0.02)',
        'soft-lg': '0 10px 25px -3px rgba(34, 34, 34, 0.06), 0 4px 6px -2px rgba(34, 34, 34, 0.03)',
        'card': '0 1px 3px 0 rgba(34, 34, 34, 0.04), 0 1px 2px 0 rgba(34, 34, 34, 0.02)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
