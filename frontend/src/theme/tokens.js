/**
 * Sistema de Diseño - Sweet Home & Boutique CR
 * Tokens extraídos del logo y la identidad de marca
 */

export const tokens = {
  colors: {
    night: {
      900: '#12071F', // Fondo principal
      800: '#1B0B30', // Fondo secundario
      700: '#2A1148', // Tarjetas / superficies
      600: '#3D1B63',
    },
    galaxy: {
      base: '#5B21B6',
      light: '#7C3AED',
      dark: '#3B0764',
    },
    nebula: {
      magenta: '#C026D3',
      pink: '#E0559F',
      light: '#F472B6',
    },
    gold: {
      dark: '#9A6F00',
      base: '#D4A017',
      bright: '#F2C14E',
      light: '#FFE08A',
      shimmer: '#FFF4D0',
    },
    text: {
      primary: '#F8F1FF',
      secondary: '#C9B8E0',
      muted: '#8D7B9F',
      dark: '#12071F',
    },
    status: {
      success: '#34D399',
      error: '#F87171',
      warning: '#FBBF24',
      info: '#60A5FA',
    }
  },
  typography: {
    script: '"Great Vibes", cursive',
    serif: '"Cormorant Garamond", Georgia, serif',
    sans: '"Inter", -apple-system, sans-serif',
  },
  gradients: {
    goldMetallic: 'linear-gradient(135deg, #FFE08A 0%, #F2C14E 40%, #D4A017 75%, #9A6F00 100%)',
    goldHover: 'linear-gradient(135deg, #FFF4D0 0%, #FFE08A 35%, #F2C14E 70%, #D4A017 100%)',
    galaxyRadial: 'radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.25) 0%, rgba(18, 7, 31, 0) 70%)',
    cardGradient: 'linear-gradient(180deg, rgba(42, 17, 72, 0.85) 0%, rgba(27, 11, 48, 0.95) 100%)',
  },
  brand: {
    name: 'Sweet Home & Boutique CR',
    slogan: 'Donde cada detalle ilumina tu hogar y tu estilo.',
    footerSlogan: 'Variedad, calidad y amor en cada detalle. Para ti, para tu hogar, para cada momento especial.',
  }
};
