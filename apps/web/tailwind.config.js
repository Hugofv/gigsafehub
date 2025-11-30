/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Azul Principal (Navy) - #1D3A6F - Texto, Headers, Fundo do Escudo
        navy: {
          DEFAULT: '#1D3A6F',
          50: '#e8edf5',
          100: '#d1dceb',
          200: '#a3b9d7',
          300: '#7596c3',
          400: '#4773af',
          500: '#1D3A6F', // Principal
          600: '#172e59',
          700: '#112243',
          800: '#0b172d',
          900: '#050b17',
        },
        // Ciano/Teal (Marca) - #3498DB - Links, Ícones, CTAs Secundários
        teal: {
          DEFAULT: '#3498DB',
          50: '#e6f4fb',
          100: '#cce9f7',
          200: '#99d3ef',
          300: '#66bde7',
          400: '#33a7df',
          500: '#3498DB', // Principal
          600: '#2a7aaf',
          700: '#1f5c83',
          800: '#153e57',
          900: '#0a202b',
        },
        // Dourado/Ocre (Acento) - #F3C96C - Destaque do Escudo, Linhas de Divisão
        gold: {
          DEFAULT: '#F3C96C',
          50: '#fef9f0',
          100: '#fdf3e1',
          200: '#fbe7c3',
          300: '#f9dba5',
          400: '#f5cf87',
          500: '#F3C96C', // Principal
          600: '#c2a156',
          700: '#917940',
          800: '#61512a',
          900: '#302815',
        },
        // Laranja (Contraste) - #F2994A - CTAs Primários
        orange: {
          DEFAULT: '#F2994A',
          50: '#fef5ef',
          100: '#fdebd9',
          200: '#fbd7b3',
          300: '#f9c38d',
          400: '#f5af67',
          500: '#F2994A', // Principal
          600: '#c27a3b',
          700: '#915b2c',
          800: '#613d1e',
          900: '#301e0f',
        },
        // Mantendo brand para compatibilidade (mapeando para navy)
        brand: {
          50: '#e8edf5',
          100: '#d1dceb',
          200: '#a3b9d7',
          300: '#7596c3',
          400: '#4773af',
          500: '#1D3A6F',
          600: '#1D3A6F', // Navy principal
          700: '#172e59',
          800: '#112243',
          900: '#0c1a2e',
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'fade-in-up': 'fade-in-up 0.8s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

