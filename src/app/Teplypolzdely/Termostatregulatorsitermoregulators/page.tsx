'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Head from 'next/head';



// Исправляем интерфейс для subcategories, добавляем image
interface ChtkSeries {
  id: string;
  name: string;
  image: string;
  logo: string;
  url?: string;
  subcategories?: { id: string; name: string; url: string; image: string }[];
  description?: string;
}

// В данных добавляем image для подкатегорий (плейсхолдеры)
const chtkSeriesData: ChtkSeries[] = [
    {
        id: 'termoregulator',
        name: 'Werkel',
        url: '/Teplypolzdely/Werkel/Termoregulator',
        image: '/images/seris/TermostatWerkel.png',
        logo: '/images/brands/werkellogo.png',
        description: 'Категория для терморегуляторов',
      },
      {
        id: 'termoregulator',
        name: 'ЧТК',
        url: '/Teplypolzdely/HTK/Termoregulytor/',
        image: '/images/seris/TermostatCHTK.png',
        logo: '/images/brands/chtklogo.webp',
        description: 'Категория для терморегуляторов',
      },
      {
        id: 'termoregulator',
        name: 'Voltum',
        url: '/Teplypolzdely/Voltum/Termoregulator',
        image: '/images/seris/TermostatVoltum.png',
        logo: '/images/brands/voltumlogo.png',
        description: 'Категория для терморегуляторов',
      },
  {
    id: 'termostat',
    name: 'Donel',
    url: '/Teplypolzdely/Donel/Termostat',
    image: '/images/seris/TermostatDonel.png',
    logo: '/images/brands/donellogo.svg',
    description: 'Категория для термостатов',
  }
];

