/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        blush: '#EFA9AE',
        mauve: '#D7A9B7',
        champagne: '#F3E9DC',
        pearl: '#FEFEFE',
        charcoal: '#2F2F2F',
        gold: '#D4AF37',
        'blush-light': '#F7D7DA',
        'champagne-light': '#F9F1E6',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Cormorant Garamond', 'serif'],
        'sans': ['Inter', 'Lato', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card': '0 2px 16px rgba(0, 0, 0, 0.06)',
        'elegant': '0 8px 32px rgba(239, 169, 174, 0.15)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
