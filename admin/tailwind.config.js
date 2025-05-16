/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        light: "var()",
        lightBrown: "var(Brown)",
        brown: "var(--Brown)",
        pink: "var(--Pink)",
        : "var(--)",
        DarkBrown: "var(--DarkBrown)",
      },
    },
  },
  plugins: [],
};
