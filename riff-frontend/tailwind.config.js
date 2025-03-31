/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'arial': ['Arial', 'Helvetica', 'sans-serif'],
      },
      colors: {
        isabelline: '#F2EFEEff',
        coffee: '#634C38ff',
        timberwolf: '#E6DFD8ff',
        coyote: '#75593Eff',
        'timberwolf-2': '#D7CEC4ff',
      },
      perspective: {
        '1200': '1200px',
      },
      transitionTimingFunction: {
        'out': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      translate: {
        'z-50': 'translateZ(50px)',
        'z-30': 'translateZ(30px)',
        '-z-30': 'translateZ(-30px)',
        '-z-50': 'translateZ(-50px)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-30px)' },
        }
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 5s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};