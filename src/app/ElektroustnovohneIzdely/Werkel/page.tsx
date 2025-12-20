"use client";

import React, { useState } from 'react';
import Image from "next/image";
import Link from 'next/link';

interface Subcategory {
  id: string;
  name: string;
  url?: string;
  image?: string;
  isHeader?: boolean;
}

interface Series {
  id: string;
  name: string;
  image: string;
  description?: string;
  subcategories?: Subcategory[];
}

const werkelSeries = [
  {
    id: 'werkel',
    name: 'Встраиваемые серии',
    image: '/images/seris/ВстраиваемыесерииWerkel.webp',
    logo: '/images/brands/werkellogo.png',
    description: 'Инновационные решения в области электроустановочных изделий',
    series: [
      {
        id: 'standard-werkel',
        name: 'Встраиваемая серия',
        image: '/images/seris/ВстраиваемыесерииWerkel.webp',
        description: 'Классические встраиваемые изделия',
        subcategories: [
          { id: 'standard', name: 'Белое глянцевое', image: '/images/colors/белыйглянцевыйWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/white-gloss' },
          { id: 'black', name: 'Черный матовый', image: '/images/colors/черныйматовыйWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/black-matte' },
          { id: 'white-acrylic', name: 'Белый акрил', image: '/images/colors/белыйакрилWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/white-acrylic' },
          { id: 'silver', name: 'Серебряный матовый', image: '/images/colors/серебряныйматовыйWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/silver-matte' },
          { id: 'silver-corrugated', name: 'Серебряный рифленый', image: '/images/colors/серебряныйрифленыйWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/silver-corrugated' },
          { id: 'nickel-corrugated', name: 'Никель рифленый глянцевый', image: '/images/colors/никельрифленыйглянцевыйWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/nickel-corrugated-gloss' },
          { id: 'ivory-matte', name: 'Айвори матовый', image: '/images/colors/айвориматовыйWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/ivory-matte' },    
          { id: 'ivory-acrylic', name: 'Айвори акрил', image: '/images/colors/айвориакрилWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/ivory-acrylic' },
          { id: 'ivory-gloss', name: 'Слоновая кость глянцевый', image: '/images/colors/слоноваякостьгялнцевыйWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/ivory-gloss' },
          { id: 'champagne-metallic', name: 'Шампань металлик', image: '/images/colors/шампаньметалликWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/champagne-metallic' },
          { id: 'champagne-corrugated', name: 'Шампань рифленый', image: '/images/colors/шампаньрифленыйWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/champagne-corrugated' },
          { id: 'bronze-corrugated', name: 'Бронза глянцевый', image: '/images/colors/бронзаглянцевыйWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/bronze-corrugated' },
          { id: 'graphite-acrylic', name: 'Графит акрил', image: '/images/colors/графитакрилWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/graphite-acrylic' },
          { id: 'graphite-matte', name: 'Графит матовый', image: '/images/colors/графитматовыйWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/graphite-matte' },
          { id: 'graphite-corrugated', name: 'Графит рифленый', image: '/images/colors/графитрифленыйWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/graphite-corrugated' },
          { id: 'black-acrylic', name: 'Черный акрил', image: '/images/colors/черныйакрилWerkel.png', url: '/ElektroustnovohneIzdely/Werkel/black-acrylic' },
        ]
      }
    ]
  },
  {
    id: 'gallant',
    name: 'Gallant',
    image: '/images/seris/Gallant.png',
    description: 'Премиальная коллекция в стиле арт-деко-Gallant',
    colors: [
      { id: 'graphite-corrugated', name: 'Графит рифленый', image: '/images/colors/графитрифленыйGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-graphite-corrugated' },
      { id: 'black-chrome', name: 'Черный хром', image: '/images/colors/черныйхромGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-black-chrome' },
      { id: 'ivory', name: 'Слоновая кость', image: '/images/colors/слоноваякостьGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-ivory' },
      { id: 'silver', name: 'Серебряный', image: '/images/colors/серебряныйGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-silver' },
      { id: 'white', name: 'Белый', image: '/images/colors/белыйGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-white' },
      { id: 'champagne-corrugated', name: 'Шампань рифленый', image: '/images/colors/шампаньрифленыйGallant.webp', url: '/ElektroustnovohneIzdely/Werkel/gallant-champagne-corrugated' },
    ],
  },
  {
    id: 'vintage',
    name: 'Vintage',
    image: '/images/seris/Vintage.png',
    description: 'Элегантность в каждой детали - роскошь винтажного дизайна',
    colors: [
      { id: 'standard', name: 'Черный матовый', image: '/images/colors/черныйматовыйхромWerkel.webp', url: '/ElektroustnovohneIzdely/Werkel/vintage-black-matte' },
      { id: 'silver', name: 'Мокко матовый хром', image: '/images/colors/моккоматоыйхромWerkel.webp', url: '/ElektroustnovohneIzdely/Werkel/vintage-mokko-chrome' },
    ],
    frames: [
      { id: 'frame-retro-standard', name: 'Runda', image: '/images/seris/rundWerkel.webp', url: '/ElektroustnovohneIzdely/Werkel/ramka-runda' },
    ]
  },
  {
    id: 'retro',
    name: 'Retro',
    image: '/images/seris/Retro.png',
    description: 'Винтажный стиль для ценителей классической элегантности',
    colors: [
      { id: 'standard', name: 'Коричневый', image: '/images/colors/ретрокоричневыйWerkel.webp', url: '/ElektroustnovohneIzdely/Werkel/retro-black' },
      { id: 'black', name: 'Черный', image: '/images/colors/ретрочерныйWerkel.webp', url: '/ElektroustnovohneIzdely/Werkel/retro-ceramic' },
      { id: 'black', name: 'Белый', image: '/images/colors/ретробелыйWerkel.webp', url: '/ElektroustnovohneIzdely/Werkel/retro-white' },
    ],
    frames: [
      { id: 'frame-retro-standard', name: 'Runda', image: '/images/seris/rundWerkel.webp', url: '/ElektroustnovohneIzdely/Werkel/ramka-runda' },
    ]
  },
];

