/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Fondo noche profundo
        night: {
          950: '#0B0414',
          900: '#12071F', // Principal
          800: '#1B0B30', // Secundario
          700: '#2A1148', // Tarjetas y superficies
          600: '#3D1B63',
          500: '#522584',
        },
        // Púrpura galaxia
        galaxy: {
          dark: '#3B0764',
          DEFAULT: '#5B21B6',
          light: '#7C3AED',
          glow: '#8B5CF6',
        },
        // Magenta / rosa nebulosa
        nebula: {
          deep: '#9333EA',
          magenta: '#C026D3',
          pink: '#E0559F',
          light: '#F472B6',
          soft: '#FBCFE8',
        },
        // Dorado metálico
        gold: {
          dark: '#9A6F00',
          base: '#D4A017',
          DEFAULT: '#F2C14E',
          light: '#FFE08A',
          shimmer: '#FFF4D0',
        },
        // Texto
        text: {
          primary: '#F8F1FF',
          secondary: '#C9B8E0',
          muted: '#8D7B9F',
          dark: '#12071F',
        },
        // Estados
        status: {
          success: '#34D399',
          error: '#F8F1FF',
          warning: '#FBBF24',
          info: '#60A5FA',
        },
        // Paleta Boutique Editorial (Secciones claras cálidas)
        boutique: {
          cream: '#FBF6F0',
          'cream-light': '#FDFAF6',
          'cream-dark': '#F3ECE3',
          rose: '#F8F0F5',
          'rose-light': '#FDF7FA',
          'rose-border': '#EBDCE6',
          ink: '#1A0D26',
          'ink-muted': '#685B78',
        }
      },
      fontFamily: {
        script: ['"Great Vibes"', 'cursive'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'gold-metallic': 'linear-gradient(135deg, #FFE08A 0%, #F2C14E 40%, #D4A017 75%, #9A6F00 100%)',
        'gold-metallic-hover': 'linear-gradient(135deg, #FFF4D0 0%, #FFE08A 35%, #F2C14E 70%, #D4A017 100%)',
        'gold-border': 'linear-gradient(135deg, rgba(242, 193, 78, 0.6) 0%, rgba(212, 160, 23, 0.2) 50%, rgba(192, 38, 211, 0.3) 100%)',
        'galaxy-radial': 'radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.25) 0%, rgba(18, 7, 31, 0) 70%)',
        'nebula-glow': 'radial-gradient(circle at 80% 20%, rgba(192, 38, 211, 0.2) 0%, transparent 50%)',
        'card-gradient': 'linear-gradient(180deg, rgba(42, 17, 72, 0.85) 0%, rgba(27, 11, 48, 0.95) 100%)',
      },
      boxShadow: {
        'gold-sm': '0 0 10px rgba(242, 193, 78, 0.25)',
        'gold-md': '0 0 20px rgba(242, 193, 78, 0.35)',
        'gold-lg': '0 0 35px rgba(242, 193, 78, 0.45)',
        'nebula-sm': '0 0 15px rgba(192, 38, 211, 0.3)',
        'galaxy-card': '0 10px 30px -10px rgba(18, 7, 31, 0.8), 0 0 1px 1px rgba(242, 193, 78, 0.15)',
        'galaxy-card-hover': '0 15px 35px -5px rgba(91, 33, 182, 0.4), 0 0 15px rgba(242, 193, 78, 0.3)',
      },
      animation: {
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: 0.2, transform: 'scale(0.8)' },
          '50%': { opacity: 0.9, transform: 'scale(1.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
};
