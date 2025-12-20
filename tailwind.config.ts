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
          // Первое значение - цвет ползунка, второе - цвет фона (трека)
          scrollbarColor: "#fffff rgba(255, 255, 255, 0.01)",
        },

        /* --- Стили для WebKit (Chrome, Edge, Safari) --- */
        "*::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },
        "*::-webkit-scrollbar-track": {
          // Сделаем фон трека полупрозрачным, чтобы он был виден на любом фоне
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "9999px",
        },
        "*::-webkit-scrollbar-thumb": {
          // Задаем основной красный цвет ползунка
          background: "#812626",
          borderRadius: "9999px",
          // Добавляем небольшой отступ, чтобы фон трека был виден по краям
          border: "2px solid transparent",
          backgroundClip: "content-box",
        },
        "*::-webkit-scrollbar-thumb:hover": {
          // Делаем цвет ползунка немного ярче при наведении
          background: "#9f2d2d",
        },
      });
    }),
  ],
};

export default config;