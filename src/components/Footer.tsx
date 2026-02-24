
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
          animation: marquee 20s linear infinite;
          will-change: transform; 
        }
      `}</style>

      <footer className="w-full bg-white text-black border-t border-neutral-200 overflow-hidden">
        <div className="max-w-[96rem] mx-auto px-4 md:px-8 pt-10 md:pt-16 pb-4">
          
          {/* --- Верхняя часть (О нас, Связь, Соцсети) --- */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-8 mb-8 md:mb-24">
            
            {/* 1. О нас */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-sm md:text-2xl font-bold uppercase tracking-widest text-black">О нас</h3>
              <div className="text-[12px] space-y-2 md:space-y-1 text-neutral-600 font-light tracking-tighter leading-[1.1]">
                <a className="hover:opacity-60 transition-opacity w-fit block" href="/about">Доставка</a>
                <a className="hover:opacity-60 transition-opacity w-fit block" href='/about'>Информация о нас</a>
              </div>
            </div>

            {/* 2. Контакты */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-sm md:text-2xl font-bold uppercase tracking-widest text-black">Связь</h3>
              <div className="text-[12px] space-y-2 md:space-y-1 text-neutral-600 font-light tracking-tighter leading-[1.1]">
                <a href="mailto:infoelektromosru@gmail.com" className="hover:opacity-60 transition-opacity w-fit block break-all sm:break-normal">
                  infovamlystry@gmail.com
                </a>
              </div>
            </div>

            {/* 3. Соцсети */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-sm md:text-2xl font-bold uppercase tracking-widest text-black">Соцсети</h3>
              <div className="text-[12px] space-y-2 md:space-y-1 text-neutral-600 font-light tracking-tighter leading-[1.1]">
                <a href="https://t.me/" target="_blank" rel="noreferrer" className="hover:opacity-60 transition-opacity w-fit block">
                  Telegram
                </a>
              </div>
            </div>

            {/* 4. Дополнительно */}
            <div className="flex flex-col space-y-3 md:space-y-4">
              <h3 className="text-sm md:text-2xl font-bold uppercase tracking-widest text-black">Прочее</h3>
              <div className="text-[12px] space-y-2 md:space-y-1 text-neutral-600 font-light tracking-tighter leading-[1.1]">
                <p>Информация о нас</p>
                <p className="text-[12px] text-neutral-500 mt-2 md:mt-0">Доставка от 20 000 ₽ бесплатно.</p>
              </div>
            </div>
          </div>
        </div>

      </footer>
    </>
  );
};

export default Footer;
