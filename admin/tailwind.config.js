/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        light: "var(--Light)",
        lightBrown: "var(--LightBrown)",
        brown: "var(--Brown)",
        pink: "var(--Pink)",
        yellow: "var(--Yellow)",
        DarkBrown: "var(--DarkBrown)",
      },
    },
  },
  plugins: [],
};
