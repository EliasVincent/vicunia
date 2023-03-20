module.exports = {
  content: [
    './renderer/pages/**/*.{js,ts,jsx,tsx}',
    './renderer/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#bd5add",
          "secondary": "#c914c6",
          "accent": "#6c97cc",
          "neutral": "#1A262D",
          "base-100": "#2D2843",
          "info": "#7996E6",
          "success": "#156140",
          "warning": "#F6CA46",
          "error": "#E8596C",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
