
"use client";

import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-white text-black border-t border-neutral-200 overflow-hidden">
      <div className="max-w-[96rem] mx-auto px-4 md:px-8 pt-16 md:pt-16 pb-4">
        
        {/* Верхняя часть: Сетка с информацией */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-24 md:mb-40">
          
          {/* 1. Юридическая информация */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold uppercase tracking-widest text-black">О нас</h3>
            <div className="flex flex-col text-sm space-y-1 text-neutral-600 font-mono">
              <a className="hover:opacity-60 transition-opacity w-fit" href="/about">Доставка</a>
              <a className="hover:opacity-60 transition-opacity w-fit" href='/about'>Информация о нас</a>
            </div>
          </div>

          {/* 2. Контакты */}
          <div className="space-y-4">
            <h3 className="text-2xl  font-bold uppercase tracking-widest text-black">Связь</h3>
            <div className="text-sm space-y-1 text-neutral-600 font-mono">
              <a href="mailto:infoelektromosru@gmail.com" className="hover:opacity-60 transition-opacity w-fit">
                infovamlystry@gmail.com
              </a>
            </div>
          </div>

          {/* 3. Соцсети */}
          <div className="space-y-4">
            <h3 className="text-2xl  font-bold uppercase tracking-widest text-black">Соцсети</h3>
            <div className="flex-1 p-1  text-sm space-y-1 text-neutral-600 font-mono">
              <a href="https://wa.me/79037970699" target="_blank" rel="noreferrer" className="hover:opacity-60 transition-opacity p-1 w-fit">
                WhatsApp
              </a>
              <a href="https://t.me/elektromos25km" target="_blank" rel="noreferrer" className="hover:opacity-60 transition-opacity p-1 w-fit">
                Telegram
              </a>
              <a href="https://vk.com/club232538779" target="_blank" rel="noreferrer" className="hover:opacity-60 transition-opacity p-1 w-fit">
                ВКонтакте
              </a>
            </div>
          </div>

          {/* 4. Копирайт и доп. ссылки */}
          <div className="flex flex-col justify-between space-y-4">
          <h3 className="text-2xl  font-bold uppercase tracking-widest text-black ">Дополнительно</h3>
            <div className="flex-1 p-1  text-sm space-y-1 text-neutral-600 font-mono">
            <p>Информация о нас</p>
               <p className="text-sm text-neutral-500">Доставка от 3000 ₽ — бесплатно.</p>
               
            </div>
          </div>
        </div>

        {/* Нижняя часть: ОГРОМНОЕ НАЗВАНИЕ */}
        <div className="border-t border-neutral-100 pt-4">
          <h1 className="text-[13vw] leading-[0.8] font-black tracking-tighter text-center md:text-justify md:text-justify-last w-full select-none transform translate-y-2">
            ВАМЛЮСТРА
          </h1>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