export default function ColorWerkelPage() {
  const [selectedSeries, setSelectedSeries] = useState(null as any);

  const handleSeriesClick = (series: any) => {
    // Normalize series data so UI can always read `subcategories`
    let subcategories: any[] = [];
    if (series.subcategories) {
      subcategories = series.subcategories;
    } else if (series.colors) {
      subcategories = series.colors;
    } else if (series.series && Array.isArray(series.series) && series.series.length) {
      subcategories = series.series[0].subcategories || [];
    }

    const normalized = { ...series, subcategories };
    setSelectedSeries(normalized);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSeries = () => setSelectedSeries(null);

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <div className="container mx-auto px-6 py-44 max-w-[88rem]">
        <section className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-5xl text-white lg:text-7xl font-bold mb-4">Серия Werkel</h1>
            <p className="text-base text-white mb-6 max-w-xl">С 1990 года Werkel производит электроустановочные изделия в стиле скандинавский дизайн. Этот стиль отличается высоким качеством и элегантностью. Werkel — это не просто электрика, это искусство создания совершенного пространства. Выбирайте качество</p>

            <div className="space-y-4 max-w-xs">
              <a className="block bg-[#340b0b] opacity-30 text-white py-3 rounded-lg text-center">Конфигуратор Werkel</a>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="rounded-xl overflow-hidden shadow-lg w-full max-w-md">
              <Image src="/images/banners/bannersWerkelhall.jpg" alt="Donel" width={600} height={420} className="object-cover" />
            </div>
          </div>
        </section>

        <section className="mt-16 grid lg:grid-cols-2 gap-8 items-center">
          <div className="rounded-xl overflow-hidden shadow-lg w-full max-w-sm">
            <Image src="/images/banners/bannersWerkelbathroom.jpg" alt="Donel feature" width={520} height={360} className="object-cover" />
          </div>
          <div>
            <h3 className="text-3xl text-white font-semibold mb-4">Особенности и характерные черты серии:</h3>
            <ul className="list-disc ml-6 space-y-2 text-sm  text-white">
            <li>Самозажимные клеммы для проводов 0,75–2,5 мм²</li>
            <li>Токопроводящие элементы из фосфорной бронзы (94 % Cu, 6 % Sn)</li>
            <li>Корпус из негорючего поликарбоната с клипсами Easy Click</li>
            <li>Жесткий суппорт из нержавеющей стали</li>
            <li>Серебряные контактные площадки (90 % Ag, 10 % Ni)</li>
            <li>Рабочий диапазон температуры: от –40° до +80 °C</li>
            <li>Гарантия 12 мес</li>
            </ul>
          </div>
        </section>

        <section className="mt-12">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col items-start">
              <h2 className="text-5xl text-white font-semibold mb-6">Все серии Werkel</h2>
              <p className="text-white text-sm md:text-base mb-3 md:mb-4 leading-relaxed"> Выберите интересующую вас серию Werkel чтобы узнать всё о её цветах, механизмах и ценах. Наша продукция представлена в нескольких популярных сериях, каждая из которых отличается дизайном, функциональностью и разнообразием цветовых решений. Werkel — это серия электрических рамок для встраиваемых устройств, которая отличается высоким качеством и современным дизайном. </p>
            </div>
            <div>
              {!selectedSeries ? (
            <div className="flex flex-col gap-4 md:gap-6">
              {werkelSeries.map((series) => (
                <div key={series.id} className="group cursor-pointer h-full" onClick={() => handleSeriesClick(series)}>
                  <div className="bg-[#101010] border border-white/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-red-500 hover:shadow-lg h-full">
                    <div className="flex flex-row items-center p-4 md:p-6 h-full min-h-[160px]">
                      <div className="flex-1 pr-4 md:pr-6 flex flex-col justify-center text-left">
                        <h3 className="text-xl sm:text-5xl w-[300px] font-bold text-white mb-2 md:mb-3 group-hover:text-red-400 transition-colors duration-300">{series.name}</h3>
                        <p className="text-gray-400 text-sm md:text-base mb-3 md:mb-4 leading-relaxed">{series.description}</p>
                        <div className="flex items-center justify-start text-white">
                         
                          <span className="text-xs  -ml-1 items-center bg-[#272626] rounded-full px-3 py-2 md:text-sm">Смотреть серию</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 w-[300px] h-[300px] sm:w-[300px] sm:h-[300px] md:w-48 md:h-48 lg:w-[600px] lg:h-[600px]">
                        <div className="w-full h-full rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <Image src={series.image} alt={series.name} width={400} height={400} className="object-contain max-w-[600px] max-h-[600px] " />
                        </div>
                      </div>
                    </div>
                  </div>
               
                </div>
                
              ))}
              
            </div>
          ) : (
            <div className="py-4 md:py-8">
              <div className="mb-6 md:mb-8">
                <button onClick={handleBackToSeries} className="flex items-center text-white hover:text-red-500 mb-4 md:mb-6 transition-colors duration-300 text-sm md:text-base">
                  <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Назад к сериям Donel
                </button>
                <div className="rounded-lg p-4 md:p-6">
                  <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-lg p-2 flex items-center justify-center">
                      <Image src={selectedSeries.image} alt={selectedSeries.name} width={500} height={500} className="object-contain max-w-full max-h-full scale-65" />
                    </div>
                    <div className="text-center md:text-left">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">{selectedSeries.name}</h2>
                      <p className="text-gray-400 text-sm md:text-base">{selectedSeries.subcategories?.length || 0} доступных вариантов</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-x-4 gap-y-8 md:gap-y-12 mb-8 md:mb-12">
                {selectedSeries.subcategories?.map((subcategory: any) => (
                  subcategory.isHeader ? (
                    <div key={subcategory.id} className="col-span-full pt-2"><h3 className="text-white uppercase text-5xl font-semibold">{subcategory.name}</h3></div>
                  ) : (
                    <Link key={subcategory.id} href={subcategory.url || '#'}>
                      <div className="group cursor-pointer">
                        <div className="rounded-lg transition-all duration-300 hover:border-red-500">
                          <div className="w-full h-48 sm:h-56 md:h-72 lg:h-full flex items-center justify-center p-0">
                            <Image src={subcategory.image || '/images/seris/placeholder.png'} alt={subcategory.name} width={800} height={800} className="w-full h-full object-contain scale-65 group-hover:scale-105 transition-transform duration-300" />
                          </div>
                          <div className="mt-3"><h3 className="font-medium text-white group-hover:text-red-400 transition-colors duration-300 text-center leading-tight text-xs sm:text-sm md:text-base tracking-wide">{subcategory.name}</h3></div>
                        </div>
                      </div>
                    </Link>
                  )
                ))}
              </div>
            </div>
          )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
