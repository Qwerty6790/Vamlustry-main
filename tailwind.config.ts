
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        /* --- Стили для Firefox --- */
        "*": {
          scrollbarWidth: "thin",
          // Ползунок: черный с прозрачностью 40%, Трек: полностью прозрачный
          scrollbarColor: "#000000 transparent",
        },

        /* --- Стили для WebKit (Chrome, Edge, Safari) --- */
        "*::-webkit-scrollbar": {
          width: "8px", // Ширина
          height: "8px",
        },
        "*::-webkit-scrollbar-track": {
          background: "#000000", // Фон трека невидимый
        },
        "*::-webkit-scrollbar-thumb": {
          // Полупрозрачный черный цвет (эффект темного стекла)
          backgroundColor: "#000000 transparent", 
          borderRadius: "9999px",
          
          // Этот трюк с границей делает скролл "парящим", добавляя отступ от края
          border: "2px solid transparent",
          backgroundClip: "content-box",
        },
        "*::-webkit-scrollbar-thumb:hover": {
          // При наведении становится более плотным черным (70%)
          backgroundColor: "#000000 transparent", 
        },
      });
    }),
  ],
};

export default config;
