/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f02d34',
        'dark-blue': '#324d67',
        'light-gray': '#ebebeb',
        'medium-gray': '#dcdcdc',
        'text-gray': '#5f5f5f',
        'qty-green': 'rgb(49, 168, 49)',
      },
      animation: {
        marquee: 'marquee 15s linear infinite',
        'marquee-mobile': 'marquee 10s linear infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      screens: {
        'max-800': { max: '800px' },
      },
    },
  },
  plugins: [],
}

