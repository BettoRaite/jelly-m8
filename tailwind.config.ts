import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "hearts-pattern":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 40 40'%3E%3Cg fill='%23ff0000' fill-opacity='0.4'%3E%3Cpath d='M10 3.22l-.61-.6a5.5 5.5 0 0 0-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 0 0-7.78-7.77l-.61.61z'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      fontFamily: {
        sans: [
          '"Inter"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        inter: ['"Inter"'],
        amatic: ['"Amatic SC"', "cursive"],
        caveat: ['"Caveat"', "cursive"],
        comfortaa: ['"Comfortaa"', "sans-serif"],
        jost: ['"Jost"', "sans-serif"],
        nunito: ['"Nunito"', "sans-serif"],
        pacifico: ['"Pacifico"', "cursive"],
        triodion: ['"Triodion"', "cursive"],
      },
      animation: {
        moveInCircle: "moveInCircle 20s ease infinite",
        moveVertical: "moveVertical 30s ease infinite",
        moveHorizontal: "moveHorizontal 40s ease infinite",
        "scale-up-down": "scale-up-down 2s infinite",
        animateBG: "animateBackground 10s linear infinite",
      },
      keyframes: {
        "scale-up-down": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.5)" },
        },
        moveInCircle: {
          "0%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(180deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        moveVertical: {
          "0%": { transform: "translateY(-50%)" },
          "50%": { transform: "translateY(50%)" },
          "100%": { transform: "translateY(-50%)" },
        },
        moveHorizontal: {
          "0%": { transform: "translateX(-50%) translateY(-10%)" },
          "50%": { transform: "translateX(50%) translateY(10%)" },
          "100%": { transform: "translateX(-50%) translateY(-10%)" },
        },
        animateBackground: {
          "0%, 100%": { backgroundPosition: "left top" },
          "25%": { backgroundPosition: "right bottom" },
          "50%": { backgroundPosition: "left bottom" },
          "75%": { backgroundPosition: "right top" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
