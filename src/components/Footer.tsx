
"use client";

import React from "react";

const Footer = () => {
  return (
    <>
      {/* Стили для анимации */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          /* 
             20s — скорость (чем меньше число, тем быстрее).
             linear — КЛЮЧЕВОЙ момент, обеспечивает движение с одной скоростью без ускорений/замедлений.
             infinite — бесконечный повтор.
          */
          animation: marquee 20s linear infinite;
          /* Оптимизация производительности браузера */
          will-change: transform; 
        }
      `}</style>

      <footer className="w-full bg-white text-black border-t border-neutral-200 overflow-hidden">
        <div className="max-w-[96rem] mx-auto px-4 md:px-8 pt-16 md:pt-16 pb-4">
          
          {/* --- Верхняя часть (О нас, Связь, Соцсети) --- */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12 md:mb-24">
            {/* 1. О нас */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold uppercase tracking-widest text-black">О нас</h3>
              <div className="flex flex-col text-sm space-y-1 text-neutral-600 font-light tracking-tighter  leading-[1.1]">
                <a className="hover:opacity-60 transition-opacity w-fit" href="/about">Доставка</a>
                <a className="hover:opacity-60 transition-opacity w-fit" href='/about'>Информация о нас</a>
              </div>
            </div>

            {/* 2. Контакты */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold uppercase tracking-widest text-black">Связь</h3>
              <div className="text-sm space-y-1 text-neutral-600 font-light tracking-tighter  leading-[1.1]">
                <a href="mailto:infoelektromosru@gmail.com" className="hover:opacity-60 transition-opacity w-fit">
                  infovamlystry@gmail.com
                </a>
              </div>
            </div>

            {/* 3. Соцсети */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold uppercase tracking-widest text-black">Соцсети</h3>
              <div className="flex-1 p-1 text-sm space-y-1 text-neutral-600 font-light tracking-tighter  leading-[1.1]">
                <a href="https://t.me/" target="_blank" rel="noreferrer" className="hover:opacity-60 transition-opacity p-1 w-fit">
                  Telegram
                </a>
              </div>
            </div>

            {/* 4. Дополнительно */}
            <div className="flex flex-col justify-between space-y-4">
              <h3 className="text-2xl font-bold uppercase tracking-widest text-black">Дополнительно</h3>
              <div className="flex-1 p-1 text-sm space-y-1 text-neutral-600 font-light tracking-tighter  leading-[1.1]">
                <p>Информация о нас</p>
                <p className="text-sm text-neutral-500">Доставка от 20000 ₽ — бесплатно.</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- НИЖНЯЯ ЧАСТЬ: БЕСКОНЕЧНАЯ БЕГУЩАЯ СТРОКА --- */}
        <div className="border-t border-neutral-100 bg-white relative w-full overflow-hidden">
          <div className="flex whitespace-nowrap">
            
            {/* 
              ЛОГИКА:
              Мы создаем ДВА одинаковых блока. Оба двигаются влево.
              Каждый блок имеет ширину min-w-full (минимум во всю ширину экрана).
              Когда ПЕРВЫЙ блок полностью уходит влево (-100%), он мгновенно прыгает обратно на 0.
              В этот момент ВТОРОЙ блок (который следовал за ним) находится ровно там, где был первый.
              Зритель не замечает подмены.
            */}

            {/* Блок 1 */}
            <div className="animate-marquee flex min-w-full shrink-0 items-center justify-around py-2">
              <span className="text-[13vw] leading-none font-black tracking-tighter text-black px-4">
                ВАМЛЮСТРА
              </span>
            </div>

            {/* Блок 2 (Копия) */}
            <div className="animate-marquee flex min-w-full shrink-0 items-center justify-around py-2">
              <span className="text-[13vw] leading-none font-black tracking-tighter text-black px-4">
                ВАМЛЮСТРА
              </span>
            </div>

          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
