/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep agricultural green
        forest: {
          50: '#f0f7f0',
          100: '#dcecdc',
          200: '#bcd8bc',
          300: '#8fbb8f',
          400: '#5e9a5e',
          500: '#3d7b3d',
          600: '#2c6230',
          700: '#234e26',
          800: '#1d3e20',
          900: '#16331a',
          950: '#0c1f0e',
        },
        // Fresh agricultural green
        leaf: {
          50: '#f1f9ee',
          100: '#e0f1d6',
          200: '#c2e3ad',
          300: '#9bcd7c',
          400: '#76b04f',
          500: '#57932f',
          600: '#427521',
          700: '#345b1c',
          800: '#2b4918',
          900: '#243d16',
        },
        // Warm cream / off-white
        cream: {
          50: '#fdfbf6',
          100: '#faf5e9',
          200: '#f4e9cd',
          300: '#ecd9a8',
          400: '#e0c279',
          500: '#d4ab53',
        },
        // Orange for warnings/highlights
        saffron: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Neutral earth tones
        earth: {
          50: '#f8f7f4',
          100: '#f0eee8',
          200: '#e2dfd4',
          300: '#cdc8b8',
          400: '#b0a994',
          500: '#948d76',
          600: '#7a735f',
          700: '#625b4b',
          800: '#504a3d',
          900: '#3f3a31',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-up': 'fadeUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'progress-fill': 'progressFill 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseRing: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        },
      },
    },
  },
  plugins: [],
};
