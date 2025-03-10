const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
      '-md':{max: '767px'},
      },
      colors: {
        customRed: "#B7152F",
      },
    },
  },
  plugins: [],
});
