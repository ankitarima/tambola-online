/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        diwali: {
          dark: '#0f051d',
          card: '#1a0d33',
          cardBorder: '#ffb703',
          gold: '#ffd166',
          goldDark: '#e59500',
          crimson: '#c1121f',
          deepMaroon: '#780000',
          orange: '#ff5400',
          saffron: '#ff7b00',
          diyaFlame: '#ffb703',
          purple: '#2b0938',
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'diya-flicker': 'diyaFlicker 1.8s ease-in-out infinite alternate',
        'pop-in': 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 25px rgba(255, 183, 3, 0.6), 0 0 50px rgba(255, 84, 0, 0.3)' },
          '50%': { boxShadow: '0 0 45px rgba(255, 209, 102, 0.9), 0 0 80px rgba(255, 84, 0, 0.5)' },
        },
        diyaFlicker: {
          '0%': { transform: 'scale(1) rotate(-1deg)', opacity: '0.9' },
          '100%': { transform: 'scale(1.08) rotate(1.5deg)', opacity: '1' },
        },
        popIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '70%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}

