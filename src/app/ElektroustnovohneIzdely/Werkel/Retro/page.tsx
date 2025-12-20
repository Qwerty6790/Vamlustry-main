'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
interface Color {
  id: string;
  name: string;
  image: string;
  url: string;
}

interface Frame {
  id: string;
  name: string;
  image: string;
  url: string;
}

interface WerkelSeries {
  id: string;
  name: string;
  image: string;
  url?: string;
  colors: Color[];
  frames?: Frame[];
  description?: string;
}

// Все серии Werkel из name.tsx
const werkelSeriesData: WerkelSeries[] = [
 
   
 
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

export default function WerkelPage() {
  const [selectedSeries, setSelectedSeries] = useState<WerkelSeries | null>(null);
  const [showFrames, setShowFrames] = useState(false);
  const router = useRouter();

  const handleSeriesClick = (series: WerkelSeries) => {
    if (series.url) {
      router.push(series.url);  // здесь переход через роутер
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
    <div style={{ backgroundColor: 'var(--background)' }} className="min-h-screen text-[var(--foreground)] pt-32 max-w-[92rem] mx-auto">
      
      <div className="flex flex-col md:flex-row">
      
        {/* Left Fixed/Sticky Part */}
        <div className="md:w-1/2 md:h-screen md:sticky md:top-0 bg-[#101010] p-8 md:p-16 flex flex-col justify-center">
          <h1 className="text-4xl md:text-7xl font-medium text-white mb-6">
            Серия Retro
          </h1>
          <p className="text-white mb-4 text-lg">
            Откройте для себя превосходные электроустановочные изделия Werkel – эталон немецкого качества и элегантного дизайна в мире электрики!
          </p>
          <p className="text-white mb-4 text-lg">
            Каждая серия Werkel представляет собой гармоничное сочетание функциональности и стиля. От классических встраиваемых серий до премиальных коллекций Gallant и Vintage – каждое изделие создано с учетом высочайших стандартов качества.
          </p>
          <p className="text-white text-lg">
            Werkel — это не просто электрика, это искусство создания совершенного пространства. Выбирайте качество
          </p>
        </div>

        {/* Right Scrollable Part */}
        <div className="md:w-1/2 p-4 md:p-8 overflow-y-auto">
          {selectedSeries ? (
            // Detail view for a series
            <div className="py-12">
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
                
                <div className="rounded-lg p-6">
                  <div className="flex flex-row items-center justify-between space-x-6">
                    <div className="flex-1">
                      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        {selectedSeries.name}
                      </h2>
                      <p className="text-gray-400">
                        {selectedSeries.colors.length} доступных вариантов
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
                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                     </svg>
                     Назад к цветам серии
                   </button>
                   <h3 className="text-2xl font-bold text-white mb-2">Рамки</h3>
                   <p className="text-gray-400">Все доступные рамки для серии {selectedSeries.name}</p>
                 </div>
                 
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 gap-y-8 sm:gap-y-12 mb-8 sm:mb-12">
                   {selectedSeries.frames?.map((frame) => (
                     <Link key={frame.id} href={frame.url}>
                       <div className="group cursor-pointer">
                         <div className="rounded-lg overflow-hidden transition-all duration-300 hover:border-red-500">
                           <div className="aspect-square p-3 flex items-center justify-center">
                             <Image
                               src={frame.image}
                               alt={frame.name}
                               width={120}
                               height={120}
                               className="object-contain max-w-full max-h-full group-hover:scale-105 transition-transform duration-300"
                             />
                           </div>
                           <div className="p-3">
                             <h3 className="font-medium text-white group-hover:text-red-400 transition-colors duration-300 text-center text-sm leading-tight">
                               {frame.name}
                             </h3>
                           </div>
                         </div>
                       </div>
                     </Link>
                   ))}
                 </div>
 
                 <div className="border-t pt-6">
                   <h3 className="text-xl font-bold text-white mb-4">Цвета серии {selectedSeries.name}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 gap-y-8 sm:gap-y-12 mb-8 sm:mb-12">
                     {selectedSeries.colors.map((color) => (
                       <Link key={color.id} href={color.url}>
                         <div className="group cursor-pointer">
                           <div className="rounded-lg overflow-hidden transition-all duration-300 hover:border-red-500">
                             <div className="aspect-square p-3 flex items-center justify-center">
                               <Image
                                 src={color.image}
                                 alt={color.name}
                                 width={120}
                                 height={120}
                                 className="object-contain max-w-full max-h-full group-hover:scale-105 transition-transform duration-300"
                               />
                             </div>
                             <div className="p-3">
                               <h3 className="font-medium text-white group-hover:text-red-400 transition-colors duration-300 text-center text-sm leading-tight">
                                 {color.name}
                               </h3>
                             </div>
                           </div>
                         </div>
                       </Link>
                     ))}
                   </div>
                 </div>
               </>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 gap-y-8 sm:gap-y-12 mb-8 sm:mb-12">
                    {selectedSeries.colors.map((color) => (
                      <Link key={color.id} href={color.url}>
                        <div className="group cursor-pointer">
                          <div className="rounded-lg overflow-hidden transition-all duration-300 hover:border-red-500">
                            <div className="aspect-square p-3 flex items-center justify-center">
                              <Image
                                src={color.image}
                                alt={color.name}
                                width={120}
                                height={120}
                                className="object-contain max-w-full max-h-full group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="p-3">
                              <h3 className="font-medium text-white group-hover:text-red-400 transition-colors duration-300 text-center text-sm leading-tight">
                                {color.name}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  {selectedSeries.frames && selectedSeries.frames.length > 0 && (
                    <>
                    
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-12 mb-12">
                        {selectedSeries.frames.slice(0, 6).map((frame) => (
                          <Link key={frame.id} href={frame.url}>
                            <div className="group cursor-pointer">
                              <div className="rounded-lg overflow-hidden transition-all duration-300 hover:border-red-500">
                                <div className="aspect-square p-3 flex items-center justify-center">
                                  <Image
                                    src={frame.image}
                                    alt={frame.name}
                                    width={120}
                                    height={120}
                                    className="object-contain max-w-full max-h-full group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                <div className="p-3">
                                  <h3 className="font-medium text-white group-hover:text-red-400 transition-colors duration-300 text-center text-sm leading-tight">
                                    {frame.name}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            // SERIES LIST VIEW (initial view)
            <div className="py-44">
              <div className="mb-8">
                <h2 className="text-4xl text-white font-bold mb-4">
                  Серии Werkel
                </h2>
              </div>
              <div className="flex flex-col gap-6 ">
                {werkelSeriesData.map((series) => (
                  <div
                    key={series.id}
                    onClick={() => handleSeriesClick(series)}
                    className="group cursor-pointer h-full"
                  >
                    <div className="bg-[#101010] border border-white/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-red-500 hover:shadow-lg h-full">
                      <div className="flex items-center p-6 h-full min-h-[160px]">
                        <div className="flex-1 pr-6 flex flex-col justify-center">
                          <div className="w-56 h-20 sm:w-64 sm:h-24 md:w-80 md:h-28 lg:w-72 lg:h-32 mb-2 sm:mb-3">
                            <Image
                              src="/images/brands/werkellogo.png"
                              alt="Werkel"
                              width={400}
                              height={400}
                              sizes="(max-width: 640px) 224px, (max-width: 768px) 256px, 320px"
                              className="object-contain w-full h-full"
                            />
                          </div>
                          {/* Название серии скрыто в списке */}
                          <p className="text-white text-base mb-4 leading-relaxed">
                            {series.description}
                          </p>
                          <div className="flex  -ml-1 items-center bg-[#272626] rounded-full px-3 py-2 text-white">
                            
                            <span className="text-sm">Смотреть серию</span>
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0 w-[300px] sm:w-[300px] md:w-[600px]  lg:w-[600px] lg:h-[600px] h-[300px] sm:h-[300px] md:h-[300px]">
                          <div className="w-full h-full rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <Image
                              src={series.image}
                              alt={series.name}
                              width={400}
                              height={400}
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
