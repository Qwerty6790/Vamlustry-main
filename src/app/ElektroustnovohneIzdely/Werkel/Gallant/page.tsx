
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

// --- Data ---
const activeBrand = {
  id: 'werkel',
  name: 'Werkel',
  logo: '/images/brands/werkellogo.png',
  description: 'Шведское качество и дизайн',
};

const gallantData = {
  id: 'gallant',
  name: 'Gallant',
  description: 'Премиальная коллекция в стиле арт-деко. Эталон немецкого качества и элегантного дизайна.',
  // Используем первое изображение как иконку для боковой панели
  image: '/images/colors/белыйGallant.webp', 
  colors: [
    { id: 'graphite-corrugated', name: 'Графит рифленый', image: '/images/colors/графитрифленыйGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-graphite-corrugated' },
    { id: 'black-chrome', name: 'Черный хром', image: '/images/colors/черныйхромGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-black-chrome' },
    { id: 'ivory', name: 'Слоновая кость', image: '/images/colors/слоноваякостьGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-ivory' },
    { id: 'silver', name: 'Серебряный', image: '/images/colors/серебряныйGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-silver' },
    { id: 'white', name: 'Белый', image: '/images/colors/белыйGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-white' },
    { id: 'champagne-corrugated', name: 'Шампань рифленый', image: '/images/colors/шампаньрифленыйGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-champagne-corrugated' },
  ],
};

export default function WerkelGallantPage() {
  const activeSeries = gallantData;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-black selection:text-white flex flex-col pt-28 md:pt-36 overflow-x-hidden">
      <Head>
        <title>{activeSeries.name} — {activeBrand.name} Каталог</title>
        <meta name="description" content={`Каталог серии ${activeSeries.name} от ${activeBrand.name}`} />
      </Head>

      {/* --- TOP SECTION: Interactive Typography Navigation --- */}
      <div className="max-w-[1800px] mx-auto w-full px-4 lg:px-8 relative mb-8">
        <div className="relative w-full select-none py-4 md:py-10">
           {/* Container for aligned text */}
           <div className="flex items-baseline whitespace-nowrap">
              
              {/* Brand Name (Huge, Dark, Foreground) */}
              <h1 className="text-[18vw] xl:text-[16rem] leading-none font-black text-black uppercase tracking-tighter relative z-20 transition-all duration-500 ease-in-out">
                {activeBrand.name}
              </h1>

              {/* Series Name as decorative background text */}
              <div 
                className="
                    group
                    text-[15vw] xl:text-[13rem] leading-none font-black text-gray-300 uppercase tracking-tighter
                    ml-[-4vw] /* Pull it behind the main text */
                    relative z-10 opacity-60
                    transition-all duration-500 ease-out
                "
              >
                {activeSeries.name}
              </div>
           </div>
        </div>

        {/* --- MAIN HERO CARD (Overlapping the huge text slightly) --- */}
        <div className="relative z-30 -mt-16 md:-mt-24 xl:-mt-32 w-full rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm border border-gray-100 shadow-xl p-8 md:p-12">
            <div className="absolute right-[-5%] top-[-10%] w-[40%] h-[120%] opacity-[0.03] pointer-events-none select-none">
                <Image src={activeBrand.logo} alt="" fill className="object-contain grayscale" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-2xl flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Серия</span>
                        <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded-full">{activeBrand.name}</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-9xl font-bold text-black mb-6 tracking-tight">
                        {activeSeries.name}
                    </h2>
                    <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">
                        {activeSeries.description}
                    </p>
                </div>

                <div className="relative w-full md:w-[300px] h-[200px] md:h-[300px] shrink-0 flex justify-center md:justify-end items-center">
                    <div className="relative w-full h-full">
                       {/* Пустой блок для баланса макета (как в оригинале) */}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- MAIN CONTENT (Sidebar + Grid) --- */}
      <main className="flex-1 max-w-[1800px] mx-auto w-full px-4 lg:px-8 py-8 lg:py-12 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* --- SIDEBAR (SERIES LIST) --- */}
          <aside className="lg:w-1/5 shrink-0">
             <div className="lg:sticky lg:top-24">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Коллекции {activeBrand.name}
                  </h2>
                </div>

                <div className="flex lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 lg:overflow-visible no-scrollbar">
                    {/* Активная (и единственная в этом компоненте) серия */}
                    <button
                      className="
                        group flex items-center gap-4 p-3 rounded-xl text-left transition-all duration-300 border
                        min-w-[220px] lg:min-w-0 bg-white border-black ring-1 ring-black shadow-lg
                      "
                    >
                      <div className="relative w-12 h-12 shrink-0 bg-gray-50 rounded-lg overflow-hidden p-1 flex items-center justify-center">
                        <Image 
                          src={activeSeries.image} 
                          alt={activeSeries.name} 
                          fill 
                          className="object-contain mix-blend-multiply" 
                        />
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-black">
                          {activeSeries.name}
                        </span>
                        <span className="text-[10px] text-gray-400">
                           {activeSeries.colors.length} товаров
                        </span>
                      </div>
                    </button>
                </div>
             </div>
          </aside>

          {/* --- CONTENT AREA --- */}
          <div className="flex-1 min-w-0 animate-fade-in">
            {/* PRODUCT GRID */}
            <div>
               <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                  <h3 className="text-xl font-medium text-gray-900">
                    Ассортимент
                  </h3>
               </div>

               <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                 {activeSeries.colors.map((color) => (
                    <Link key={color.id} href={color.url || '#'} className="group block">
                       <div className="relative aspect-square bg-white rounded-2xl overflow-hidden mb-4 border border-gray-100 transition-all duration-300 group-hover:shadow-xl group-hover:border-gray-200">
                         <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">Смотреть</span>
                         </div>

                         <div className="absolute inset-4 flex items-center justify-center bg-white">
                           <div className="relative w-full h-full">
                              <Image
                                src={color.image || '/images/placeholder.png'}
                                alt={color.name}
                                fill
                                className="object-contain transition-transform duration-500 group-hover:scale-110"
                              />
                           </div>
                         </div>
                       </div>
                       
                       <div className="px-1 text-center md:text-left">
                         <h4 className="text-sm md:text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                           {color.name}
                         </h4>
                       </div>
                    </Link>
                 ))}
               </div>

               {activeSeries.colors.length === 0 && (
                 <div className="py-20 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                   В этой категории пока нет товаров.
                 </div>
               )}
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}
