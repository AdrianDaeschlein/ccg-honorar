/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'cbs-blue': '#4967AA',
        'cbs-white': '#FFFFFF',
        'cbs-black': '#000000',
        'cbs-middle-blue': '#6793D6',
        'cbs-red': '#E66A57',
        'cbs-green': '#50A192',
        'cbs-dark-blue': '#242E70',
        'cbs-chestnut': '#6B1C26',
        'cbs-dark-green': '#114739',
        'cbs-light-blue': '#C9E0F5',
        'cbs-peach': "#F0D3C5",
        'cbs-light-green': '#C9E7D7',
      },
      fontFamily: {
        'cbs-new-bold': ['CbsNewBold', 'sans-serif'],
        'cbs-new-regular': ['CbsNewRegular', 'sans-serif'],
        'cbs-sans-bold': ['CbsSansBold', 'sans-serif'],
        'cbs-sans-bold-italic': ['CbsSansBoldItalic', 'sans-serif'],
        'cbs-sans-italic': ['CbsSansItalic', 'sans-serif'],
        'cbs-sans-regular': ['CbsSansRegular', 'sans-serif'],
        'cbs-serif-bold': ['CbsSerifBold', 'serif'],
        'cbs-serif-bold-italic': ['CbsSerifBoldItalic', 'serif'],
        'cbs-serif-italic': ['CbsSerifItalic', 'serif'],
        'cbs-serif-regular': ['CbsSerifRegular', 'serif'],
      }
    },
  },
  plugins: [],
}

