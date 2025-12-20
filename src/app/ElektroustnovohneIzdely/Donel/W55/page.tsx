'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';



// Исправляем интерфейс для subcategories, добавляем image
interface W55Category {
  id: string;
  name: string;
  image: string;
  url?: string;
  subcategories?: { id: string; name: string; url: string; image: string }[];
  description?: string;
}

const w55Categories: W55Category[] = [
  {
    id: 'w55',
    name: 'W55',
    image: '/images/seris/w55.png',
    description: 'Категория для W55',
    subcategories: [
      { id: 'w55', name: 'накладной монтаж', url: '/ElektroustnovohneIzdely/Donel/W55-nakladnoy', image: '/images/seris/w55.png' },
      { id: 'w55', name: 'встроенный монтаж', url: '/ElektroustnovohneIzdely/Donel/W55-vstroeniy', image: '/images/seris/w55vstrony.png' },
    ]
  },
];

// const W55imagesBanner = () => {
//   return (
//     <div className="relative w-full h-64 md:h-80 lg:h-96 mb-8 md:mb-12 rounded-xl overflow-hidden">
//       <Image
//         src="/images/banners/bannersW55.png"
//         alt="Donel"
//         fill
//         className="object-cover"
//         priority
//       />
//     </div>
//   );
// };
// Меняем название компонента
export default function W55Page() {
  const router = useRouter(); 
  const [selectedSeries, setSelectedSeries] = useState<W55Category| null>(null);
  const [showFrames, setShowFrames] = useState(false);

  const handleSeriesClick = (series: W55Category) => {
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
    <div style={{ backgroundColor: 'var(--background)' }} className="min-h-screen text-[var(--foreground)] pt-24 md:pt-32 max-w-[92rem] mx-auto">
      <div className="flex flex-col md:flex-row">
      
        {/* Left Fixed/Sticky Part */}
        <div className="md:w-1/2 md:h-screen md:sticky md:top-0 bg-[#101010] p-6 sm:p-8 md:p-16 flex flex-col justify-center">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-medium text-white mb-6">
           Серия W55
          </h1>
          <p className="text-white mb-4 text-base sm:text-lg">
            Откройте для себя превосходные электроустановочные изделия – эталон немецкого качества и элегантного дизайна в мире электрики!
          </p>
          <p className="text-white mb-4 text-base sm:text-lg">
            Каждая серия  представляет собой гармоничное сочетание функциональности и стиля. От классических встраиваемых серий до премиальных коллекций – каждое изделие создано с учетом высочайших стандартов качества.
          </p>
          <p className="text-white text-base sm:text-lg">
            — это не просто электрика, это искусство создания совершенного пространства. Выбирайте качество, выбирайте !
          </p>
        </div>

        {/* Right Scrollable Part */}
        <div className="md:w-1/2 p-4 sm:p-6 md:p-8 md:overflow-y-auto">
        {/* <W55imagesBanner /> */}
          {selectedSeries ? (
            
            // Detail view for a series
            <div className="py-6 sm:py-8 md:py-12">
              
              <div className="mb-2">
                <button
                  onClick={handleBackToSeries}
                  className="flex items-center text-white hover:text-red-500 mb-6 transition-colors duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Назад к сериям
                </button>
                
                <div className="rounded-lg p-4 sm:p-6">
                  <div className="flex flex-row items-center justify-between space-x-4 sm:space-x-6">
                    <div className="flex-1">
                      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        {selectedSeries.name}
                      </h2>
                      <p className="text-gray-400">
                        {selectedSeries.subcategories?.length || 0} доступных вариантов
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-28 h-28 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-lg p-2 flex items-center justify-center">
                      <Image
                        src={selectedSeries.image}
                        alt={selectedSeries.name}
                        width={500}
                        height={500}
                        sizes="(max-width: 640px) 112px, (max-width: 768px) 192px, 224px"
                        className="object-contain max-w-full max-h-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {showFrames ? (
                 <>
                 <div className="mb-6">
                   <button
                     onClick={handleBackFromFrames}
                     className="flex items-center text-red-500 hover:text-red-400 mb-4 transition-colors duration-300"
                   >
                     Назад к цветам серии
                   </button>
                   <h3 className="text-2xl font-bold text-white mb-2">Рамки</h3>
                   <p className="text-gray-400">Все доступные рамки для серии {selectedSeries.name}</p>
                 </div>
                 
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-6 sm:gap-y-10 md:gap-y-12 mb-8 sm:mb-12">
                   {selectedSeries.subcategories?.map((subcategory) => (
                     <Link key={subcategory.id} href={subcategory.url}>
                       <div className="group cursor-pointer">
                         <div className="rounded-lg overflow-hidden transition-all duration-300 hover:border-red-500">
                           <div className="w-full  flex items-center justify-center p-0">
                             <Image
                               src={subcategory.image}
                               alt={subcategory.name}
                               width={500}
                               height={500}
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                               className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                             />
                           </div>
                           <div className="p-3">
                             <h3 className="font-medium text-white group-hover:text-red-400 transition-colors duration-300 text-center text-sm leading-tight">
                               {subcategory.name}
                             </h3>
                           </div>
                         </div>
                       </div>
                     </Link>
                   ))}
                 </div>
 
                 <div className="border-t pt-6">
                   <h3 className="text-xl font-bold text-white mb-4">Цвета серии {selectedSeries.name}</h3>
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-6 sm:gap-y-10 md:gap-y-12 mb-8 sm:mb-12">
                     {/* For Chtk, there are no direct colors, so this section is removed or adapted */}
                   </div>
                 </div>
               </>
              ) : (
                <>
                  <div className="grid grid-cols-2  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-6 sm:gap-y-10 md:gap-y-12 mb-8 sm:mb-12">
                    {selectedSeries.subcategories?.map((subcategory) => (
                      <Link key={subcategory.id} href={subcategory.url}>
                        <div className="group cursor-pointer ">
                          <div className="rounded-lg overflow-hidden transition-all duration-300 hover:border-red-500">
                            <div className="w-full flex items-center justify-center p-0">
                              <Image
                                src={subcategory.image}
                                alt={subcategory.name}
                                width={600}
                                height={600}
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="p-3">
                              <h3 className="font-medium text-white group-hover:text-red-400 transition-colors duration-300 text-center text-sm leading-tight">
                                {subcategory.name}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            // SERIES LIST VIEW (initial view)
            <div className="py-16 sm:py-24 md:py-44">
              <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-4">
                  Серии Donel
                </h2>
              </div>
              <div className="flex flex-col gap-6 ">
                {w55Categories.map((series) => (
                  <div
                    key={series.id}
                    onClick={() => handleSeriesClick(series)}
                    className="group cursor-pointer h-full"
                  >
                    <div className="bg-[#101010] border border-white/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-red-500 hover:shadow-lg h-full">
                      <div className="flex flex-row items-center p-4 sm:p-6 h-full sm:min-h-[160px]">
                        <div className="flex-1 pr-4 sm:pr-6 flex flex-col justify-center text-left">
                          <div className="w-56 h-20 sm:w-64 sm:h-24 md:w-80 md:h-28 lg:w-72 lg:h-32 mb-2 md:mb-3">
                            <Image
                              src="/images/brands/donellogo.svg"
                              alt="Donel"
                              width={400}
                              height={400}
                              sizes="(max-width: 640px) 224px, (max-width: 768px) 256px, 320px"
                              className="object-contain w-full h-full"
                            />
                          </div>
                          <p className="text-white text-sm sm:text-base mb-4 leading-relaxed">
                            {series.description}
                          </p>
                           <div className="flex  -ml-1 items-center bg-[#272626] rounded-full px-3 py-2 text-white">
                           
                            <span className="text-sm">Смотреть категорию</span>
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0 w-[300px]  sm:w-[300px] md:w-[600px]  lg:w-[600px] lg:h-[600px] h-[300px] sm:h-[300px]  md:h-[300px]  mt-0">
                          <div className="w-full h-full rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <Image
                              src={series.image}
                              alt={series.name}
                              width={400}
                              height={400}
                              sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, 256px"
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

