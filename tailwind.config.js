const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      screens: {
        "-md": { max: "767px" },
      },
      colors: {
        customRed: "#B7152F",
        customDarkRed: "#8A0F22",
        customBlue: "#1D4ED8",
        customDarkBlue: "#1E3A8A",
        lightGray: '#eeeeee',
      },
      fontFamily: {
        sans: ['"Open Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
});
