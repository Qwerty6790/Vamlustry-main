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
          // Цвет ползунка (30% белый) и цвет трека (5% белый)
          scrollbarColor: "rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.05)",
        },

        /* --- Стили для WebKit (Chrome, Edge, Safari) --- */
        "*::-webkit-scrollbar": {
          width: "8px", // Ширина вертикального скролла
          height: "8px", // Высота горизонтального скролла
        },
        "*::-webkit-scrollbar-track": {
          // Еле заметный фон трека
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "9999px",
        },
        "*::-webkit-scrollbar-thumb": {
          // Полупрозрачный белый ползунок (эффект стекла)
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          borderRadius: "9999px",
          // Прозрачная граница создает отступ внутри трека,
          // создавая эффект "парящего" скролла
          border: "2px solid transparent",
          backgroundClip: "content-box",
        },
        "*::-webkit-scrollbar-thumb:hover": {
          // При наведении делаем ползунок более матовым/белым
          backgroundColor: "rgba(255, 255, 255, 0.6)",
        },
      });
    }),
  ],
};

export default config;