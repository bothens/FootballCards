const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: colors.emerald[500],
          hover: colors.emerald[400],
          focus: colors.emerald[600],
        },
        surface: {
          100: colors.zinc[100],
          200: colors.zinc[200],
          300: colors.zinc[300],
          900: colors.zinc[900],
        },
        text: {
          DEFAULT: colors.zinc[900],
          light: colors.white,
          muted: colors.zinc[500],
          inverted: colors.white,
        },
        border: {
          DEFAULT: colors.zinc[300],
          focus: colors.emerald[500],
        },
        danger: {
          DEFAULT: colors.red[500],
          hover: colors.red[400],
        },
      },
      fontSize: {
        'label': '10px',
      },
      borderRadius: {
        'ui-xs': '0.25rem', // 4px
        'ui-sm': '0.5rem',  // 8px
        'ui-md': '0.75rem', // 12px
        'ui-lg': '1rem',    // 16px
      }
    },
  },
  plugins: [],
}
