import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", 
    "!./node_modules/**/*" // Explicitly ignore node_modules
  ],
  theme: {
    extend: {
      screens: {
        "-md": { max: "767px" },
      },
      colors: {
        customRed: "#B7152F",
      },
    },
  },
  plugins: [],
});