// Меняем название компонента
export default function ChtkPage() {
  const [selectedSeries, setSelectedSeries] = useState<ChtkSeries | null>(null);
  const [showFrames, setShowFrames] = useState(false);
  const router = useRouter();

  // Прокрутка к верху при изменении состояния
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedSeries]);

  const handleSeriesClick = (series: ChtkSeries) => {
    if (series.url) {
      router.push(series.url); // <-- вместо window.location.href
    } else {
      setSelectedSeries(series);
      setShowFrames(false);
    }
  };

  const handleBackToSeries = () => {
    setSelectedSeries(null);
    setShowFrames(false);
  };

  const handleFramesClick = () => {
    setShowFrames(true);
  };

  const handleBackFromFrames = () => {
    setShowFrames(false);
  };

  return (
    <div style={{ backgroundColor: 'var(--background)' }} className="min-h-screen text-[var(--foreground)] pt-36 md:pt-32 max-w-[88rem] mx-auto">
      <div className="flex flex-col lg:flex-row">
      <Head>
        <title>МНФ Теплый пол под кварцвинил, ламинат,фольгомат, ЧТК | Elektromos</title>
        <meta name="description" content="Купить  Термостаты и Терморегуляторы : электронные, с датчиком пола, надежные решения для точного поддержания температуры." />
        <meta property="og:title" content="МНФ — купить теплый пол под плитку, ЧТК  | Elektromos" />
        <meta property="og:description" content="Купить Термостаты и Терморегуляторы : электронные, с датчиком пола, надежные решения для точного поддержания температуры." />
        <meta property="og:url" content="https://elektromos.uz/Teplypolzdely/Thermostats-termoregulators" />
        <meta property="og:image" content="/images/seris/TermostatCHTK.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
        {/* Left Fixed/Sticky Part */}
        <div className="lg:w-1/2 lg:h-screen lg:sticky lg:top-0 bg-[#101010] p-4 sm:p-6 md:p-8 lg:p-7 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-7xl font-medium text-white mb-4 md:mb-6">
            Термостаты и Терморегуляторы 
          </h1>
          <p className="text-white mb-3 md:mb-4 text-sm sm:text-base md:text-lg">
            Откройте для себя превосходные электроустановочные изделия – эталон немецкого качества и элегантного дизайна в мире электрики! Выберите свою любимую серию и откройте для себя мир электрики!
          </p>
          <p className="text-white mb-3 md:mb-4 text-sm sm:text-base md:text-lg">
            Каждая серия представляет собой гармоничное сочетание функциональности и стиля. От классических встраиваемых серий до премиальных коллекций – каждое изделие создано с учетом высочайших стандартов качества.
          </p>
          <p className="text-white text-sm sm:text-base md:text-lg">
            — это не просто электрика, это искусство создания совершенного пространства. Выбирайте качество, выбирайте !
          </p>
        </div>

        {/* Right Scrollable Part */}
        <div className="lg:w-1/2 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {selectedSeries ? (
            // Detail view for a series
            <div className="py-4 md:py-8">
              <div className="mb-6 md:mb-8">
                <button
                  onClick={handleBackToSeries}
                  className="flex items-center text-white hover:text-red-500 mb-4 md:mb-6 transition-colors duration-300 text-sm md:text-base"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Назад к сериям
                </button>
                
                <div className="rounded-lg p-4 md:p-6">
                  <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-lg p-2 flex items-center justify-center">
                      <Image
                        src={selectedSeries.image}
                        alt={selectedSeries.name}
                        width={300}
                        height={300}
                        className="object-contain max-w-full max-h-full"
                      />
                    </div>
                    <div className="text-center md:text-left">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                        {selectedSeries.name}
                      </h2>
                      <p className="text-gray-400 text-sm md:text-base">
                        {selectedSeries.subcategories?.length || 0} доступных вариантов
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {showFrames ? (
                 <>
                 <div className="mb-4 md:mb-6">
                   <button
                     onClick={handleBackFromFrames}
                     className="flex items-center text-white hover:text-red-400 mb-3 md:mb-4 transition-colors duration-300 text-sm md:text-base"
                   >
                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                     </svg>
                     Назад к цветам серии
                   </button>
                   <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Рамки</h3>
                   <p className="text-gray-400 text-sm md:text-base">Все доступные рамки для серии {selectedSeries.name}</p>
                 </div>
                 
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-x-4 gap-y-8 md:gap-y-12 mb-8 md:mb-12">
                   {selectedSeries.subcategories?.map((subcategory) => (
                     <Link key={subcategory.id} href={subcategory.url}>
                       <div className="group cursor-pointer">
                         <div className="rounded-lg overflow-hidden transition-all duration-300 hover:border-red-500">
                           <div className="w-full  flex items-center justify-center p-0">
                             <Image
                               src={subcategory.image}
                               alt={subcategory.name}
                               width={300}
                               height={300}
                               className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                             />
                           </div>
                           <div className="p-0 mt-2">
                             <h3 className="font-medium text-white group-hover:text-red-400 transition-colors duration-300 text-center leading-tight text-xs sm:text-sm md:text-base">
                               {subcategory.name}
                             </h3>
                           </div>
                         </div>
                       </div>
                     </Link>
                   ))}
                 </div>
 
                 <div className="border-t pt-4 md:pt-6">
                   <h3 className="text-lg sm:text-xl font-bold text-white mb-3 md:mb-4">Цвета серии {selectedSeries.name}</h3>
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-x-4 gap-y-8 md:gap-y-12 mb-8 md:mb-12">
                     {/* For Chtk, there are no direct colors, so this section is removed or adapted */}
                   </div>
                 </div>
               </>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-x-4 gap-y-8 md:gap-y-12 mb-8 md:mb-12">
                    {selectedSeries.subcategories?.map((subcategory) => (
                      <Link key={subcategory.id} href={subcategory.url}>
                        <div className="group cursor-pointer">
                          <div className="rounded-lg transition-all duration-300 hover:border-red-500">
                            <div className="w-full h-48 sm:h-56 md:h-72 lg:h-full flex items-center justify-center p-0">
                              <Image
                                src={subcategory.image}
                                alt={subcategory.name}
                                width={500}
                                height={500}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="p-0 mt-2">
                              <h3 className="font-medium text-white group-hover:text-red-400 transition-colors duration-300 text-center leading-tight text-xs sm:text-sm md:text-base">
                                {subcategory.name}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  {/* For Chtk, there are no frames, so this section is removed or adapted */}
                </>
              )}
            </div>
          ) : (
            // SERIES LIST VIEW (initial view)
            <div className="py-4 md:py-8 pt-20 md:pt-32">
              <div className="mb-6 md:mb-8">
              </div>
              <div className="flex flex-col gap-4 md:gap-6">
                {chtkSeriesData.map((series) => (
                  <div
                    key={series.id}
                    onClick={() => handleSeriesClick(series)}
                    className="group cursor-pointer h-full"
                  >
                    <div className="bg-[#101010] border border-white/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-red-500 hover:shadow-lg h-full">
                      <div className="flex flex-row items-center p-4 md:p-6 h-full min-h-[160px]">
                        <div className="flex-1 pr-4 md:pr-6 flex flex-col justify-center text-left">
                          <div className="w-56 h-20 sm:w-64 sm:h-24 md:w-80 md:h-28 lg:w-72 lg:h-32 mb-2 md:mb-3">
                            <Image
                              src={series.logo}
                              alt={series.name}
                              width={400}
                              height={400}
                              className="object-contain w-full h-full"
                            />
                          </div>
                          <p className="text-white text-sm md:text-base mb-3 md:mb-4 leading-relaxed">
                            {series.description}
                          </p>
                          <div className="flex  -ml-1 items-center bg-[#272626] rounded-full px-3 py-2 text-white">
                            
                            <span className="text-xs md:text-sm">Смотреть категорию</span>
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] lg:scale-[190%] lg:w-[600px] lg:h-[600px] ">
                          <div className="w-full h-full rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <Image
                              src={series.image}
                              alt={series.name}
                              width={200}
                              height={200}
                              className="object-contain max-w-full max-h-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
