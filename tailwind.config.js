// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./**/*.html",
    "./assets/js/**/*.js"
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-18px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        floatSlow: 'float 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
