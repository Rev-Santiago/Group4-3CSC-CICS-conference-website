module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customRed: {
          DEFAULT: "#B7152F",  // Base color
          light: "#D7263D",   // Lighter shade
          dark: "#920F26",    // Darker shade
        },
      },
    },
  },
  plugins: [],
};
