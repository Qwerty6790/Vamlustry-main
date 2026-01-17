
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
        /* Firefox не умеет делать меньше чем "thin", задаем полупрозрачный цвет */
        "*": {
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0, 0, 0, 0.3) transparent", 
        },

        /* --- Стили для WebKit (Chrome, Edge, Safari) --- */
        "*::-webkit-scrollbar": {
          width: "6px",  // Общая зона клика (немного шире для удобства)
          height: "6px",
        },
        "*::-webkit-scrollbar-track": {
          background: "transparent", // Трек полностью прозрачный
        },
        "*::-webkit-scrollbar-thumb": {
          // Цвет: Черный с прозрачностью 20% (очень легкий серый)
          backgroundColor: "rgba(0, 0, 0, 0.2)", 
          borderRadius: "20px",
          
          /* ВАЖНЫЙ МОМЕНТ ДЛЯ ТОНКОСТИ: 
             Ширина 6px минус по 2px рамки с каждой стороны = 2px видимой полоски.
             Это делает его визуально "ниткой", но в него проще попасть мышкой. */
          border: "2px solid transparent",
          backgroundClip: "content-box",
        },
        "*::-webkit-scrollbar-thumb:hover": {
          // При наведении становится темнее (50% непрозрачности)
          backgroundColor: "rgba(0, 0, 0, 0.5)", 
        },
        
        /* Убираем "квадратик" в углу при скролле по двум осям */
        "*::-webkit-scrollbar-corner": {
            backgroundColor: "transparent",
        }
      });
    }),
  ],
};

export default config;
