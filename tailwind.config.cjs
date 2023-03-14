/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/Pages/**/*.{jsx,js,tsx,ts}",
    "./src/Pages/Signup.jsx",
  ],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          "0%": { top: "-50px" },
          "100%": { top: "16px" },
        },
      },
      animation: {
        slideIn: "slideIn 0.5s ease-in-out forwards alternate",
      },
      colors: {
        Logo: "hsl(var(--Logo) / <alpha-value>)",
        BtnBg: "hsl(var(--BtnBg) / <alpha-value>)",
        BodyBg: "hsl(var(--BodyBg) / <alpha-value>)",
        Txt: "hsl(var(--Txt) / <alpha-value>)",
        borders: "hsl(var(--borders) / <alpha-value>)",
        grayishBtn: "hsl(var(--GrayishBtn) / <alpha-value>)",
        success: "hsl(var(--Success) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
